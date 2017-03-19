Bbase.MODULE['BbaseDropDown'] = 'ui/bbase/dropdown/controllers/BbaseDropDown.js';
Bbase.DIRECTIVE['bbaseuidropdown'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');

    this._require(['BbaseDropDown'], function (BbaseDropDown) {
      var viewId = object.viewId;
      this._region(viewId, BbaseDropDown, {
        el: 'body',
        append: true,
        target: selector,
        postData: object.postData,
        content: object.content,
        moduleId: object.moduleId,
        mouseFollow: object.mouseFollow,
        mouseHover: object.mouseHover,
        data: object.data || {},
        items: object.items
      });
    });
  }
}
