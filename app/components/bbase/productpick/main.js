Bbase.MODULE['BbaseProductPick'] = 'components/bbase/productpick/controllers/BbaseProductPick.js';


Bbase.DIRECTIVE['bbasecomponentproductpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'productList']);
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentproductpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        title: '选择产品',
        moduleId: 'BbaseProductPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 522,
        items: object.items,
        productIdPath: object.productIdPath,
        picPathPath: object.picPathPath,
        namePath: object.namePath,
        addTimePath: object.addTimePath,
        domain:object.domain,
        size: object.size,
        listApi: object.listApi,
        data: {
          cur: this._get(object.cur) || object.default || '',
          productList:this._get(object.productList)  || [],
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