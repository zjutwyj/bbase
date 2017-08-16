Bbase.MODULE['BbaseProductCatePick'] = 'components/bbase/product-cate-pick/controllers/BbaseProductCatePick.js';
Bbase.DIRECTIVE['bbasecomponentproductcatepick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'productCateList']);
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
        productCateIdPath: object.productCateIdPath,
        picPathPath: object.picPathPath,
        namePath: object.namePath,
        addTimePath: object.addTimePath,
        domain:object.domain,
        size: object.size,
        listApi: object.listApi,
        data: {
          cur: this._get(object.cur) || object.default || '',
          cateList:this._get(object.cateList)  || [],
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