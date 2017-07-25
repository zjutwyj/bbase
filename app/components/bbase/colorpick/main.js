Bbase.MODULE['BbaseColorPick'] = 'components/bbase/colorpick/controllers/BbaseColorPick.js';
Bbase.DIRECTIVE['bbasecomponentcolorpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentcolorpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: 'BbaseColorPick',
        width: object.width || 400,
        cover: true,
        height: object.height || 256,
        quickClose: true,
        color: this._get(object.cur) || object.default || object.cur || '#ffffff',
        onChange: this._bind(function (result) {
          this._set(object.cur, result);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
