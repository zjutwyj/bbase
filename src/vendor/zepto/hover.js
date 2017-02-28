;(function($){
  $.extend($.fn, {
    hover: function(fn1, fn2){
      var timeout = null, hovering = false, element = this;

    function enter(){
      fn1.call(this);
      timeout = null;
      hovering = true;
    }

    function leave(){
      fn2.call(this);
      timeout = null;
      hovering = false;
    }

    function reset(){
      if(timeout) clearTimeout(timeout);
      timeout = null;
    }

    element.bind('mouseover', function(){
      if(hovering)
        reset();
      else
        if(!timeout) timeout = setTimeout(enter, 250);
    });

    element.bind('mouseout', function(){
      if(hovering){
        if(timeout) reset();
        timeout = setTimeout(leave, 150);
      } else {
        reset();
      }
    });
    }
  });
})(Zepto);