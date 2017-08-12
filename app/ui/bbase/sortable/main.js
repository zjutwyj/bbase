Bbase.MODULE['BbaseSortable'] = 'ui/bbase/sortable/controllers/BbaseSortable.js';

Bbase.DIRECTIVE['bbaseuisortable'] = {
  bind: function(value, selector) {
    var _this = this;
    var object = this._getObject(value);
    object.id = object.id || 'sortable';
    this._require(['BbaseSortable'], function(Sortable) {
      this[object.id] = Sortable.create(this.$(selector).get(0), {
        animation: 150,
        handle: object.handle || 'li',
        draggable: object.draggable || 'li',
        onStart: function( /**Event*/ evt) {},
        onEnd: this._bind(function( /**Event*/ evt) {

          var list = [];
          var $list = null;

          if (!this._options.subRender && this._insertOrder) {
            this._insertOrder(evt.oldIndex, evt.newIndex, function(list) {
              if (object.onEnd) {
                object.onEnd.call(this, evt, list, false);
              }
            });
          } else if (this._options.subRender && this._insertOrder) {
            $list = this.list.children();
            $list.each(function(i) {
              var _child = this;
              if (i >= Math.min(evt.oldIndex, evt.newIndex) && i <= Math.max(evt.newIndex, evt.oldIndex)) {

                _this._super('view').collection.each(function(model) {
                  if (model.view.cid === $(_child).attr('data-cid')) {
                    list.push(model);
                  }
                });
              }

            });
            if (object.onEnd) {
              object.onEnd.call(this, evt, list, true);
            }
          } else if (this._super('view') && this._super('view')._insertOrder) {
            $list = $(evt.target).children();
            $list.each(function(i) {
              var _child = this;
              if (i >= Math.min(evt.oldIndex, evt.newIndex) && i <=Math.max(evt.newIndex, evt.oldIndex)) {

                _this._super('view').collection.each(function(model) {
                  if (model.view.cid === $(_child).attr('data-cid')) {
                    list.push(model);
                  }
                });
              }

            });
            if (object.onEnd) {
              object.onEnd.call(this, evt, list, true);
            }
            /* this._super('view')._insertOrder(evt.oldIndex, evt.newIndex, function (list) {
               if (object.onEnd) {
                 object.onEnd.call(this, evt, list);
               }
             });*/
          } else if (object.onEnd) {
            object.onEnd.call(this, evt);
          }
        })
      });
    });
  },
  show: function(object) {

  },
  unbind: function(object) {
    if (this[object.id]) {
      this[object.id].disable && this[object.id].disable();
      this[object.id] = null;
    }
  }
}