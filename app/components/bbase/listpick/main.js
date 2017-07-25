Bbase.MODULE['BbaseListPick'] = 'components/bbase/listpick/controllers/BbaseListPick.js';

Bbase.DIRECTIVE['bbasecomponentlistpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentlistpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        title: object.title,
        moduleId: 'BbaseListPick',
        viewId: viewId,
        width: object.width || 220,
        cover: BbaseEst.typeOf(object.cover) === 'boolean' ? object.cover : false,
        height: object.height || 250,
        items: object.items,
        listApi: object.listApi,
        detailApi: object.detailApi,
        cache: object.cache,
        session: object.session,
        quickClose: BbaseEst.typeOf(object.quickClose) === 'boolean' ? object.quickClose : false,
        onChange: this._bind(function (result) {
          this._set(object.cur, result[0].serverPath);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
