Bbase.MODULE['BbasePhotoGallery'] = 'components/bbase/photogallery/controllers/BbasePhotoGallery.js';

Bbase.DIRECTIVE['bbasecomponentphotogallery'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentphotogallery');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        title: object.title,
        moduleId: 'BbasePhotoGallery',
        width: object.width || 876,
        cover: true,
        height: object.height || 542,
        cur: this._get(object.cur) || object.default || object.cur,
        quickClose: false,
        onChange: this._bind(function (result) {
          this._set(object.cur, result);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
