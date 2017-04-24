Bbase.MODULE['BbaseDialog'] = 'ui/bbase/dialog/controllers/BbaseDialog.js';
Bbase.DIRECTIVE['bbaseuidialog'] = {
  bind: function (value, selector) {
    var object = this._getObject(value);
    var viewId = object.viewId || BbaseEst.nextUid('bbaseuidialog');
    $(selector).click(this._bind(function (e) {
      this._dialog({
        viewId: viewId,
        moduleId: object.moduleId,
        title: object.title,
        target: object.follow ? $(selector).get(0) : object.target ? $(object.target).get(0) : null,
        width: object.width || 'auto',
        height: object.height || 'auto',
        cover: object.cover,
        content: object.content,
        quickClose: object.quickClose,
        align: object.align,
        onReady: this._bind(function(){
          BbaseApp.getCurrentDialog().reset();
          if (object.onReady) object.onReady.call(this, arguments.slice(0));
        }),
        onChange: this._bind(function () {
          if (object.onChange) object.onChange.call(this, arguments.slice(0));
        })
      });
      return false;
    }));
  }
}
