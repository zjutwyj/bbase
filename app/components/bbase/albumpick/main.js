Bbase.MODULE['BbaseAlubmPick'] = 'components/bbase/albumpick/controllers/BbaseAlbumPick.js';
Bbase.DIRECTIVE['bbasecomponentalbumpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentalbumpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: 'BbaseAlubmPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 585,
        cur: this._get(object.cur),
        items: object.items,
        listApi: object.listApi,
        detailApi: object.detailApi,
        size: object.size,
        domain: object.domain,
        quickClose: true,
        manageHref: object.manageHref || 'http://www.jihui88.com/member/index.html#/album',
        onChange: this._bind(function (result, init) {
          this._set(object.cur, result.album_id);
          if (object.onChange) object.onChange.call(this, result, init);
        })
      });
      return false;
    }));
  }
}
