Bbase.MODULE['BbaseNavigatorPick'] = 'components/bbase/navigator-pick/controllers/BbaseNavigatorPick.js';
Bbase.DIRECTIVE['bbasecomponentnavigatorpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'navigatorList']);
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentnavigatorpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        title: '选择导航',
        moduleId: 'BbaseNavigatorPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 522,
        items: object.items,
        navigatorIdPath: object.navigatorIdPath,
        namePath: object.namePath,
        parentIdPath: object.parentIdPath,
        domain:object.domain,
        size: object.size,
        listApi: object.listApi,
        data: {
          cur: this._get(object.cur) || object.default || '',
          navigatorList:this._get(object.navigatorList)  || [],
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