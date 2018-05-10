Bbase.MODULE['BbaseDatePicker'] = 'ui/bbase/date_picker/controllers/BbaseDatePicker.js';
Bbase.DIRECTIVE['bbaseuidatepicker'] = {
  bind: function(value, selector) {
    var _this = this;
    var object = this._getObject(value, 'cur');
    object.id = object.id || BbaseEst.nextUid('datepicker');
    object.theme = object.theme || '01';
    this._require(['BbaseDatePicker'], function(BbaseDatePicker) {
      var $el = _this.$(selector);

      if (object.theme === '01') {
        $el.dateDrop({
            animate: false,
            format: 'Y-m-d',
            maxYear: '2100'
          });
      } else if (object.theme==='02'){
        $el.dateDropper();
      }
      $el.change(function(event) {
        if (typeof _this._get(object.cur) !== 'undefined' && !BbaseEst.isEmpty(object.cur) ) {
          _this._set(object.cur, $(this).val());
        }
      });

    });
  },
  unbind: function(object) {
    if (this[object.id]) {
      this[object.id].destory && this[object.id].destory();
      this[object.id] = null;
    }
  }
}