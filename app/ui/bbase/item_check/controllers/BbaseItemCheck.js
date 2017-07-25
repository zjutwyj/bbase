'use strict';
/**
 * @description 样式选择
 * @class UI - ui库
 * @author yongjin<zjut_wyj@163.com> 2015/4/8
 */
define('BbaseItemCheck', [], function(require, exports, module) {
  var BbaseItemCheck, model, collection, item;

  model = BbaseModel.extend({
    baseId: 'id',
    defaults: BbaseEst.extend({}, BbaseModel.prototype.defaults)
  });

  collection = BbaseCollection.extend({
    model: model
  });

  item = BbaseItem.extend({
    tagName: 'div',
    className: 'ui-item-check',
    events: {
      'click .toggle': 'toggleChecked',
      'mouseenter .toggle': 'mouseEnter'
    },
    afterRender: function() {
      if (this._super('view')) this.options.data.cur = this._super('view').getCurValue();
      if ((this.options.data.compare && this.options.data.compare.call(this, this.model.toJSON(), this.options.data.cur)) ||
        (this.options.data.cur !== '-' && this._super('view')._options.checkAppend ? this.options.data.cur.indexOf(this._getValue(this.options.data.path)) > -1 :this.options.data.cur === this._getValue(this.options.data.path))) {
        this.toggleChecked(undefined, true);
      }
    },
    mouseEnter: function(e) {
      if (this._options.data.mouseEnter) this._options.data.mouseEnter.call(this, this.model.toJSON());
    },
    toggleChecked: function(e, init) {
      this._check(e);
      if (init) {
        if (this._options.data.target) $(this._options.data.target).val(this.options.data.cur);
      } else {
        if (this._options.data.target) $(this._options.data.target).val(this._checkAppend && this._super('view') ?
          this._super('view').getAppendValue() : this._get('value'));
      }
      this.result = this.options.data.onChange.call(this, this.model.attributes, init, e, (init ? this._super('options').cur : this._super('view').getValue()));
      if (BbaseEst.typeOf(this.result) === 'boolean' && !this.result) return false;
    }
  });
  /**
   * 单选
   * @method [单选] - BbaseItemCheck
   * @example
   *      app.addView('BbaseItemCheck', new BbaseItemCheck({
   *        el: '#BbaseItemCheck',
   *        viewId: 'BbaseItemCheck',
   *        tpl: '<em>{{text}}</em>',
   *        cur: 'value_b',
   *        target: '#model-src',
   *        init: true, // 只初始化， 不执行change回调
   *        path: 'value',
   *        items: [
   *          { text: 'a', value: 'value_a' },
   *          { text: 'b', value: 'value_b' },
   *          { text: 'c', value: 'value_c' },
   *          { text: 'd', value: 'value_d' },
   *          { text: 'e', value: 'value_e' }
   *        ],
   *        onChange: function (item, init, event) {
   *          console.dir(app.getView('BbaseItemCheck')._getCheckedIds('value'));
   *        },
   *        compare: function(item) {   // 自定义比较器
   *          if (item.value === cur || item.rgb === cur){
   *            return true;
   *          } else{
   *            return false;
   *          }
   *        },
   *        mouseEnter: function (model) {
   *
   *        }
   *      }));
   */
  BbaseItemCheck = BbaseList.extend({
    initialize: function() {
      this.targetVal = $(this.options.target).val();
      this.options.data = BbaseEst.extend(this.options.data || {}, {
        template: this.options.tpl || '<span class="item-check-text">{{text}}</span>',
        onChange: this.options.onChange || function() {},
        cur: this.options.cur || (BbaseEst.isEmpty(this.targetVal) ? '-' : this.targetVal),
        compare: this.options.compare,
        path: this.options.path || 'value',
        target: this.options.target,
        mouseEnter: this.options.mouseEnter
      });
      this._super({
        template: '<div class="bbase-ui-itemcheck item-check-wrap ui-itemcheck ' + (this.options.theme || 'ui-item-check-normal') +
          ' clearfix"><div class="toggle clearfix">' + this.options.data.template +
          '<span class="check-icon x-icon x-icon-small x-icon-info clearfix">' +
          '<i class="bbasefont bbase-yuandian icon-white"></i></span></div></div>',
        model: model,
        collection: collection,
        item: item,
        render: '.item-check-wrap',
        checkAppend: BbaseEst.typeOf(this.options.checkAppend) === 'boolean' ?
          this.options.checkAppend : false
      });
    },
    setValue: function(value) {
      if (typeof value === 'undefined' || value === this.options.data.cur) return;
      this.options.data.cur = value;
      BbaseEst.each(this.views, this._bind(function(view) {
        var isBoolean = BbaseEst.typeOf(value) === 'boolean';
        if (value !== '-' && this._super('view')._options.checkAppend ? isBoolean ? value === view._get(this.options.data.path):value.indexOf(view._get(this.options.data.path)) !== -1:value === view._get(this.options.data.path) && !view._get('checked')) {
          view.toggleChecked(true, true);
        } else if ((value === '-' || this._super('view')._options.checkAppend ? isBoolean ? value !== view._get(this.options.data.path) : value.indexOf(view._get(this.options.data.path)) ===-1:value !== view._get(this.options.data.path)) && view._get('checked')) {
          view.toggleChecked(false, true);
        }
      }));
    },
    getCurValue: function() {
      return this.options.data.cur;
    },
    setList: function(items){
      this._setModels(items);
    },
    getValue: function() {
      return BbaseEst.map(this._getCheckedItems(true), this._bind(function(item) {
        return item[this.options.data.path];
      })).join(',')
    },
    getAppendValue: function() {
      return BbaseEst.chain(BbaseEst.cloneDeep(this._getCheckedItems(true)))
        .pluck(this.options.path || 'value').value().join(',');
    }
  });

  module.exports = BbaseItemCheck;
});
