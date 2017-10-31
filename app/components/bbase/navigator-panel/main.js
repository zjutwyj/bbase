Bbase.MODULE['BbaseNavigatorPanel'] = 'components/bbase/navigator-panel/controllers/BbaseNavigatorPanel.js';

Bbase.DIRECTIVE['bbasecomponentnavigatorpanel'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentnavigatorpanel');

    this._require(['BbaseNavigatorPanel'], function (BbaseNavigatorPanel) {
      this._region(viewId, BbaseNavigatorPanel, {
        el: this.$(selector),
        cur: this._get(object.cur) || object.default || '',
        listApi: object.listApi,
        detailApi: object.detailApi,
        baseId: object.baseId,
        items: object.items,
        width: object.width,
        path: object.path || 'id',
        height: object.height,
        detailModule: object.detailModule,
        onChange: BbaseEst.proxy(function (item, init) {
          if (!item) return;
          this._set(object.cur, item[object.path||'id']);
          if (object.onChange) object.onChange.call(this, item, init);
        }, this),
        onShow:this._bind(function () {
          if (object.onShow){object.onShow.call(this);}
        }),
        onSortEnd:this._bind(function(evt, list){
          if (object.onSortEnd){
            object.onSortEnd.call(this, evt, list);
          }
        })
      });
      if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
        this._watch([object.cur], '', function () {
          this._view(viewId).setValue(this._get(object.cur || 'id'));
        });
      }
      this._watch([object.cur], '', function(){
          this._view(viewId).setValue(this._get(object.cur || 'id'));
      });
    });

  }
}
