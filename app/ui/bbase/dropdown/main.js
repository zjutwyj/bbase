Bbase.MODULE['BbaseDropDown'] = 'ui/bbase/dropdown/controllers/BbaseDropDown.js';

function baseBbaseDropdown(value, selector, theme) {
  this._require(['BbaseDropDown'], function (BbaseDropDown) {
    var _this = this;
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
      lazyLoad: object.lazyLoad,
      align: object.align,
      items: object.items,
      theme: theme,
      onReady: function () {
        if (object.onReady){
          object.onReady.call(_this);
        }
      },
      onShow: function(){
        //this.reset && this.reset();
        if (object.onShow){
          object.onShow.call(_this);
        }
      }
    });
  });
}


Bbase.DIRECTIVE['bbaseuidropdown'] = {
  bind: function (value, selector) {
    baseBbaseDropdown.apply(this, [value, selector, null]);
  }
}
Bbase.DIRECTIVE['bbaseuidropdownwin'] = {
  bind: function (value, selector) {
    baseBbaseDropdown.apply(this, [value, selector, 'win']);
  }
}
Bbase.DIRECTIVE['bbaseuidropdownwix'] = {
  bind: function(value, selector){
    baseBbaseDropdown.apply(this, [value, selector, 'wix']);
  }
}