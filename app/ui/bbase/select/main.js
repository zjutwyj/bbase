/**
 * @description config
 * @namespace config
 * @author yongjin<zjut_wyj@163.com> 2014/12/11
 */
Bbase.MODULE['BbaseSelect'] = 'ui/bbase/select/controllers/BbaseSelect.js';
Bbase.DIRECTIVE['bbaseuiselect'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'items']);

    this._require(['BbaseSelect'], function (Select) {
      var viewId = object.viewId;
      this._region(viewId, Select, {
        el: this.$(selector),
        target: object.target,
        postData: object.postData,
        cur: typeof(this._get(object.cur)) !== 'undefined' ? this._get(object.cur) : object.default,
        items: this._get(object.items) || object.items,
        width: object.width,
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
      this._watch([object.items], '', function(){
          this._view(viewId).setList(this._get(object.items));
      });
    });
  }
}
