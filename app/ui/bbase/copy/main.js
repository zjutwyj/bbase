Bbase.MODULE['BbaseCopy'] = 'ui/bbase/copy/controllers/BbaseCopy.js';
Bbase.DIRECTIVE['bbaseuicopy'] = {
  bind: function(value, selector) {
    var _this = this;
    var object = this._getObject(value, 'cur');
    object.id = object.id || BbaseEst.nextUid('copy');
    this._require(['BbaseCopy'], function(Clipboard) {
      var $el = _this.$(selector);
      this[object.id] = new Clipboard($el.get(0), {
        text: function(trigger) {
          return _this._get(object.cur) || object.default;
        }
      });

      this[object.id].on('success', function(e) {
        BbaseUtils.tip('已复制', {
          target: e.trigger,
          time:1000,
          align: 'top',
          skin: 'copy-tip'
        });
        if (object.success) {
          object.success.call(_this, e);
        }
        /*console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);*/
      });

      this[object.id].on('error', function(e) {
        BbaseUtils.tip('复制失败', {
          target: e.trigger
        });
        if (object.error) {
          object.error.call(_this, e);
        }
        /* console.error('Action:', e.action);
         console.error('Trigger:', e.trigger);*/
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