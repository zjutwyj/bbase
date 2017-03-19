Bbase.MODULE['FileUpload'] = 'components/bbase/photopick/vendor/jquery.fileupload.js';
Bbase.MODULE['BbasePhotoPick'] = 'components/bbase/photopick/controllers/BbasePhotoPick.js';
Bbase.DIRECTIVE['bbasecomponentphotopick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentmusicpick');

    $(selector).click(this._bind(function (e) {
      this._dialog({
        viewId: viewId,
        moduleId: 'BbasePhotoPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 542,
        items: object.items,
        listApi: object.listApi,
        detailApi: object.detailApi,
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