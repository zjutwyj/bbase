Bbase.MODULE['BbaseColorPanel'] = 'components/bbase/colorpanel/controllers/BbaseColorPanel.js';
Bbase.DIRECTIVE['bbasecomponentcolorpanel'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentcolorpanel');
    this._require(['BbaseColorPanel'], function (BbaseColorPanel) {
      this._region(viewId, BbaseColorPanel, {
        el: this.$(selector),
        color: this._get(object.cur) || object.default || object.cur || '#ffffff',
        onChange: BbaseEst.proxy(function (color, init) {
          this._set(object.cur, color);
          if (object.onChange) object.onChange.call(this, color, init);
        }, this)
      });
    });
  }
}
