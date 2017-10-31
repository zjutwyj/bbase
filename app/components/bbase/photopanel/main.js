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
        size: object.size,
        showCropBtn: object.showCropBtn,
        onCrop: this._bind(function(pic){
          if (object.onCrop) object.onCrop.call(this, pic);
        }),
        showSettingBtn: object.showSettingBtn,
        onChange: BbaseEst.proxy(function (item, init, obj) {
          this._set(object.cur, item);
          if (object.onChange) object.onChange.call(this, item, init, obj);
        }, this)
      });
    });
    if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
      this._watch([object.cur], '', function () {
        this._view(viewId).setValue(this._get(object.cur));
      });
    }
  }
}
