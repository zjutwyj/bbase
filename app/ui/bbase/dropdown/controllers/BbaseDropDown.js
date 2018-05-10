'use strict';
/**
 * @description BbaseDropDown
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/1/27
 */
define('BbaseDropDown', [], function (require, exports, module) {
  var BbaseDropDown, template;

  template = `
    <div class="bbase-ui-dropdown bui-list-picker bui-picker bui-overlay bui-ext-position x-align-bl-tl bui-select-custom {{className}}" aria-disabled="false" aria-pressed="false"style="visibility: visible;width:{{width}}; display: none;">
      <div class="bui-simple-list bui-select-list" aria-disabled="false" aria-pressed="false" style="height: {{height}};overflow-x: {{overflowX}};width: {{width}};max-height: none;">
      </div>
      <div bb-show="showClose" class="popupWindowClose closeBtn bbasefont bbase-close_thin" bb-click="close"></div>
    </div>
  `;

  var template2 = `
    <div class=" bbase-ui-dropdown-wix-dialog dialog-align-right bui-list-picker header-account-dialog dialog-load-complete {{className}}" style="width:{{width}};display:none;">
      <div class="wix-header-dialog-chupchik" bb-watch="targetOffsetCenter:style" style="left: {{targetOffsetCenter}}px;"></div>
      <div class="header-dialog-content-wrapper">
        <div class="header-dialog-content bui-select-list" aria-hidden="false" style="height: {{height}};overflow-x: {{overflowX}};width: {{width}};max-height: none;">

        </div>
      </div>
    </div>
  `;

  /**
   * 下拉框
   * @method [下拉框] - BbaseDropDown
   * @author wyj 15.8.20
   */
  BbaseDropDown = BbaseView.extend({
    events: {
      'click .bui-list-picker': 'preventDefault'
    },
    initialize: function () {
      this._super({
        el: 'body',
        template: this.options.theme === 'wix' ? template2 : template
      });
    },
    initData: function () {
      return {
        showClose: false,
        targetOffsetCenter: 0,
        className: ''
      }
    },
    beforeRender: function () {
      var _this = this;
      _this.hasContent = false;
      _this.dropDownInit = true;
      _this.isShow = false;
      _this.stopHide = false;

      _this._options.align = _this._options.align || 'center';

      _this.model.set('width', _this._options.width ?
        (BbaseEst.typeOf(_this._options.width) === 'string' ?
          _this._options.width : (_this._options.width + 'px')) : 'auto');

      _this._set('showClose', _this._options.showClose);
      if (_this._options.theme === 'win') {
        _this._set('width', '100%');
        _this._set('showClose', true);
      }

      _this.model.set('height', _this._options.data.height ?
        (BbaseEst.typeOf(_this._options.data.height) === 'string' ?
          _this._options.data.height : (_this._options.data.height + 'px')) : 'auto');

      _this.model.set('overflowX', _this._options.data.overflowX ?
        _this._options.data.overflowX : 'hidden');

      _this.model.set('overflowY', _this._options.data.overflowY ?
        _this._options.data.overflowY : 'hidden');

      _this._set('className', _this._options.className || '');

    },
    afterRender: function () {
      this.initType();
    },
    initType: function () {
      var _this = this;
      _this.$picker = _this.$('.bui-list-picker');
      _this.$target = $(_this._options.target);
      _this.$content = _this.$('.bui-select-list');
      if (_this._options.mouseHover) {
        _this.$target.hover(_this._bind(_this.show), function () {
          _this.hideTimeout = setTimeout(function () {
            if (!_this.stopHide) {
              _this.hide();
            }
          }, 100);
        });
        _this.$target.click(function (e) {
          e.stopImmediatePropagation();
          _this.show(e);
        });
        _this.$picker.hover(function (e) {
          _this.stopHide = true;
          clearTimeout(_this.hideTimeout);
          _this.hideTimeout = null;
        }, function (e) {
          _this.stopHide = false;
          _this.hideTimeout = setTimeout(function () {
            if (!_this.stopHide) {
              _this.hide();
            }
          }, 100);
        });
        if (_this._options.mouseFollow) {
          _this.$target.mousemove(_this._bind(_this.show));
          _this.$target.mouseout(_this._bind(_this.hide));
        }
        _this.$picker.click(function(event) {
          event.stopPropagation();
        });
      } else {
        _this.$target.click(function (e) {
          e.stopImmediatePropagation();
          if (_this.isShow) {
            _this.hide(e);
          } else {
            _this.show(e);
          }
        });
        //  Safari 3.1 到 6.0 版本代码
        _this.$picker.get(0).addEventListener("webkitTransitionEnd", _this._bind(_this.myFunction));
        // 标准语法
        _this.$picker.get(0).addEventListener("transitionend", _this._bind(_this.myFunction));
      }
      if (_this._options.theme) _this.$picker.addClass('bbase-ui-dropdown-' + _this._options.theme);
    },
    myFunction: function () {

      !this.isShow && this.$picker.hide();
      this.$picker.removeClass('bbaseDropdownMoveDownDebounce').addClass('bbaseDropdownMoveDownDebounce');

    },
    preventDefault: function (e) {
      e.stopImmediatePropagation();
      this.bindCloseEvent();
    },
    bindCloseEvent: function () {
      if (this._options.theme === 'win') {
        return; }
      $(document).one('click', BbaseEst.proxy(this.hide, this));
    },
    show: function (event) {
      this.isShow = true;
      if (event) event.stopImmediatePropagation();
      this.$picker.show();
      this.reset();
      if (!this.hasContent) {
        this.initContent();
      }
      if (this._options.theme === 'win') {
        this.$picker.css({
          'top': parseFloat(this._options.top, 10) || 0,
          'background-color': '#fff'
        });
      }
    },
    hide: function () {
      console.log('hide');
      this.isShow = false;
      if (this._options.theme === 'win') {
        this.$picker.css({
          'top': -this.$picker.height(),
          'background-color': 'transparent'
        });
      } else {
        this.$picker.hide();
      }
      this.$picker.removeClass('bbaseDropdownMoveDownDebounce');
    },
    reset: function () {
      var _this = this;
      var targetOffsetCenter = 0;
      if (!_this.$picker) return;

      if (!_this.hasContent) _this.initContent();
      //$(document).click();
      _this.bindCloseEvent();
      if (_this._options.theme === 'win') {
        _this.$picker.css({
          top: -_this.$picker.height()
        });
        return;
      }

      var tl = _this.$target.offset().left;
      var tt = _this.$target.offset().top;
      var tw = _this.$target.outerWidth();
      var th = _this.$target.outerHeight();
      var pw = _this._options.width || _this.$picker.outerWidth();
      var mw = pw / 2 - tw / 2;
      if (_this._options.align === 'left') {
        mw = 0;
        targetOffsetCenter = tw / 2;
      } else if (_this._options.align === 'right') {
        mw = 2 * tl + tw - pw;
        if (_this._options.mouseFollow) {
          mw = pw;
        }
        targetOffsetCenter = pw - tw / 2;
      } else {
        if (mw > tl) {
          mw = tl;
        }
        if (_this._options.mouseFollow) {
          mw = pw / 2;
        }
        targetOffsetCenter = pw / 2;
      }
      _this.$picker.css({
        left: _this._options.mouseFollow && event ? (event.pageX + 1 - mw) : Math.abs(tl - mw),
        top: _this._options.mouseFollow && event ? event.pageY + 1 : tt + th
      });
      _this._set('targetOffsetCenter', targetOffsetCenter);

      return this;
    },
    close: function () {
      this.hide();
      return this;
    },
    remove: function () {
      this.$picker.off().remove();
    },
    reflesh: function (callback) {
      this.hasContent = false;
      if (callback) callback.call(this, this._options);
      this.show();
    },
    initContent: function () {
      if (this._options.lazyLoad) {
        this._options.lazyLoad = false;
        return;
      };
      console.log('initContent');
      this.hasContent = true;
      if (this._options.content) {
        this.$content.html(this._options.content);
        this._options.dropDownId = this._options.viewId;
        if (this._options.callback)
          this._options.callback.call(this, this._options);
      } else if (this._options.moduleId) {
        //TODO moduleId
        if (BbaseEst.typeOf(this._options.moduleId) === 'string') {
          seajs.use([this._options.moduleId], BbaseEst.proxy(function (instance) {
            this.doRender(instance);
          }, this));
        }
         else{
          this.doRender(this._options.moduleId.call(this));
        }
      }
    },
    doRender: function (instance) {
      var _this = this;
      _this.viewId = BbaseEst.typeOf(_this._options.moduleId) === 'string' ? (_this._options.viewId.split('view0')[0] + 'drop_downview0' + _this._options.viewId.split('view0')[1]) : BbaseEst.nextUid('BbaseDropDown');
      delete _this._options.template;
      _this.$content.html('');
      // jquery对象无法通过BbaseEst.each遍历， 需备份到this._target,
      // 再移除target, 待克隆完成后把target添加到参数中
      if (_this._options.target && BbaseEst.typeOf(_this._options.target) !== 'String') {
        _this._target = _this._options.target;
        delete _this._options.target;
      }
      BbaseUtils.addRegionLoading(_this.$content);
      BbaseApp.addView(_this.viewId, new instance(BbaseEst.extend(BbaseEst.cloneDeep(_this._options), {
        el: _this.$content,
        dropDownId: _this._options.viewId,
        viewId: _this.viewId,
        afterRender: _this._options.callback,
        target: _this._target,
        onShow: function () {
          BbaseUtils.removeRegionLoading(_this.$content);
          _this.show();
          _this._options.onShow && _this._options.onShow.call(_this);
        }
      })));
    },
    reload: function(){
      var _this = this;
      BbaseApp.getView(_this.viewId)._reload && BbaseApp.getView(_this.viewId)._reload();
    },
    empty: function () {
      this.$el.off().remove();
    }
  });

  module.exports = BbaseDropDown;
});
