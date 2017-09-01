Bbase.MODULE['BbaseListExpand'] = 'ui/bbase/list_expand/controllers/BbaseListExpand.js';

Bbase.DIRECTIVE['bbaseuilistexpand'] = {
  bind: function (value, selector) {
     var object = this._getObject(value, 'cur');
     object.path = object.path || 'id';

     this._require(['BbaseListExpand'], function (Module) {
      this._region(object.viewId, Module, {
        el: this.$(selector),
        cur: this._get(object.cur) || object.default || object.cur,
        path: object.path,
        postData: object.postData,
        items: object.items,
        listApi: object.listApi,
        max: object.max,
        cache: object.cache,
        session: object.session,
        height:object.height,
        onChange: this._bind(function (item, init, b, c) {
          if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur) && !init) {
            this._set(object.cur, item[object.path]);
          }
          if (object.onChange) {
            return object.onChange.apply(this, [item, init, b, c]);
          }
        })
      });
      if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
        this._watch([object.cur], '', function () {
          this._view(object.viewId).setValue(this._get(object.cur));
        });
      }
    });
  },
  unbind: function(){

  }
}