Bbase.MODULE['BbaseSortable'] = 'ui/bbase/sortable/controllers/BbaseSortable.js';

Bbase.DIRECTIVE['bbaseuisortable'] = {
  bind: function (value, selector) {
    var object = this._object = this._getObject(value);
    object.id = object.id || 'sortable';
    this._require(['BbaseSortable'], function (Sortable) {
      this[object.id] = Sortable.create(this.$(selector).get(0), {
        animation: 150,
        handle: object.handle || 'li',
        draggable: object.draggable || 'li',
        onStart: function ( /**Event*/ evt) {},
        onEnd: this._bind(function ( /**Event*/ evt) {
          if (this._insertOrder) {
            this._insertOrder(evt.oldIndex, evt.newIndex, function (list) {
              if (object.onEnd) {
                object.onEnd.call(this, evt, list);
              }
            });
          } else if (object.onEnd) {
            object.onEnd.call(this, evt);
          }
        })
      });
    });
  },
  unbind: function () {
    if (this[this._object.id]) {
      this[this._object.id].disable && this[this._object.id].disable();
      this[this._object.id] = null;
    }
  }
}
