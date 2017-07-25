'use strict';
/**
 * @description 模块功能说明
 * @class BbaseScrollfix
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseScrollfix', [], function(require, exports, module){
  var BbaseScrollfix;

  ;(function($) {
  jQuery.fn.scrollFix = function(height, dir, options) {
    options = options || {};
    height = height || 0;
    height = height == "top" ? 0 : height;
    return this.each(function() {
      if (height == "bottom") {
        height = document.documentElement.clientHeight - this.scrollHeight;
      } else if (height < 0) {
        height = document.documentElement.clientHeight - this.scrollHeight + height;
      }
      var that = $(this),
        oldHeight = false,
        p, r, l = that.offset().left;

      var oldPosition = that.css('position'),
        oldLeft = that.css('left'),
        oldTop = that.css('top');
        if (oldLeft === 'auto'){
          oldLeft = that.position().left;
        }
      dir = dir == "bottom" ? dir : "top"; //默认滚动方向向下
      if (window.XMLHttpRequest) { //非ie6用fixed


        function getHeight() { //>=0表示上面的滚动高度大于等于目标高度
          return (document.documentElement.scrollTop || document.body.scrollTop) + height - that.offset().top;
        }
        $(window).scroll(function() {
          if (oldHeight === false) {
            if ((getHeight() >= 0 && dir == "top") || (getHeight() <= 0 && dir == "bottom")) {
              oldHeight = that.offset().top - height;
              that.css({
                position: "fixed",
                top: height,
                left: options.left || l
              });
            }
          } else {
            if (dir == "top" && (document.documentElement.scrollTop || document.body.scrollTop) < oldHeight) {
              that.css({
                position: oldPosition,
                left: oldLeft,
                top: oldTop
              });
              oldHeight = false;
            } else if (dir == "bottom" && (document.documentElement.scrollTop || document.body.scrollTop) > oldHeight) {
              that.css({
                position: oldPosition,
                left: oldLeft,
                top: oldTop
              });
              oldHeight = false;
            }
          }
        });
      } else { //for ie6
        $(window).scroll(function() {
          if (oldHeight === false) { //恢复前只执行一次，减少reflow
            if ((getHeight() >= 0 && dir == "top") || (getHeight() <= 0 && dir == "bottom")) {
              oldHeight = that.offset().top - height;
              r = document.createElement("span");
              p = that[0].parentNode;
              p.replaceChild(r, that[0]);
              document.body.appendChild(that[0]);
              that[0].style.position = "absolute";
            }
          } else if ((dir == "top" && (document.documentElement.scrollTop || document.body.scrollTop) < oldHeight) || (dir == "bottom" && (document.documentElement.scrollTop || document.body.scrollTop) > oldHeight)) { //结束
            that[0].style.position = oldPosition;
            that[0].style.left = oldLeft;
            that[0].style.top = oldTop;
            p.replaceChild(that[0], r);
            r = null;
            oldHeight = false;
          } else { //滚动
            that.css({
              left: l,
              top: height + document.documentElement.scrollTop
            })
          }
        });
      }
    });
  };
})(jQuery);

  BbaseScrollfix = function(options){
    this.options = options || {
      height: 0,
      dir: 'top'
    };
    this.$el = $(options.el);
  }

  BbaseScrollfix.prototype = {
    start : function(){
        this.$el.scrollFix(this.options.height || 0, this.options.dir || "top", {
        });
    },
    destory: function(){
      this.$el.off();
    }
  }

  module.exports = BbaseScrollfix;
});