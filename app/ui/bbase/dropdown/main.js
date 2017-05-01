Bbase.MODULE['BbaseDropDown'] = 'ui/bbase/dropdown/controllers/BbaseDropDown.js';

function baseDropdown(value, selector, theme) {
  this._require(['BbaseDropDown'], function (BbaseDropDown) {
    var object = this._getObject(value, 'cur');
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
      width: object.width,
      showClose: object.showClose,
      top: object.top,
      lazy: object.lazy,
      align: object.align,
      items: object.items,
      theme: theme,
      onReady: function () {
        if (!object.lazy){
          this.reset && this.reset();
        }
      }
    });
  });
}


Bbase.DIRECTIVE['bbaseuidropdown'] = {
  bind: function (value, selector) {
    baseDropdown.apply(this, [value, selector, null]);
  }
}
Bbase.DIRECTIVE['bbaseuidropdownwin'] = {
  bind: function (value, selector) {
    baseDropdown.apply(this, [value, selector, 'win']);
  }
}
