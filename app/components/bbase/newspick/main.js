Bbase.MODULE['BbaseNewsPick'] = 'components/bbase/newspick/controllers/BbaseNewsPick.js';


Bbase.DIRECTIVE['bbasecomponentnewspick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'newsList']);
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentnewspick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        title: '选择新闻',
        moduleId: 'BbaseNewsPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 522,
        items: object.items,
        newsIdPath: object.newsIdPath,
        picPathPath: object.picPathPath,
        titlePath: object.titlePath,
        originPath: object.originPath,
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