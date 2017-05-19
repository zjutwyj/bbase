Bbase.MODULE['BbaseScrollbar'] = 'ui/bbase/scrollbar/controllers/BbaseScrollbar.js';

// 文档：http://wiki.jikexueyuan.com/project/iscroll-5/basicfeatures.html

Bbase.DIRECTIVE['bbaseuiscrollbar'] = {
  bind: function (value, selector) {
    var object = this._object = this._getObject(value);
    object.id = object.id || 'iscroll';
    this.$(selector).css({
      position: 'relative',
      overflow:'hidden'
    });
    this._require(['BbaseScrollbar'], function (IScroll) {
      var isMobile = navigator.userAgent.toLowerCase().match(/(iPad|ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|win ce)/i) != null;
      this[object.id] = new IScroll(this.$(selector).get(0), {
        click: BbaseEst.typeOf(object.click) === 'boolean' ? object.click : true,
        mouseWheel: BbaseEst.typeOf(object.mouseWheel) === 'boolean' ? object.mouseWheel : true,
        scrollbars: BbaseEst.typeOf(object.scrollbars) === 'boolean' ? object.mouseWheel : true,
        fadeScrollbars: BbaseEst.typeOf(object.fadeScrollbars) === 'boolean' ? object.fadeScrollbars : true,
        disableMouse: BbaseEst.typeOf(object.disableMouse) === 'boolean' ? object.mouseWheel : isMobile ? true : false,
        disablePointer:  BbaseEst.typeOf(object.disablePointer) === 'boolean' ? object.mouseWheel : true,
        interactiveScrollbars:  BbaseEst.typeOf(object.interactiveScrollbars) === 'boolean' ? object.mouseWheel : true,
      });
    });
    return {
      id: object.id
    }
  },
  unbind: function (object) {
    if (this[this._object.id]) {
      this[this._object.id].disable && this[this._object.id].disable();
      this[this._object.id] = null;
    }
  }
}
