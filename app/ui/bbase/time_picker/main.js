Bbase.MODULE['BbaseTimePicker'] = 'ui/bbase/time_picker/controllers/BbaseTimePicker.js';
Bbase.DIRECTIVE['bbaseuitimepicker'] = {
  bind: function(value, selector) {
    var _this = this;
    var object = this._getObject(value, 'cur');
    object.id = object.id || BbaseEst.nextUid('timepicker');
    object.theme = object.theme || '01';
    object.mainColor = object.mainColor || '#0797FF';
    var cur = this._get(object.cur) || object.default || object.cur;
    this._require(['BbaseTimePicker'], function(BbaseTimePicker) {
      var $el = _this.$(selector);

      if (object.theme === '01') {
        $el.timeDropper({
          meridians: false,
          format: 'HH:mm',
          primaryColor: object.mainColor,
          borderColor: object.mainColor
        });
      } else if (object.theme === '02') {
        $el.clockTimePicker({
          colors: {
            clockFaceColor: '#EEEEEE',
            clockInnerCircleTextColor: '#888888',
            clockOuterCircleTextColor: '#000000',
            hoverCircleColor: '#DDDDDD',
            popupBackgroundColor: '#FFFFFF',
            popupHeaderTextColor: '#FFFFFF',
            selectorNumberColor: '#FFFFFF',
            buttonTextColor: object.mainColor,
            popupHeaderBackgroundColor: object.mainColor,
            selectorColor: object.mainColor,
          }
        });
      }

    });
  },
  unbind: function(object) {
    if (this[object.id]) {
      this[object.id].destory && this[object.id].destory();
      this[object.id] = null;
    }
  }
}