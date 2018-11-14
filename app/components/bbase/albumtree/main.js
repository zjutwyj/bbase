Bbase.MODULE['BbaseAlbumTree'] = 'components/bbase/albumtree/controllers/BbaseAlbumTree.js';
Bbase.DIRECTIVE['bbasecomponentalbumtree'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'categoryList']);
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentalbumtree');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        title: '选择相册分类',
        moduleId: 'BbaseAlbumTree',
        width: object.width || 876,
        cover: true,
        height: object.height || 522,
        items: object.items,
        categoryIdPath: object.categoryIdPath,
        imagePath: object.imagePath,
        namePath: object.namePath,
        parentIdPath: object.parentIdPath,
        domain:object.domain,
        manageHref: object.manageHref,
        size: object.size,
        listApi: object.listApi,
        data: {
          cur: this._get(object.cur) || object.default || '',
          categoryList:this._get(object.categoryList)  || [],
        },
        quickClose: true,
        onChange: this._bind(function (result, items) {
          this._set(object.cur, result);
          if (object.onChange) object.onChange.call(this, result, items);
        })
      });
      return false;
    }));

  }
}