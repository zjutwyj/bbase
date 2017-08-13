/**
 * @description offsetRelative
 * @class offsetRelative
 * @author yongjin<zjut_wyj@163.com> 2015/3/29
 */
;(function ($, undefined) {
  $.fn.offsetRelative = function (el) {
    var $el=$(el), o1=this.offset(), o2=$el.offset();
    o1.top  -= o2.top  - $el.scrollTop();
    o1.left -= o2.left - $el.scrollLeft();
    return o1;
  };
  $.fn.positionRelative = function (top) {
    return $(this).offsetRelative(top);
  };
})(Zepto);
