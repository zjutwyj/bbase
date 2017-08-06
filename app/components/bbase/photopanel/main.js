Bbase.MODULE['BbasePhotoPanel'] = 'components/bbase/photopanel/controllers/BbasePhotoPanel.js';
Bbase.DIRECTIVE['bbasecomponentphotopanel'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentphotopanel');

    this._require(['BbasePhotoPanel'], function (BbasePhotoPanel) {
      this._region(viewId, BbasePhotoPanel, {
        el: this.$(selector),
        cur: this._get(object.cur) || object.default || '',
        listApi: object.listApi,
        items: object.items,
        width: object.width,
        showCropBtn: object.showCropBtn,
        showSettingBtn: object.showSettingBtn,
        onChange: BbaseEst.proxy(function (item, init) {
          this._set(object.cur, item);
          if (object.onChange) object.onChange.call(this, item, init);
        }, this)
      });
    });

  }
}
