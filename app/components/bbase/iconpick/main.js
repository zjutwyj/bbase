Bbase.MODULE['BbaseIconPick'] = 'components/bbase/iconpick/controllers/BbaseIconPick.js';
Bbase.DIRECTIVE['bbasecomponenticonpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, ['cur', 'iconColor', 'iconColorState']);
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponenticonpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: 'BbaseIconPick',
        icon: this._get(object.cur) || object.default || object.cur,
        iconColorState: this._get(object.iconColorState),
        iconColor: this._get(object.iconColor),
        font: object.font,
        width: object.width || 518,
        cover: true,
        items: object.items,
        postData: object.postData,
        height: object.height || 335,
        showTypeSelect: object.showTypeSelect,
        showSearch: object.showSearch,
        iconType: object.iconType || 'default',
        iconTypeItems: object.iconTypeItems,
        quickClose: true,
        onChange: this._bind(function (result) {
          this._set(object.cur, result.icon);
          object.iconColor && this._set(object.iconColor, result.iconColor);
          object.iconColorState && this._set(object.iconColorState, result.iconColorState);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
