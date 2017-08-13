Bbase.MODULE['BbaseShapePick'] = 'components/bbase/shapepick/controllers/BbaseShapePick.js';
Bbase.DIRECTIVE['bbasecomponentshapepick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentshapepick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: 'BbaseShapePick',
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
          this._set(object.cur, result.svg);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
