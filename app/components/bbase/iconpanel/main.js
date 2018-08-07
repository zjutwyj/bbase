Bbase.MODULE['BbaseIconPanel'] = 'components/bbase/iconpanel/controllers/BbaseIconPanel.js';
Bbase.DIRECTIVE['bbasecomponenticonpanel'] = {
  bind: function(value, selector) {
    var object = this._getObject(value, 'cur');
    var viewId = object.viewId || BbaseEst.nextUid('bbasecomponenticonpanel');

    this._require(['BbaseIconPanel'], function(BbaseIconPanel) {
      this._region(viewId, BbaseIconPanel, {
        el: this.$(selector),
        cover: true,
        postData: object.postData,

        width: object.width,
        height: object.height || 272,
        size: object.size,

        icon: this._get(object.cur) || object.default || object.cur,
        iconColorState: object.iconColorState,
        iconColor: object.iconColor,
        font: object.font,
        items: object.items,
        showTypeSelect: object.showTypeSelect,
        iconType: object.iconType,
        iconTypeItems: object.iconTypeItems,

        onChange: BbaseEst.proxy(function(result) {
          this._set(object.cur, result.icon);
          object.iconColor && this._set(object.iconColor, result.iconColor);
          object.iconColorState && this._set(object.iconColorState, result.iconColorState);
          if (object.onChange) object.onChange.call(this, result);

        }, this)
      });
    });
    if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
      this._watch([object.cur], '', function() {
        this._view(viewId).setValue(this._get(object.cur));
      });
    }
  }
}