Bbase.MODULE['BbaseColorPanel'] = 'components/bbase/colorpick/controllers/BbaseColorPanel.js';
Bbase.DIRECTIVE['bbasecomponentcolorpanel'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentcolorpanel');
    this._require(['BbaseColorPanel'], function (BbaseColorPanel) {
      var cur = this._get(object.cur) || object.default || object.cur || '#ffffff';
      this._region(viewId, BbaseItemCheck, {
        el: this.$(selector),
        onChange: BbaseEst.proxy(function (item) {
        }, this)
      });
    });
  }
}
