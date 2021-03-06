Bbase.MODULE['BbasePhotoPick'] = 'components/bbase/photopick/controllers/BbasePhotoPick.js';
Bbase.DIRECTIVE['bbasecomponentphotopick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentmusicpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: 'BbasePhotoPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 542,
        items: object.items,
        listApi: object.listApi,
        detailApi: object.detailApi,
        uploadApi: object.uploadApi,
        size: object.size,
        quickClose: true,
        onChange: this._bind(function (result) {
          this._set(object.cur, result[0].serverPath);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
