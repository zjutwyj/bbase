Bbase.MODULE['BbaseScrollbar'] = 'ui/bbase/scrollbar/controllers/BbaseScrollbar.js';

// 文档：http://wiki.jikexueyuan.com/project/iscroll-5/basicfeatures.html

Bbase.DIRECTIVE['bbaseuiscrollbar'] = {
  bind: function (value, selector) {
    var object = this._getObject(value);
    object.id = object.id || 'iscroll';
    this.$(selector).css({
      position: 'relative',
      overflow:'hidden'
    });
    this._require(['BbaseScrollbar'], function (IScroll) {
      var _this = this;
      var isMobile = navigator.userAgent.toLowerCase().match(/(iPad|ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|win ce)/i) != null;
      _this[object.id] = new IScroll(_this.$(selector).get(0), {
        click: BbaseEst.typeOf(object.click) === 'boolean' ? object.click : true,
        mouseWheel: BbaseEst.typeOf(object.mouseWheel) === 'boolean' ? object.mouseWheel : true,
        scrollbars: BbaseEst.typeOf(object.scrollbars) === 'boolean' ? object.mouseWheel : true,
        fadeScrollbars: BbaseEst.typeOf(object.fadeScrollbars) === 'boolean' ? object.fadeScrollbars : true,
        disableMouse: BbaseEst.typeOf(object.disableMouse) === 'boolean' ? object.disableMouse : isMobile ? true : false,
        disablePointer:  BbaseEst.typeOf(object.disablePointer) === 'boolean' ? object.mouseWheel : true,
        interactiveScrollbars:  BbaseEst.typeOf(object.interactiveScrollbars) === 'boolean' ? object.mouseWheel : true,
        preventDefault: BbaseEst.typeOf(object.preventDefault) === 'boolean' ? object.preventDefault : false
      });
      if (object.disableMouseMove){

        $(_this[object.id].scroller).on('mousedown', function () {
            $(_this[object.id].scroller).off('mousemove').on('mousemove', function (e) {
          e.stopImmediatePropagation();
        });
        });

        $(_this[object.id].scroller).on('mouseup', function () {
          $(_this[object.id].scroller).off('mousemove');
        });
      }
    });
    return {
      id: object.id
    }
  },
  show: function(object, value, selector){
    var _this = this;
    if (_this[object.id]) {
      _this[object.id].refresh();
      _this[object.id].on('scrollEnd', function () {
        if (this.y == this.minScrollY  && object.minScroll) {
          object.minScroll.call(_this);
        }
        if (this.y == this.maxScrollY && object.maxScroll) {
          object.maxScroll.call(_this);
        }
      });
    }
  },
  unbind: function (object) {
    if (this[object.id]) {
      this[object.id].disable && this[object.id].disable();
      this[object.id] = null;
    }
  }
}
