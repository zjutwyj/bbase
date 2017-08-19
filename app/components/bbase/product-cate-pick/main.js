Bbase.MODULE['BbaseProductCatePick'] = 'components/bbase/product-cate-pick/controllers/BbaseProductCatePick.js';
Bbase.DIRECTIVE['bbasecomponentproductcatepick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'categoryList']);
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentproductcatepick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        title: '选择产品分类',
        moduleId: 'BbaseProductCatePick',
        width: object.width || 876,
        cover: true,
        height: object.height || 522,
        items: object.items,
        categoryIdPath: object.categoryIdPath,
        imagePath: object.imagePath,
        namePath: object.namePath,
        parentIdPath: object.parentIdPath,
        domain:object.domain,
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