/**
 * @description config
 * @namespace config
 * @author yongjin<zjut_wyj@163.com> 2014/12/11
 */
Bbase.MODULE['BbaseSelect'] = 'ui/bbase/select/controllers/BbaseSelect.js';
//bb-uiselect="{viewId: 'getViewId',cur: args.sortType, items: items,target: '#model-value',onChange: handleChange}"
Bbase.DIRECTIVE['bbaseuiselect'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    this._require(['BbaseSelect'], function (Select) {
      var viewId = object.viewId;
      this._region(viewId, Select, {
        el: this.$(selector),
        target: object.target,
        postData: object.postData,
        cur: this._getDefault(object.cur, object.default || ''),
        items: object.items,
        onChange: this._bind(function (item, init, b, c) {
          if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur) && !init) {
            this._set(object.cur, item.value);
          }
          if (object.onChange) {
            return object.onChange.apply(this, [item, init, b, c]);
          }
        })
      });
      if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
        this._watch([object.cur], '', function () {
          this._view(viewId).setValue(this._get(object.cur));
        });
      }
    });
  }
}
