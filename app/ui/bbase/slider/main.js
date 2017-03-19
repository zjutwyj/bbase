Bbase.MODULE['BbaseSlider'] = 'ui/bbase/slider/controllers/BbaseSlider.js';
Bbase.DIRECTIVE['bbaseuislider'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');

    this._require(['BbaseSlider'], function (Select) {
      var viewId = object.viewId;
      this._region(viewId, Select, {
        el: this.$(selector),
        start: this._get(object.cur) || object.default || object.cur || [10],
        step: object.step || 1,
        range: object.range || { 'min': 0, 'max': 100 },
        width: object.width,
        onSlide: object.onSlide,
        onSet: object.onSet,
        onStart: object.onStart,
        onEnd: object.onEnd,
        onUpdate: object.onUpdate,
        onChange: this._bind(function (values, handle, init) {
          if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur) && !init) {
            this._set(object.cur, values[0]);
          }
          if (object.onChange) {
            return object.onChange.apply(this, [values, handle, init]);
          }
        })
      });
       if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
        this._watch([object.cur], '', function () {
          this._view(viewId).setValue(this._get(object.cur));
        });
      }
    });
  }
}