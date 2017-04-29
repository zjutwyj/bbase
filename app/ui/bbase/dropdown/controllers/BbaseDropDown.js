'use strict';
/**
 * @description BbaseDropDown
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/1/27
 */
define('BbaseDropDown', [], function (require, exports, module) {
  var BbaseDropDown, template;

  template = '<div class="bbase-ui-dropdown bui-list-picker bui-picker bui-overlay bui-ext-position x-align-bl-tl bui-select-custom" aria-disabled="false" aria-pressed="false"style="visibility: visible;width:{{width}}; display: none;"> <div class="bui-simple-list bui-select-list" aria-disabled="false" aria-pressed="false" style="height: {{height}};overflow-x: {{overflowX}};width: {{width}};max-height: none;"> 正在加载... </div> <div bb-show="showClose" class="popupWindowClose closeBtn bbasefont bbase-close_thin" bb-click="close"></div></div>';

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
        template: template
      });
    },
    initData: function () {
      return {
        showClose: false
      }
    },
    beforeRender: function () {
      this.hasContent = false;
      this.dropDownInit = true;
      this.isShow = false;

      this._options.align = this._options.align || 'center';

      this.model.set('width', this._options.data.width ?
        (BbaseEst.typeOf(this._options.data.width) === 'string' ?
          this._options.data.width : (this._options.data.width + 'px')) : 'auto');

      this._set('showClose', this._options.showClose);
      if (this._options.theme === 'win') {
        this._set('width', '100%');
        this._set('showClose', true);
      }

      this.model.set('height', this._options.data.height ?
        (BbaseEst.typeOf(this._options.data.height) === 'string' ?
          this._options.data.height : (this._options.data.height + 'px')) : 'auto');

      this.model.set('overflowX', this._options.data.overflowX ?
        this._options.data.overflowX : 'hidden');

      this.model.set('overflowY', this._options.data.overflowY ?
        this._options.data.overflowY : 'hidden');

    },
    afterRender: function () {
      this.initType();
    },
    initType: function () {
      this.$picker = this.$('.bui-list-picker');
      this.$target = $(this._options.target);
      this.$content = this.$('.bui-select-list');
      if (this._options.mouseHover) {
        this.$target.hover(BbaseEst.proxy(this.show, this), BbaseEst.proxy(this.hide, this));
        if (this._options.mouseFollow) {
          this.$target.mousemove(BbaseEst.proxy(this.show, this));
          this.$target.mouseout(BbaseEst.proxy(this.hide, this));
        }
      } else {
        this.$target.click(BbaseEst.proxy(function (e) {
          e.stopImmediatePropagation();
          if (this.isShow) {
            this.hide(e);
          } else {
            this.show(e);
          }
        }, this));
        //  Safari 3.1 到 6.0 版本代码
        this.$picker.get(0).addEventListener("webkitTransitionEnd", this._bind(this.myFunction));
        // 标准语法
        this.$picker.get(0).addEventListener("transitionend", this._bind(this.myFunction));
      }
      if (this._options.theme) this.$picker.addClass('bbase-ui-dropdown-' + this._options.theme);
    },
    myFunction: function () {

       !this.isShow&& this.$picker.hide();
       this.$picker.removeClass('bbaseDropdownMoveDownDebounce').addClass('bbaseDropdownMoveDownDebounce');

    },
    preventDefault: function (e) {
      e.stopImmediatePropagation();
      this.bindCloseEvent();
    },
    bindCloseEvent: function () {
      if (this._options.theme === 'win'){return;}
      $(document).one('click', BbaseEst.proxy(this.hide, this));
    },
    show: function (event) {
      this.reset();
      this.isShow = true;
      if (event) event.stopImmediatePropagation();
      this.$picker.show();
      if (this._options.theme === 'win') {
        this.$picker.css({
          'top': parseFloat(this._options.top, 10) || 0,
          'background-color': '#fff'
        });
      }
    },
    hide: function () {
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
      if (!_this.$picker) return;

      if (!_this.hasContent) _this.initContent();
      $(document).click();
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
      } else if (_this._options.align === 'right') {
        mw = 2 * tl + tw - pw;
        if (_this._options.mouseFollow) {
          mw = pw;
        }
      } else {
        if (mw > tl) {
          mw = tl;
        }
        if (_this._options.mouseFollow) {
          mw = pw / 2;
        }
      }
      _this.$picker.css({
        left: _this._options.mouseFollow && event ? (event.pageX + 1 - mw) : Math.abs(tl - mw),
        top: _this._options.mouseFollow && event ? event.pageY + 1 : tt + th
      });

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
        } else {
          this.doRender(this._options.moduleId);
        }
      }
    },
    doRender: function (instance) {
      this.viewId = BbaseEst.typeOf(this._options.moduleId) === 'string' ? (this._options.viewId + 'drop_down') : BbaseEst.nextUid('BbaseDropDown');
      delete this._options.template;
      this.$content.html('');
      // jquery对象无法通过BbaseEst.each遍历， 需备份到this._target,
      // 再移除target, 待克隆完成后把target添加到参数中
      if (this._options.target && BbaseEst.typeOf(this._options.target) !== 'String') {
        this._target = this._options.target;
        delete this._options.target;
      }
      BbaseApp.addView(this.viewId, new instance(BbaseEst.extend(BbaseEst.cloneDeep(this._options), {
        el: this.$content,
        dropDownId: this._options.viewId,
        viewId: this.viewId,
        afterRender: this._options.callback,
        target: this._target
      })));
    },
    empty: function () {
      this.$el.off().remove();
    }
  });

  module.exports = BbaseDropDown;
});
