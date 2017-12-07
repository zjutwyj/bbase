Bbase.MODULE['BbaseAlbumPanel'] = 'components/bbase/albumpanel/controllers/BbaseAlbumPanel.js';
Bbase.DIRECTIVE['bbasecomponentalbumpanel'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentalbumpanel');

    this._require(['BbaseAlbumPanel'], function (BbaseAlbumPanel) {
      this._region(viewId, BbaseAlbumPanel, {
        el: this.$(selector),
        cur: this._get(object.cur) || object.default || '',
        listApi: object.listApi,
        items: object.items,
        width: object.width,
        size: object.size,
        mainPic: object.mainPic,
        manageHref:object.manageHref,
        domain: object.domain,
        showSettingBtn: object.showSettingBtn,
        onChange: BbaseEst.proxy(function (item, init) {
          this._set(object.cur, item.albumId);
          if (object.onChange) object.onChange.call(this, item, init);
        }, this)
      });
    });

  }
}
