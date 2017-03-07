'use strict';
/**
 * @description BbaseDropDown
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/1/27
 */
define('BbaseDropDown', [], function(require, exports, module) {
  var BbaseDropDown, template;

  template = '<div class="bui-list-picker bui-picker bui-overlay bui-ext-position x-align-bl-tl bui-select-custom" aria-disabled="false" aria-pressed="false"style="visibility: visible;width:{{width}}; display: none;"> <div class="bui-simple-list bui-select-list" aria-disabled="false" aria-pressed="false" style="height: {{height}};overflow-x: {{overflowX}};width: {{width}};max-height: none;"> 正在加载... </div> </div>';

  /**
   * 下拉框
   * @method [下拉框] - BbaseDropDown
   * @author wyj 15.8.20
   */
  BbaseDropDown = BbaseView.extend({
    events: {
      'click .bui-list-picker': 'preventDefault'
    },
    initialize: function() {
      this._initialize({
        el: 'body',
        template: template
      });
    },
    beforeRender: function() {
      this.hasContent = false;

      this.model.set('width', this._options.data.width ?
        (BbaseEst.typeOf(this._options.data.width) === 'string' ?
          this._options.data.width : (this._options.data.width + 'px')) : 'auto');

      this.model.set('height', this._options.data.height ?
        (BbaseEst.typeOf(this._options.data.height) === 'string' ?
          this._options.data.height : (this._options.data.height + 'px')) : 'auto');

      this.model.set('overflowX', this._options.data.overflowX ?
        this._options.data.overflowX : 'hidden');

      this.model.set('overflowY', this._options.data.overflowY ?
        this._options.data.overflowY : 'hidden');

    },
    afterRender: function() {
      this.initType();
    },
    initType: function() {
      this.$picker = this.$('.bui-list-picker');
      this.$target = $(this._options.target);
      this.$content = this.$('.bui-select-list');
      if (this._options.mouseHover) {
        this.$target.hover(BbaseEst.proxy(this.show, this), BbaseEst.proxy(this.hide, this));
        if (this._options.mouseFollow) {
          this.$target.mousemove(BbaseEst.proxy(this.show, this));
        }
      } else {
        this.$target.click(BbaseEst.proxy(this.show, this));
      }

    },
    preventDefault: function(e) {
      e.stopImmediatePropagation();
      this.bindCloseEvent();
    },
    bindCloseEvent: function() {
      $(document).one('click', BbaseEst.proxy(this.hide, this));
    },
    show: function(event) {
      if (event) event.stopImmediatePropagation();
      $(document).click();
      this.$picker.css({
        left: this._options.mouseFollow ? event.pageX + 1 : this.$target.offset().left,
        top: this._options.mouseFollow ? event.pageY + 1 : this.$target.offset().top + this.$target.height()
      }).show();
      if (!this.hasContent) this.initContent();
      this.bindCloseEvent();
      return this;
    },
    close: function() {
      this.hide();
      return this;
    },
    remove: function() {
      this.$picker.off().remove();
    },
    reflesh: function(callback) {
      this.hasContent = false;
      if (callback) callback.call(this, this._options);
      this.show();
    },
    initContent: function() {
      this.hasContent = true;
      if (this._options.content) {
        this.$content.html(this._options.content);
        this._options.dropDownId = this._options.viewId;
        if (this._options.callback)
          this._options.callback.call(this, this._options);
      } else if (this._options.moduleId) {
        //TODO moduleId
        if (BbaseEst.typeOf(this._options.moduleId) === 'string') {
          seajs.use([this._options.moduleId], BbaseEst.proxy(function(instance) {
            this.doRender(instance);
          }, this));
        } else {
          this.doRender(this._options.moduleId);
        }
      }
    },
    doRender: function(instance) {
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
    hide: function() {
      this.$picker.hide();
    },
    empty: function() {
      this.$el.off().remove();
    }
  });

  module.exports = BbaseDropDown;
});
