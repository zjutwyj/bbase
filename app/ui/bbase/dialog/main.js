Bbase.MODULE['BbaseDialog'] = 'ui/bbase/dialog/controllers/BbaseDialog.js';
Bbase.DIRECTIVE['bbaseuidialog'] = {
  bind: function (value, selector) {
    var object = this._getObject(value);
    var viewId = object.viewId || BbaseEst.nextUid('bbaseuidialog');
    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: object.moduleId,
        title: object.title,
        target: object.follow ? $(selector).get(0) : object.target ? $(object.target).get(0) : null,
        width: object.width || 'auto',
        height: object.height || 'auto',
        left: object.mouse ? e.pageX : undefined,
        top: object.mouse ? e.pageY : undefined,
        cover: object.cover,
        data: BbaseEst.extend({
          id: object.id
        }, object.data || {}),
        content: object.content,
        quickClose: object.quickClose,
        onClose: object.onClose,
        align: object.align,
        onReady: this._bind(function(){
          BbaseApp.getCurrentDialog().reset();
          if (object.onReady) object.onReady.call(this, arguments.length > 0 ? arguments.slice(0) : null);
        }),
        afterShow: function(){
          BbaseApp.getCurrentDialog().reset();
        },
        onChange: this._bind(function () {
          if (object.onChange) object.onChange.call(this, arguments.length > 0 ? arguments.slice(0) : null);
        })
      });
      return false;
    }));
  }
}
