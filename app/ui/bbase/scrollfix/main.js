Bbase.MODULE['BbaseScrollfix'] = 'ui/bbase/scrollfix/controllers/BbaseScrollfix.js';

Bbase.DIRECTIVE['bbaseuiscrollfix'] = {
  bind: function (value, selector) {
    var object = this._getObject(value);
    object.id = object.id || 'scrollfix';
    this.$(selector).css({
      position: this.$(selector).css('position') === 'static' ? 'relative' : 'absolute'
    });
    this._require(['BbaseScrollfix'], function (BbaseScrollfix) {
      this[object.id] = new BbaseScrollfix({
        el: this.$(selector),
        height: object.offset,
        dir: object.dir
      });
      this.scrollfixstatus = true;
    });
    return {
      id: object.id
    }
  },
  show: function (object) {
    var _this = this;
    var loop = function () {
      setTimeout(function () {
        if (_this.scrollfixstatus) {
          _this[object.id] && _this[object.id].start();
        } else {
          loop();
        }
      }, 500);
    }
    loop();
  },
  unbind: function (object) {
    if (this[object.id]) {
      this[object.id].destory && this[object.id].destory();
      this[object.id] = null;
    }
  }
}
