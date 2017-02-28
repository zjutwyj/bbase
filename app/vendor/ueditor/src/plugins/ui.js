// ui/ui.js
var baidu = baidu || {};
baidu.editor = baidu.editor || {};
UE.ui = baidu.editor.ui = {};

// ui/uiutils.js
(function (){
  var browser = baidu.editor.browser,
    domUtils = baidu.editor.dom.domUtils;

  var magic = '$EDITORUI';
  var root = window[magic] = {};
  var uidMagic = 'ID' + magic;
  var uidCount = 0;

  var uiUtils = baidu.editor.ui.uiUtils = {
    uid: function (obj){
      return (obj ? obj[uidMagic] || (obj[uidMagic] = ++ uidCount) : ++ uidCount);
    },
    hook: function ( fn, callback ) {
      var dg;
      if (fn && fn._callbacks) {
        dg = fn;
      } else {
        dg = function (){
          var q;
          if (fn) {
            q = fn.apply(this, arguments);
          }
          var callbacks = dg._callbacks;
          var k = callbacks.length;
          while (k --) {
            var r = callbacks[k].apply(this, arguments);
            if (q === undefined) {
              q = r;
            }
          }
          return q;
        };
        dg._callbacks = [];
      }
      dg._callbacks.push(callback);
      return dg;
    },
    createElementByHtml: function (html){
      var el = document.createElement('div');
      el.innerHTML = html;
      el = el.firstChild;
      el.parentNode.removeChild(el);
      return el;
    },
    getViewportElement: function (){
      return (browser.ie && browser.quirks) ?
        document.body : document.documentElement;
    },
    getClientRect: function (element){
      var bcr;
      //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
      try{
        bcr = element.getBoundingClientRect();
      }catch(e){
        bcr={left:0,top:0,height:0,width:0}
      }
      var rect = {
        left: Math.round(bcr.left),
        top: Math.round(bcr.top),
        height: Math.round(bcr.bottom - bcr.top),
        width: Math.round(bcr.right - bcr.left)
      };
      var doc;
      while ((doc = element.ownerDocument) !== document &&
        (element = domUtils.getWindow(doc).frameElement)) {
        bcr = element.getBoundingClientRect();
        rect.left += bcr.left;
        rect.top += bcr.top;
      }
      rect.bottom = rect.top + rect.height;
      rect.right = rect.left + rect.width;
      return rect;
    },
    getViewportRect: function (){
      var viewportEl = uiUtils.getViewportElement();
      var width = (window.innerWidth || viewportEl.clientWidth) | 0;
      var height = (window.innerHeight ||viewportEl.clientHeight) | 0;
      return {
        left: 0,
        top: 0,
        height: height,
        width: width,
        bottom: height,
        right: width
      };
    },
    setViewportOffset: function (element, offset){
      var rect;
      var fixedLayer = uiUtils.getFixedLayer();
      if (element.parentNode === fixedLayer) {
        element.style.left = offset.left + 'px';
        element.style.top = offset.top + 'px';
      } else {
        domUtils.setViewportOffset(element, offset);
      }
    },
    getEventOffset: function (evt){
      var el = evt.target || evt.srcElement;
      var rect = uiUtils.getClientRect(el);
      var offset = uiUtils.getViewportOffsetByEvent(evt);
      return {
        left: offset.left - rect.left,
        top: offset.top - rect.top
      };
    },
    getViewportOffsetByEvent: function (evt){
      var el = evt.target || evt.srcElement;
      var frameEl = domUtils.getWindow(el).frameElement;
      var offset = {
        left: evt.clientX,
        top: evt.clientY
      };
      if (frameEl && el.ownerDocument !== document) {
        var rect = uiUtils.getClientRect(frameEl);
        offset.left += rect.left;
        offset.top += rect.top;
      }
      return offset;
    },
    setGlobal: function (id, obj){
      root[id] = obj;
      return magic + '["' + id  + '"]';
    },
    unsetGlobal: function (id){
      delete root[id];
    },
    copyAttributes: function (tgt, src){
      var attributes = src.attributes;
      var k = attributes.length;
      while (k --) {
        var attrNode = attributes[k];
        if ( attrNode.nodeName != 'style' && attrNode.nodeName != 'class' && (!browser.ie || attrNode.specified) ) {
          tgt.setAttribute(attrNode.nodeName, attrNode.nodeValue);
        }
      }
      if (src.className) {
        domUtils.addClass(tgt,src.className);
      }
      if (src.style.cssText) {
        tgt.style.cssText += ';' + src.style.cssText;
      }
    },
    removeStyle: function (el, styleName){
      if (el.style.removeProperty) {
        el.style.removeProperty(styleName);
      } else if (el.style.removeAttribute) {
        el.style.removeAttribute(styleName);
      } else throw '';
    },
    contains: function (elA, elB){
      return elA && elB && (elA === elB ? false : (
        elA.contains ? elA.contains(elB) :
          elA.compareDocumentPosition(elB) & 16
        ));
    },
    startDrag: function (evt, callbacks,doc){
      var doc = doc || document;
      var startX = evt.clientX;
      var startY = evt.clientY;
      function handleMouseMove(evt){
        var x = evt.clientX - startX;
        var y = evt.clientY - startY;
        callbacks.ondragmove(x, y,evt);
        if (evt.stopPropagation) {
          evt.stopPropagation();
        } else {
          evt.cancelBubble = true;
        }
      }
      if (doc.addEventListener) {
        function handleMouseUp(evt){
          doc.removeEventListener('mousemove', handleMouseMove, true);
          doc.removeEventListener('mouseup', handleMouseUp, true);
          window.removeEventListener('mouseup', handleMouseUp, true);
          callbacks.ondragstop();
        }
        doc.addEventListener('mousemove', handleMouseMove, true);
        doc.addEventListener('mouseup', handleMouseUp, true);
        window.addEventListener('mouseup', handleMouseUp, true);

        evt.preventDefault();
      } else {
        var elm = evt.srcElement;
        elm.setCapture();
        function releaseCaptrue(){
          elm.releaseCapture();
          elm.detachEvent('onmousemove', handleMouseMove);
          elm.detachEvent('onmouseup', releaseCaptrue);
          elm.detachEvent('onlosecaptrue', releaseCaptrue);
          callbacks.ondragstop();
        }
        elm.attachEvent('onmousemove', handleMouseMove);
        elm.attachEvent('onmouseup', releaseCaptrue);
        elm.attachEvent('onlosecaptrue', releaseCaptrue);
        evt.returnValue = false;
      }
      callbacks.ondragstart();
    },
    getFixedLayer: function (){
      var layer = document.getElementById('edui_fixedlayer');
      if (layer == null) {
        layer = document.createElement('div');
        layer.id = 'edui_fixedlayer';
        document.body.appendChild(layer);
        if (browser.ie && browser.version <= 8) {
          layer.style.position = 'absolute';
          bindFixedLayer();
          setTimeout(updateFixedOffset);
        } else {
          layer.style.position = 'fixed';
        }
        layer.style.left = '0';
        layer.style.top = '0';
        layer.style.width = '0';
        layer.style.height = '0';
      }
      return layer;
    },
    makeUnselectable: function (element){
      if (browser.opera || (browser.ie && browser.version < 9)) {
        element.unselectable = 'on';
        if (element.hasChildNodes()) {
          for (var i=0; i<element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType == 1) {
              uiUtils.makeUnselectable(element.childNodes[i]);
            }
          }
        }
      } else {
        if (element.style.MozUserSelect !== undefined) {
          element.style.MozUserSelect = 'none';
        } else if (element.style.WebkitUserSelect !== undefined) {
          element.style.WebkitUserSelect = 'none';
        } else if (element.style.KhtmlUserSelect !== undefined) {
          element.style.KhtmlUserSelect = 'none';
        }
      }
    }
  };
  function updateFixedOffset(){
    var layer = document.getElementById('edui_fixedlayer');
    uiUtils.setViewportOffset(layer, {
      left: 0,
      top: 0
    });
//        layer.style.display = 'none';
//        layer.style.display = 'block';

    //#trace: 1354
//        setTimeout(updateFixedOffset);
  }
  function bindFixedLayer(adjOffset){
    domUtils.on(window, 'scroll', updateFixedOffset);
    domUtils.on(window, 'resize', baidu.editor.utils.defer(updateFixedOffset, 0, true));
  }
})();


// ui/uibase.js
(function () {
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    EventBase = baidu.editor.EventBase,
    UIBase = baidu.editor.ui.UIBase = function () {
    };

  UIBase.prototype = {
    className:'',
    uiName:'',
    initOptions:function (options) {
      var me = this;
      for (var k in options) {
        me[k] = options[k];
      }
      this.id = this.id || 'edui' + uiUtils.uid();
    },
    initUIBase:function () {
      this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));
    },
    render:function (holder) {
      var html = this.renderHtml();
      var el = uiUtils.createElementByHtml(html);

      //by xuheng 给每个node添加class
      var list = domUtils.getElementsByTagName(el, "*");
      var theme = "edui-" + (this.theme || this.editor.options.theme);
      var layer = document.getElementById('edui_fixedlayer');
      for (var i = 0, node; node = list[i++];) {
        domUtils.addClass(node, theme);
      }
      domUtils.addClass(el, theme);
      if(layer){
        layer.className="";
        domUtils.addClass(layer,theme);
      }

      var seatEl = this.getDom();
      if (seatEl != null) {
        seatEl.parentNode.replaceChild(el, seatEl);
        uiUtils.copyAttributes(el, seatEl);
      } else {
        if (typeof holder == 'string') {
          holder = document.getElementById(holder);
        }
        holder = holder || uiUtils.getFixedLayer();
        domUtils.addClass(holder, theme);
        holder.appendChild(el);
      }
      this.postRender();
    },
    getDom:function (name) {
      if (!name) {
        return document.getElementById(this.id);
      } else {
        return document.getElementById(this.id + '_' + name);
      }
    },
    postRender:function () {
      this.fireEvent('postrender');
    },
    getHtmlTpl:function () {
      return '';
    },
    formatHtml:function (tpl) {
      var prefix = 'edui-' + this.uiName;
      return (tpl
        .replace(/##/g, this.id)
        .replace(/%%-/g, this.uiName ? prefix + '-' : '')
        .replace(/%%/g, (this.uiName ? prefix : '') + ' ' + this.className)
        .replace(/\$\$/g, this._globalKey));
    },
    renderHtml:function () {
      return this.formatHtml(this.getHtmlTpl());
    },
    dispose:function () {
      var box = this.getDom();
      if (box) baidu.editor.dom.domUtils.remove(box);
      uiUtils.unsetGlobal(this.id);
    }
  };
  utils.inherits(UIBase, EventBase);
})();


// ui/separator.js
(function (){
  var utils = baidu.editor.utils,
    UIBase = baidu.editor.ui.UIBase,
    Separator = baidu.editor.ui.Separator = function (options){
      this.initOptions(options);
      this.initSeparator();
    };
  Separator.prototype = {
    uiName: 'separator',
    initSeparator: function (){
      this.initUIBase();
    },
    getHtmlTpl: function (){
      return '<div id="##" class="edui-box %%"></div>';
    }
  };
  utils.inherits(Separator, UIBase);

})();
// ui/mask.js
///import core
///import uicore
(function (){
  var utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils,
    UIBase = baidu.editor.ui.UIBase,
    uiUtils = baidu.editor.ui.uiUtils;

  var Mask = baidu.editor.ui.Mask = function (options){
    this.initOptions(options);
    this.initUIBase();
  };
  Mask.prototype = {
    getHtmlTpl: function (){
      return '<div id="##" class="edui-mask %%" onclick="return $$._onClick(event, this);" onmousedown="return $$._onMouseDown(event, this);"></div>';
    },
    postRender: function (){
      var me = this;
      domUtils.on(window, 'resize', function (){
        setTimeout(function (){
          if (!me.isHidden()) {
            me._fill();
          }
        });
      });
    },
    show: function (zIndex){
      this._fill();
      this.getDom().style.display = '';
      this.getDom().style.zIndex = zIndex;
    },
    hide: function (){
      this.getDom().style.display = 'none';
      this.getDom().style.zIndex = '';
    },
    isHidden: function (){
      return this.getDom().style.display == 'none';
    },
    _onMouseDown: function (){
      return false;
    },
    _onClick: function (e, target){
      this.fireEvent('click', e, target);
    },
    _fill: function (){
      var el = this.getDom();
      var vpRect = uiUtils.getViewportRect();
      el.style.width = vpRect.width + 'px';
      el.style.height = vpRect.height + 'px';
    }
  };
  utils.inherits(Mask, UIBase);
})();


// ui/popup.js
///import core
///import uicore
(function () {
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    domUtils = baidu.editor.dom.domUtils,
    UIBase = baidu.editor.ui.UIBase,
    Popup = baidu.editor.ui.Popup = function (options){
      this.initOptions(options);
      this.initPopup();
    };

  var allPopups = [];
  function closeAllPopup( evt,el ){
    for ( var i = 0; i < allPopups.length; i++ ) {
      var pop = allPopups[i];
      if (!pop.isHidden()) {
        if (pop.queryAutoHide(el) !== false) {
          if(evt&&/scroll/ig.test(evt.type)&&pop.className=="edui-wordpastepop")   return;
          pop.hide();
        }
      }
    }

    if(allPopups.length)
      pop.editor.fireEvent("afterhidepop");
  }

  Popup.postHide = closeAllPopup;

  var ANCHOR_CLASSES = ['edui-anchor-topleft','edui-anchor-topright',
    'edui-anchor-bottomleft','edui-anchor-bottomright'];
  Popup.prototype = {
    SHADOW_RADIUS: 5,
    content: null,
    _hidden: false,
    autoRender: true,
    canSideLeft: true,
    canSideUp: true,
    initPopup: function (){
      this.initUIBase();
      allPopups.push( this );
    },
    getHtmlTpl: function (){
      return '<div id="##" class="edui-popup %%" onmousedown="return false;">' +
        ' <div id="##_body" class="edui-popup-body">' +
        ' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
        ' <div class="edui-shadow"></div>' +
        ' <div id="##_content" class="edui-popup-content">' +
        this.getContentHtmlTpl() +
        '  </div>' +
        ' </div>' +
        '</div>';
    },
    getContentHtmlTpl: function (){
      if(this.content){
        if (typeof this.content == 'string') {
          return this.content;
        }
        return this.content.renderHtml();
      }else{
        return ''
      }

    },
    _UIBase_postRender: UIBase.prototype.postRender,
    postRender: function (){


      if (this.content instanceof UIBase) {
        this.content.postRender();
      }

      //捕获鼠标滚轮
      if( this.captureWheel && !this.captured ) {

        this.captured = true;

        var winHeight = ( document.documentElement.clientHeight || document.body.clientHeight )  - 80,
          _height = this.getDom().offsetHeight,
          _top = uiUtils.getClientRect( this.combox.getDom() ).top,
          content = this.getDom('content'),
          ifr = this.getDom('body').getElementsByTagName('iframe'),
          me = this;

        ifr.length && ( ifr = ifr[0] );

        while( _top + _height > winHeight ) {
          _height -= 30;
        }
        content.style.height = _height + 'px';
        //同步更改iframe高度
        ifr && ( ifr.style.height = _height + 'px' );

        //阻止在combox上的鼠标滚轮事件, 防止用户的正常操作被误解
        if( window.XMLHttpRequest ) {

          domUtils.on( content, ( 'onmousewheel' in document.body ) ? 'mousewheel' :'DOMMouseScroll' , function(e){

            if(e.preventDefault) {
              e.preventDefault();
            } else {
              e.returnValue = false;
            }

            if( e.wheelDelta ) {

              content.scrollTop -= ( e.wheelDelta / 120 )*60;

            } else {

              content.scrollTop -= ( e.detail / -3 )*60;

            }

          });

        } else {

          //ie6
          domUtils.on( this.getDom(), 'mousewheel' , function(e){

            e.returnValue = false;

            me.getDom('content').scrollTop -= ( e.wheelDelta / 120 )*60;

          });

        }

      }
      this.fireEvent('postRenderAfter');
      this.hide(true);
      this._UIBase_postRender();
    },
    _doAutoRender: function (){
      if (!this.getDom() && this.autoRender) {
        this.render();
      }
    },
    mesureSize: function (){
      var box = this.getDom('content');
      return uiUtils.getClientRect(box);
    },
    fitSize: function (){
      if( this.captureWheel && this.sized ) {
        return this.__size;
      }
      this.sized = true;
      var popBodyEl = this.getDom('body');
      popBodyEl.style.width = '';
      popBodyEl.style.height = '';
      var size = this.mesureSize();
      if( this.captureWheel ) {
        popBodyEl.style.width =  -(-20 -size.width) + 'px';
        var height = parseInt( this.getDom('content').style.height, 10 );
        !window.isNaN( height ) && ( size.height = height );
      } else {
        popBodyEl.style.width =  size.width + 'px';
      }
      popBodyEl.style.height = size.height + 'px';
      this.__size = size;
      this.captureWheel && (this.getDom('content').style.overflow = 'auto');
      return size;
    },
    showAnchor: function ( element, hoz ){
      this.showAnchorRect( uiUtils.getClientRect( element ), hoz );
    },
    showAnchorRect: function ( rect, hoz, adj ){
      this._doAutoRender();
      var vpRect = uiUtils.getViewportRect();
      this.getDom().style.visibility = 'hidden';
      this._show();
      var popSize = this.fitSize();

      var sideLeft, sideUp, left, top;
      if (hoz) {
        sideLeft = this.canSideLeft && (rect.right + popSize.width > vpRect.right && rect.left > popSize.width);
        sideUp = this.canSideUp && (rect.top + popSize.height > vpRect.bottom && rect.bottom > popSize.height);
        left = (sideLeft ? rect.left - popSize.width : rect.right);
        top = (sideUp ? rect.bottom - popSize.height : rect.top);
      } else {
        sideLeft = this.canSideLeft && (rect.right + popSize.width > vpRect.right && rect.left > popSize.width);
        sideUp = this.canSideUp && (rect.top + popSize.height > vpRect.bottom && rect.bottom > popSize.height);
        left = (sideLeft ? rect.right - popSize.width : rect.left);
        top = (sideUp ? rect.top - popSize.height : rect.bottom);
      }

      var popEl = this.getDom();
      uiUtils.setViewportOffset(popEl, {
        left: left,
        top: top
      });
      domUtils.removeClasses(popEl, ANCHOR_CLASSES);
      popEl.className += ' ' + ANCHOR_CLASSES[(sideUp ? 1 : 0) * 2 + (sideLeft ? 1 : 0)];
      if(this.editor){
        popEl.style.zIndex = this.editor.container.style.zIndex * 1 + 10;
        baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = popEl.style.zIndex - 1;
      }
      this.getDom().style.visibility = 'visible';

    },
    showAt: function (offset) {
      var left = offset.left;
      var top = offset.top;
      var rect = {
        left: left,
        top: top,
        right: left,
        bottom: top,
        height: 0,
        width: 0
      };
      this.showAnchorRect(rect, false, true);
    },
    _show: function (){
      if (this._hidden) {
        var box = this.getDom();
        box.style.display = '';
        this._hidden = false;
//                if (box.setActive) {
//                    box.setActive();
//                }
        this.fireEvent('show');
      }
    },
    isHidden: function (){
      return this._hidden;
    },
    show: function (){
      this._doAutoRender();
      this._show();
    },
    hide: function (notNofity){
      if (!this._hidden && this.getDom()) {
        this.getDom().style.display = 'none';
        this._hidden = true;
        if (!notNofity) {
          this.fireEvent('hide');
        }
      }
    },
    queryAutoHide: function (el){
      return !el || !uiUtils.contains(this.getDom(), el);
    }
  };
  utils.inherits(Popup, UIBase);

  domUtils.on( document, 'mousedown', function ( evt ) {
    var el = evt.target || evt.srcElement;
    closeAllPopup( evt,el );
  } );
  domUtils.on( window, 'scroll', function (evt,el) {
    closeAllPopup( evt,el );
  } );

})();


// ui/colorpicker.js
///import core
///import uicore
(function (){
  var utils = baidu.editor.utils,
    UIBase = baidu.editor.ui.UIBase,
    ColorPicker = baidu.editor.ui.ColorPicker = function (options){
      this.initOptions(options);
      this.noColorText = this.noColorText || this.editor.getLang("clearColor");
      this.initUIBase();
    };

  ColorPicker.prototype = {
    getHtmlTpl: function (){
      return genColorPicker(this.noColorText,this.editor);
    },
    _onTableClick: function (evt){
      var tgt = evt.target || evt.srcElement;
      var color = tgt.getAttribute('data-color');
      if (color) {
        this.fireEvent('pickcolor', color);
      }
    },
    _onTableOver: function (evt){
      var tgt = evt.target || evt.srcElement;
      var color = tgt.getAttribute('data-color');
      if (color) {
        this.getDom('preview').style.backgroundColor = color;
      }
    },
    _onTableOut: function (){
      this.getDom('preview').style.backgroundColor = '';
    },
    _onCustomColor: function(e){
      var $target = e.target ? $(e.target) : $(e.currentTarget);
      var ctx = this;
      var viewId = Est.nextUid('fontColor');
      Utils.dialog(Est.extend(app.getOption('dialog_min'),{
        id: 'fontColor',
        zIndex: 999999999,
        width: 'auto',
        align: 'left top',
        content: '<div class="font-color-picker'+viewId+'"></div>',
        target: $target.parents('.edui-popup:first').get(0),
        onshow: function(){
          seajs.use(['ColorPicker'], function(ColorPicker){
            app.addView(viewId, new ColorPicker({
              viewId: viewId,
              el:'.font-color-picker' + viewId,
              min: true,
              color: ctx.editor.queryCommandValue( ctx.cmdNameCustom ),
              change: function(color){
                ctx.getDom('preview').style.backgroundColor = color;
                window.showUeditorPopup = true;
                ctx.fireEvent('pickcolor', color);
                window.showUeditorPopup = false;
              },
              ok: function(color){
                ctx.fireEvent('pickcolor', color);
                app.getDialog('fontColor').close().remove();
              }
            }));
          });
        }
      }))
    },
    _onPickNoColor: function (){
      this.fireEvent('picknocolor');
    }
  };
  utils.inherits(ColorPicker, UIBase);

  var COLORS = (
    'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
    'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
    'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
    'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
    'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
    '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
    'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');

  function genColorPicker(noColorText,editor){
    var html = '<div id="##" class="edui-colorpicker %%">' +
      '<div class="edui-colorpicker-topbar edui-clearfix">' +
      '<div unselectable="on" id="##_preview" class="edui-colorpicker-preview"></div>' +
      '<div unselectable="on" class="edui-colorpicker-nocolor" onclick="$$._onPickNoColor(event, this);">'+ noColorText +'</div>' +
      '</div>' +
      '<table  class="edui-box" style="border-collapse: collapse;" onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);" cellspacing="0" cellpadding="0">' +
      '<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px"><td colspan="10">'+editor.getLang("themeColor")+'</td> </tr>'+
      '<tr class="edui-colorpicker-tablefirstrow" >';
    for (var i=0; i<COLORS.length; i++) {
      if (i && i%10 === 0) {
        html += '</tr>'+(i==60?'<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;"><td colspan="10">'+editor.getLang("standardColor")+'</td></tr>':'')+'<tr'+(i==60?' class="edui-colorpicker-tablefirstrow"':'')+'>';
      }
      html += i<70 ? '<td style="padding: 0 2px;"><a hidefocus title="'+COLORS[i]+'" onclick="return false;" href="javascript:" unselectable="on" class="edui-box edui-colorpicker-colorcell"' +
        ' data-color="#'+ COLORS[i] +'"'+
        ' style="background-color:#'+ COLORS[i] +';border:solid #ccc;'+
        (i<10 || i>=60?'border-width:1px;':
            i>=10&&i<20?'border-width:1px 1px 0 1px;':

          'border-width:0 1px 0 1px;')+
        '"' +
        '></a></td>':'';
    }
    html += '</tr></table><div style="  padding: 5px; width: 61px; cursor: pointer; border: 1px solid #3F3F3F;" onclick="$$._onCustomColor(event, this);">自定义颜色</div><div class="custom-color-wrap"></div></div>';
    return html;
  }
})();


// ui/tablepicker.js
///import core
///import uicore
(function (){
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase;

  var TablePicker = baidu.editor.ui.TablePicker = function (options){
    this.initOptions(options);
    this.initTablePicker();
  };
  TablePicker.prototype = {
    defaultNumRows: 10,
    defaultNumCols: 10,
    maxNumRows: 20,
    maxNumCols: 20,
    numRows: 10,
    numCols: 10,
    lengthOfCellSide: 22,
    initTablePicker: function (){
      this.initUIBase();
    },
    getHtmlTpl: function (){
      var me = this;
      return '<div id="##" class="edui-tablepicker %%">' +
        '<div class="edui-tablepicker-body">' +
        '<div class="edui-infoarea">' +
        '<span id="##_label" class="edui-label"></span>' +
        '</div>' +
        '<div class="edui-pickarea"' +
        ' onmousemove="$$._onMouseMove(event, this);"' +
        ' onmouseover="$$._onMouseOver(event, this);"' +
        ' onmouseout="$$._onMouseOut(event, this);"' +
        ' onclick="$$._onClick(event, this);"' +
        '>' +
        '<div id="##_overlay" class="edui-overlay"></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    },
    _UIBase_render: UIBase.prototype.render,
    render: function (holder){
      this._UIBase_render(holder);
      this.getDom('label').innerHTML = '0'+this.editor.getLang("t_row")+' x 0'+this.editor.getLang("t_col");
    },
    _track: function (numCols, numRows){
      var style = this.getDom('overlay').style;
      var sideLen = this.lengthOfCellSide;
      style.width = numCols * sideLen + 'px';
      style.height = numRows * sideLen + 'px';
      var label = this.getDom('label');
      label.innerHTML = numCols +this.editor.getLang("t_col")+' x ' + numRows + this.editor.getLang("t_row");
      this.numCols = numCols;
      this.numRows = numRows;
    },
    _onMouseOver: function (evt, el){
      var rel = evt.relatedTarget || evt.fromElement;
      if (!uiUtils.contains(el, rel) && el !== rel) {
        this.getDom('label').innerHTML = '0'+this.editor.getLang("t_col")+' x 0'+this.editor.getLang("t_row");
        this.getDom('overlay').style.visibility = '';
      }
    },
    _onMouseOut: function (evt, el){
      var rel = evt.relatedTarget || evt.toElement;
      if (!uiUtils.contains(el, rel) && el !== rel) {
        this.getDom('label').innerHTML = '0'+this.editor.getLang("t_col")+' x 0'+this.editor.getLang("t_row");
        this.getDom('overlay').style.visibility = 'hidden';
      }
    },
    _onMouseMove: function (evt, el){
      var style = this.getDom('overlay').style;
      var offset = uiUtils.getEventOffset(evt);
      var sideLen = this.lengthOfCellSide;
      var numCols = Math.ceil(offset.left / sideLen);
      var numRows = Math.ceil(offset.top / sideLen);
      this._track(numCols, numRows);
    },
    _onClick: function (){
      this.fireEvent('picktable', this.numCols, this.numRows);
    }
  };
  utils.inherits(TablePicker, UIBase);
})();


// ui/stateful.js
(function (){
  var browser = baidu.editor.browser,
    domUtils = baidu.editor.dom.domUtils,
    uiUtils = baidu.editor.ui.uiUtils;

  var TPL_STATEFUL = 'onmousedown="$$.Stateful_onMouseDown(event, this);"' +
    ' onmouseup="$$.Stateful_onMouseUp(event, this);"' +
    ( browser.ie ? (
      ' onmouseenter="$$.Stateful_onMouseEnter(event, this);"' +
      ' onmouseleave="$$.Stateful_onMouseLeave(event, this);"' )
      : (
      ' onmouseover="$$.Stateful_onMouseOver(event, this);"' +
      ' onmouseout="$$.Stateful_onMouseOut(event, this);"' ));

  baidu.editor.ui.Stateful = {
    alwalysHoverable: false,
    target:null,//目标元素和this指向dom不一样
    Stateful_init: function (){
      this._Stateful_dGetHtmlTpl = this.getHtmlTpl;
      this.getHtmlTpl = this.Stateful_getHtmlTpl;
    },
    Stateful_getHtmlTpl: function (){
      var tpl = this._Stateful_dGetHtmlTpl();
      // 使用function避免$转义
      return tpl.replace(/stateful/g, function (){ return TPL_STATEFUL; });
    },
    Stateful_onMouseEnter: function (evt, el){
      this.target=el;
      if (!this.isDisabled() || this.alwalysHoverable) {
        this.addState('hover');
        this.fireEvent('over');
      }
    },
    Stateful_onMouseLeave: function (evt, el){
      if (!this.isDisabled() || this.alwalysHoverable) {
        this.removeState('hover');
        this.removeState('active');
        this.fireEvent('out');
      }
    },
    Stateful_onMouseOver: function (evt, el){
      var rel = evt.relatedTarget;
      if (!uiUtils.contains(el, rel) && el !== rel) {
        this.Stateful_onMouseEnter(evt, el);
      }
    },
    Stateful_onMouseOut: function (evt, el){
      var rel = evt.relatedTarget;
      if (!uiUtils.contains(el, rel) && el !== rel) {
        this.Stateful_onMouseLeave(evt, el);
      }
    },
    Stateful_onMouseDown: function (evt, el){
      if (!this.isDisabled()) {
        this.addState('active');
      }
    },
    Stateful_onMouseUp: function (evt, el){
      if (!this.isDisabled()) {
        this.removeState('active');
      }
    },
    Stateful_postRender: function (){
      if (this.disabled && !this.hasState('disabled')) {
        this.addState('disabled');
      }
    },
    hasState: function (state){
      return domUtils.hasClass(this.getStateDom(), 'edui-state-' + state);
    },
    addState: function (state){
      if (!this.hasState(state)) {
        this.getStateDom().className += ' edui-state-' + state;
      }
    },
    removeState: function (state){
      if (this.hasState(state)) {
        domUtils.removeClasses(this.getStateDom(), ['edui-state-' + state]);
      }
    },
    getStateDom: function (){
      return this.getDom('state');
    },
    isChecked: function (){
      return this.hasState('checked');
    },
    setChecked: function (checked){
      if (!this.isDisabled() && checked) {
        this.addState('checked');
      } else {
        this.removeState('checked');
      }
    },
    isDisabled: function (){
      return this.hasState('disabled');
    },
    setDisabled: function (disabled){
      if (disabled) {
        this.removeState('hover');
        this.removeState('checked');
        this.removeState('active');
        this.addState('disabled');
      } else {
        this.removeState('disabled');
      }
    }
  };
})();


// ui/button.js
///import core
///import uicore
///import ui/stateful.js
(function (){
  var utils = baidu.editor.utils,
    UIBase = baidu.editor.ui.UIBase,
    Stateful = baidu.editor.ui.Stateful,
    Button = baidu.editor.ui.Button = function (options){
      if(options.name){
        var btnName = options.name;
        var cssRules = options.cssRules;
        if(!options.className){
          options.className =  'edui-for-' + btnName;
        }
        options.cssRules = '.edui-default  .edui-for-'+ btnName +' .edui-icon {'+ cssRules +'}'
      }
      this.initOptions(options);
      this.initButton();
    };
  Button.prototype = {
    uiName: 'button',
    label: '',
    title: '',
    showIcon: true,
    showText: true,
    cssRules:'',
    initButton: function (){
      this.initUIBase();
      this.Stateful_init();
      if(this.cssRules){
        utils.cssRule('edui-customize-'+this.name+'-style',this.cssRules);
      }
    },
    getHtmlTpl: function (){
      return '<div id="##" class="edui-box %%">' +
        '<div id="##_state" stateful>' +
        '<div class="%%-wrap"><div id="##_body" unselectable="on" ' + (this.title ? 'title="' + this.title + '"' : '') +
        ' class="%%-body" onmousedown="return $$._onMouseDown(event, this);" onclick="return $$._onClick(event, this);">' +
        (this.showIcon ? '<div class="edui-box edui-icon"></div>' : '') +
        (this.showText ? '<div class="edui-box edui-label">' + this.label + '</div>' : '') +
        '</div>' +
        '</div>' +
        '</div></div>';
    },
    postRender: function (){
      this.Stateful_postRender();
      this.setDisabled(this.disabled)
    },
    _onMouseDown: function (e){
      var target = e.target || e.srcElement,
        tagName = target && target.tagName && target.tagName.toLowerCase();
      if (tagName == 'input' || tagName == 'object' || tagName == 'object') {
        return false;
      }
    },
    _onClick: function (){
      if (!this.isDisabled()) {
        this.fireEvent('click');
      }
    },
    setTitle: function(text){
      var label = this.getDom('label');
      label.innerHTML = text;
    }
  };
  utils.inherits(Button, UIBase);
  utils.extend(Button.prototype, Stateful);

})();


// ui/splitbutton.js
///import core
///import uicore
///import ui/stateful.js
(function (){
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    domUtils = baidu.editor.dom.domUtils,
    UIBase = baidu.editor.ui.UIBase,
    Stateful = baidu.editor.ui.Stateful,
    SplitButton = baidu.editor.ui.SplitButton = function (options){
      this.initOptions(options);
      this.initSplitButton();
    };
  SplitButton.prototype = {
    popup: null,
    uiName: 'splitbutton',
    title: '',
    initSplitButton: function (){
      this.initUIBase();
      this.Stateful_init();
      var me = this;
      if (this.popup != null) {
        var popup = this.popup;
        this.popup = null;
        this.setPopup(popup);
      }
    },
    _UIBase_postRender: UIBase.prototype.postRender,
    postRender: function (){
      this.Stateful_postRender();
      this._UIBase_postRender();
    },
    setPopup: function (popup){
      if (this.popup === popup) return;
      if (this.popup != null) {
        this.popup.dispose();
      }
      popup.addListener('show', utils.bind(this._onPopupShow, this));
      popup.addListener('hide', utils.bind(this._onPopupHide, this));
      popup.addListener('postrender', utils.bind(function (){
        popup.getDom('body').appendChild(
          uiUtils.createElementByHtml('<div id="' +
            this.popup.id + '_bordereraser" class="edui-bordereraser edui-background" style="width:' +
            (uiUtils.getClientRect(this.getDom()).width + 20) + 'px"></div>')
        );
        popup.getDom().className += ' ' + this.className;
      }, this));
      this.popup = popup;
    },
    _onPopupShow: function (){
      this.addState('opened');
    },
    _onPopupHide: function (){
      this.removeState('opened');
    },
    getHtmlTpl: function (){
      return '<div id="##" class="edui-box %%">' +
        '<div '+ (this.title ? 'title="' + this.title + '"' : '') +' id="##_state" stateful><div class="%%-body">' +
        '<div id="##_button_body" class="edui-box edui-button-body" onclick="$$._onButtonClick(event, this);">' +
        '<div class="edui-box edui-icon"></div>' +
        '</div>' +
        '<div class="edui-box edui-splitborder"></div>' +
        '<div class="edui-box edui-arrow" onclick="$$._onArrowClick();"></div>' +
        '</div></div></div>';
    },
    showPopup: function (){
      // 当popup往上弹出的时候，做特殊处理
      var rect = uiUtils.getClientRect(this.getDom());
      rect.top -= this.popup.SHADOW_RADIUS;
      rect.height += this.popup.SHADOW_RADIUS;
      this.popup.showAnchorRect(rect);
    },
    _onArrowClick: function (event, el){
      if (!this.isDisabled()) {
        this.showPopup();
      }
    },
    _onButtonClick: function (){
      if (!this.isDisabled()) {
        this.fireEvent('buttonclick');
      }
    }
  };
  utils.inherits(SplitButton, UIBase);
  utils.extend(SplitButton.prototype, Stateful, true);

})();


// ui/colorbutton.js
///import core
///import uicore
///import ui/colorpicker.js
///import ui/popup.js
///import ui/splitbutton.js
(function (){
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    ColorPicker = baidu.editor.ui.ColorPicker,
    Popup = baidu.editor.ui.Popup,
    SplitButton = baidu.editor.ui.SplitButton,
    ColorButton = baidu.editor.ui.ColorButton = function (options){
      this.initOptions(options);
      this.initColorButton();
    };
  ColorButton.prototype = {
    initColorButton: function (){
      var me = this;
      this.popup = new Popup({
        content: new ColorPicker({
          noColorText: me.editor.getLang("clearColor"),
          editor:me.editor,
          cmdNameCustom: me.cmdNameCustom,
          onpickcolor: function (t, color){
            me._onPickColor(color);
          },
          onpicknocolor: function (t, color){
            me._onPickNoColor(color);
          }
        }),
        editor:me.editor
      });
      this.initSplitButton();
    },
    _SplitButton_postRender: SplitButton.prototype.postRender,
    postRender: function (){
      this._SplitButton_postRender();
      this.getDom('button_body').appendChild(
        uiUtils.createElementByHtml('<div id="' + this.id + '_colorlump" class="edui-colorlump"></div>')
      );
      this.getDom().className += ' edui-colorbutton';
    },
    setColor: function (color){
      this.getDom('colorlump').style.backgroundColor = color;
      this.color = color;
    },
    _onPickColor: function (color){
      if (this.fireEvent('pickcolor', color) !== false) {
        this.setColor(color);
        !window.showUeditorPopup && this.popup.hide();
      }
    },
    _onPickNoColor: function (color){
      if (this.fireEvent('picknocolor') !== false) {
        this.popup.hide();
      }
    }
  };
  utils.inherits(ColorButton, SplitButton);

})();


// ui/tablebutton.js
///import core
///import uicore
///import ui/popup.js
///import ui/tablepicker.js
///import ui/splitbutton.js
(function (){
  var utils = baidu.editor.utils,
    Popup = baidu.editor.ui.Popup,
    TablePicker = baidu.editor.ui.TablePicker,
    SplitButton = baidu.editor.ui.SplitButton,
    TableButton = baidu.editor.ui.TableButton = function (options){
      this.initOptions(options);
      this.initTableButton();
    };
  TableButton.prototype = {
    initTableButton: function (){
      var me = this;
      this.popup = new Popup({
        content: new TablePicker({
          editor:me.editor,
          onpicktable: function (t, numCols, numRows){
            me._onPickTable(numCols, numRows);
          }
        }),
        'editor':me.editor
      });
      this.initSplitButton();
    },
    _onPickTable: function (numCols, numRows){
      if (this.fireEvent('picktable', numCols, numRows) !== false) {
        this.popup.hide();
      }
    }
  };
  utils.inherits(TableButton, SplitButton);

})();


// ui/autotypesetpicker.js
///import core
///import uicore
(function () {
  var utils = baidu.editor.utils,
    UIBase = baidu.editor.ui.UIBase;

  var AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker = function (options) {
    this.initOptions(options);
    this.initAutoTypeSetPicker();
  };
  AutoTypeSetPicker.prototype = {
    initAutoTypeSetPicker:function () {
      this.initUIBase();
    },
    getHtmlTpl:function () {
      var me = this.editor,
        opt = me.options.autotypeset,
        lang = me.getLang("autoTypeSet");

      var textAlignInputName = 'textAlignValue' + me.uid,
        imageBlockInputName = 'imageBlockLineValue' + me.uid,
        symbolConverInputName = 'symbolConverValue' + me.uid;

      return '<div id="##" class="edui-autotypesetpicker %%">' +
        '<div class="edui-autotypesetpicker-body">' +
        '<table >' +
        '<tr><td nowrap><input type="checkbox" name="mergeEmptyline" ' + (opt["mergeEmptyline"] ? "checked" : "" ) + '>' + lang.mergeLine + '</td><td colspan="2"><input type="checkbox" name="removeEmptyline" ' + (opt["removeEmptyline"] ? "checked" : "" ) + '>' + lang.delLine + '</td></tr>' +
        '<tr><td nowrap><input type="checkbox" name="removeClass" ' + (opt["removeClass"] ? "checked" : "" ) + '>' + lang.removeFormat + '</td><td colspan="2"><input type="checkbox" name="indent" ' + (opt["indent"] ? "checked" : "" ) + '>' + lang.indent + '</td></tr>' +
        '<tr>' +
        '<td nowrap><input type="checkbox" name="textAlign" ' + (opt["textAlign"] ? "checked" : "" ) + '>' + lang.alignment + '</td>' +
        '<td colspan="2" id="' + textAlignInputName + '">' +
        '<input type="radio" name="'+ textAlignInputName +'" value="left" ' + ((opt["textAlign"] && opt["textAlign"] == "left") ? "checked" : "") + '>' + me.getLang("justifyleft") +
        '<input type="radio" name="'+ textAlignInputName +'" value="center" ' + ((opt["textAlign"] && opt["textAlign"] == "center") ? "checked" : "") + '>' + me.getLang("justifycenter") +
        '<input type="radio" name="'+ textAlignInputName +'" value="right" ' + ((opt["textAlign"] && opt["textAlign"] == "right") ? "checked" : "") + '>' + me.getLang("justifyright") +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td nowrap><input type="checkbox" name="imageBlockLine" ' + (opt["imageBlockLine"] ? "checked" : "" ) + '>' + lang.imageFloat + '</td>' +
        '<td nowrap id="'+ imageBlockInputName +'">' +
        '<input type="radio" name="'+ imageBlockInputName +'" value="none" ' + ((opt["imageBlockLine"] && opt["imageBlockLine"] == "none") ? "checked" : "") + '>' + me.getLang("default") +
        '<input type="radio" name="'+ imageBlockInputName +'" value="left" ' + ((opt["imageBlockLine"] && opt["imageBlockLine"] == "left") ? "checked" : "") + '>' + me.getLang("justifyleft") +
        '<input type="radio" name="'+ imageBlockInputName +'" value="center" ' + ((opt["imageBlockLine"] && opt["imageBlockLine"] == "center") ? "checked" : "") + '>' + me.getLang("justifycenter") +
        '<input type="radio" name="'+ imageBlockInputName +'" value="right" ' + ((opt["imageBlockLine"] && opt["imageBlockLine"] == "right") ? "checked" : "") + '>' + me.getLang("justifyright") +
        '</td>' +
        '</tr>' +
        '<tr><td nowrap><input type="checkbox" name="clearFontSize" ' + (opt["clearFontSize"] ? "checked" : "" ) + '>' + lang.removeFontsize + '</td><td colspan="2"><input type="checkbox" name="clearFontFamily" ' + (opt["clearFontFamily"] ? "checked" : "" ) + '>' + lang.removeFontFamily + '</td></tr>' +
        '<tr><td nowrap colspan="3"><input type="checkbox" name="removeEmptyNode" ' + (opt["removeEmptyNode"] ? "checked" : "" ) + '>' + lang.removeHtml + '</td></tr>' +
        '<tr><td nowrap colspan="3"><input type="checkbox" name="pasteFilter" ' + (opt["pasteFilter"] ? "checked" : "" ) + '>' + lang.pasteFilter + '</td></tr>' +
        '<tr>' +
        '<td nowrap><input type="checkbox" name="symbolConver" ' + (opt["bdc2sb"] || opt["tobdc"] ? "checked" : "" ) + '>' + lang.symbol + '</td>' +
        '<td id="' + symbolConverInputName + '">' +
        '<input type="radio" name="bdc" value="bdc2sb" ' + (opt["bdc2sb"] ? "checked" : "" ) + '>' + lang.bdc2sb +
        '<input type="radio" name="bdc" value="tobdc" ' + (opt["tobdc"] ? "checked" : "" ) + '>' + lang.tobdc + '' +
        '</td>' +
        '<td nowrap align="right"><button >' + lang.run + '</button></td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '</div>';


    },
    _UIBase_render:UIBase.prototype.render
  };
  utils.inherits(AutoTypeSetPicker, UIBase);
})();


// ui/autotypesetbutton.js
///import core
///import uicore
///import ui/popup.js
///import ui/autotypesetpicker.js
///import ui/splitbutton.js
(function (){
  var utils = baidu.editor.utils,
    Popup = baidu.editor.ui.Popup,
    AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker,
    SplitButton = baidu.editor.ui.SplitButton,
    AutoTypeSetButton = baidu.editor.ui.AutoTypeSetButton = function (options){
      this.initOptions(options);
      this.initAutoTypeSetButton();
    };
  function getPara(me){

    var opt = {},
      cont = me.getDom(),
      editorId = me.editor.uid,
      inputType = null,
      attrName = null,
      ipts = domUtils.getElementsByTagName(cont,"input");
    for(var i=ipts.length-1,ipt;ipt=ipts[i--];){
      inputType = ipt.getAttribute("type");
      if(inputType=="checkbox"){
        attrName = ipt.getAttribute("name");
        opt[attrName] && delete opt[attrName];
        if(ipt.checked){
          var attrValue = document.getElementById( attrName + "Value" + editorId );
          if(attrValue){
            if(/input/ig.test(attrValue.tagName)){
              opt[attrName] = attrValue.value;
            } else {
              var iptChilds = attrValue.getElementsByTagName("input");
              for(var j=iptChilds.length-1,iptchild;iptchild=iptChilds[j--];){
                if(iptchild.checked){
                  opt[attrName] = iptchild.value;
                  break;
                }
              }
            }
          } else {
            opt[attrName] = true;
          }
        } else {
          opt[attrName] = false;
        }
      } else {
        opt[ipt.getAttribute("value")] = ipt.checked;
      }

    }

    var selects = domUtils.getElementsByTagName(cont,"select");
    for(var i=0,si;si=selects[i++];){
      var attr = si.getAttribute('name');
      opt[attr] = opt[attr] ? si.value : '';
    }

    utils.extend(me.editor.options.autotypeset,opt);

    me.editor.setPreferences('autotypeset', opt);
  }

  AutoTypeSetButton.prototype = {
    initAutoTypeSetButton: function (){

      var me = this;
      this.popup = new Popup({
        //传入配置参数
        content: new AutoTypeSetPicker({editor:me.editor}),
        'editor':me.editor,
        hide : function(){
          if (!this._hidden && this.getDom()) {
            getPara(this);
            this.getDom().style.display = 'none';
            this._hidden = true;
            this.fireEvent('hide');
          }
        }
      });
      var flag = 0;
      this.popup.addListener('postRenderAfter',function(){
        var popupUI = this;
        if(flag)return;
        var cont = this.getDom(),
          btn = cont.getElementsByTagName('button')[0];

        btn.onclick = function(){
          getPara(popupUI);
          me.editor.execCommand('autotypeset');
          popupUI.hide()
        };

        domUtils.on(cont, 'click', function(e) {
          var target = e.target || e.srcElement,
            editorId = me.editor.uid;
          if (target && target.tagName == 'INPUT') {

            // 点击图片浮动的checkbox,去除对应的radio
            if (target.name == 'imageBlockLine' || target.name == 'textAlign' || target.name == 'symbolConver') {
              var checked = target.checked,
                radioTd = document.getElementById( target.name + 'Value' + editorId),
                radios = radioTd.getElementsByTagName('input'),
                defalutSelect = {
                  'imageBlockLine': 'none',
                  'textAlign': 'left',
                  'symbolConver': 'tobdc'
                };

              for (var i = 0; i < radios.length; i++) {
                if (checked) {
                  if (radios[i].value == defalutSelect[target.name]) {
                    radios[i].checked = 'checked';
                  }
                } else {
                  radios[i].checked = false;
                }
              }
            }
            // 点击radio,选中对应的checkbox
            if (target.name == ('imageBlockLineValue' + editorId) || target.name == ('textAlignValue' + editorId) || target.name == 'bdc') {
              var checkboxs = target.parentNode.previousSibling.getElementsByTagName('input');
              checkboxs && (checkboxs[0].checked = true);
            }

            getPara(popupUI);
          }
        });

        flag = 1;
      });
      this.initSplitButton();
    }
  };
  utils.inherits(AutoTypeSetButton, SplitButton);

})();


// ui/cellalignpicker.js
///import core
///import uicore
(function () {
  var utils = baidu.editor.utils,
    Popup = baidu.editor.ui.Popup,
    Stateful = baidu.editor.ui.Stateful,
    UIBase = baidu.editor.ui.UIBase;

  /**
   * 该参数将新增一个参数： selected， 参数类型为一个Object， 形如{ 'align': 'center', 'valign': 'top' }， 表示单元格的初始
   * 对齐状态为： 竖直居上，水平居中; 其中 align的取值为：'center', 'left', 'right'; valign的取值为: 'top', 'middle', 'bottom'
   * @update 2013/4/2 hancong03@baidu.com
   */
  var CellAlignPicker = baidu.editor.ui.CellAlignPicker = function (options) {
    this.initOptions(options);
    this.initSelected();
    this.initCellAlignPicker();
  };
  CellAlignPicker.prototype = {
    //初始化选中状态， 该方法将根据传递进来的参数获取到应该选中的对齐方式图标的索引
    initSelected: function(){

      var status = {

          valign: {
            top: 0,
            middle: 1,
            bottom: 2
          },
          align: {
            left: 0,
            center: 1,
            right: 2
          },
          count: 3

        },
        result = -1;

      if( this.selected ) {
        this.selectedIndex = status.valign[ this.selected.valign ] * status.count + status.align[ this.selected.align ];
      }

    },
    initCellAlignPicker:function () {
      this.initUIBase();
      this.Stateful_init();
    },
    getHtmlTpl:function () {

      var alignType = [ 'left', 'center', 'right' ],
        COUNT = 9,
        tempClassName = null,
        tempIndex = -1,
        tmpl = [];


      for( var i= 0; i<COUNT; i++ ) {

        tempClassName = this.selectedIndex === i ? ' class="edui-cellalign-selected" ' : '';
        tempIndex = i % 3;

        tempIndex === 0 && tmpl.push('<tr>');

        tmpl.push( '<td index="'+ i +'" ' + tempClassName + ' stateful><div class="edui-icon edui-'+ alignType[ tempIndex ] +'"></div></td>' );

        tempIndex === 2 && tmpl.push('</tr>');

      }

      return '<div id="##" class="edui-cellalignpicker %%">' +
        '<div class="edui-cellalignpicker-body">' +
        '<table onclick="$$._onClick(event);">' +
        tmpl.join('') +
        '</table>' +
        '</div>' +
        '</div>';
    },
    getStateDom: function (){
      return this.target;
    },
    _onClick: function (evt){
      var target= evt.target || evt.srcElement;
      if(/icon/.test(target.className)){
        this.items[target.parentNode.getAttribute("index")].onclick();
        Popup.postHide(evt);
      }
    },
    _UIBase_render:UIBase.prototype.render
  };
  utils.inherits(CellAlignPicker, UIBase);
  utils.extend(CellAlignPicker.prototype, Stateful,true);
})();





// ui/pastepicker.js
///import core
///import uicore
(function () {
  var utils = baidu.editor.utils,
    Stateful = baidu.editor.ui.Stateful,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase;

  var PastePicker = baidu.editor.ui.PastePicker = function (options) {
    this.initOptions(options);
    this.initPastePicker();
  };
  PastePicker.prototype = {
    initPastePicker:function () {
      this.initUIBase();
      this.Stateful_init();
    },
    getHtmlTpl:function () {
      return '<div class="edui-pasteicon" onclick="$$._onClick(this)"></div>' +
        '<div class="edui-pastecontainer">' +
        '<div class="edui-title">' + this.editor.getLang("pasteOpt") + '</div>' +
        '<div class="edui-button">' +
        '<div title="' + this.editor.getLang("pasteSourceFormat") + '" onclick="$$.format(false)" stateful>' +
        '<div class="edui-richtxticon"></div></div>' +
        '<div title="' + this.editor.getLang("tagFormat") + '" onclick="$$.format(2)" stateful>' +
        '<div class="edui-tagicon"></div></div>' +
        '<div title="' + this.editor.getLang("pasteTextFormat") + '" onclick="$$.format(true)" stateful>' +
        '<div class="edui-plaintxticon"></div></div>' +
        '</div>' +
        '</div>' +
        '</div>'
    },
    getStateDom:function () {
      return this.target;
    },
    format:function (param) {
      this.editor.ui._isTransfer = true;
      this.editor.fireEvent('pasteTransfer', param);
    },
    _onClick:function (cur) {
      var node = domUtils.getNextDomNode(cur),
        screenHt = uiUtils.getViewportRect().height,
        subPop = uiUtils.getClientRect(node);

      if ((subPop.top + subPop.height) > screenHt)
        node.style.top = (-subPop.height - cur.offsetHeight) + "px";
      else
        node.style.top = "";

      if (/hidden/ig.test(domUtils.getComputedStyle(node, "visibility"))) {
        node.style.visibility = "visible";
        domUtils.addClass(cur, "edui-state-opened");
      } else {
        node.style.visibility = "hidden";
        domUtils.removeClasses(cur, "edui-state-opened")
      }
    },
    _UIBase_render:UIBase.prototype.render
  };
  utils.inherits(PastePicker, UIBase);
  utils.extend(PastePicker.prototype, Stateful, true);
})();






// ui/toolbar.js
(function (){
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase,
    Toolbar = baidu.editor.ui.Toolbar = function (options){
      this.initOptions(options);
      this.initToolbar();
    };
  Toolbar.prototype = {
    items: null,
    initToolbar: function (){
      this.items = this.items || [];
      this.initUIBase();
    },
    add: function (item,index){
      if(index === undefined){
        this.items.push(item);
      }else{
        this.items.splice(index,0,item)
      }

    },
    getHtmlTpl: function (){
      var buff = [];
      for (var i=0; i<this.items.length; i++) {
        buff[i] = this.items[i].renderHtml();
      }
      return '<div id="##" class="edui-toolbar %%" onselectstart="return false;" onmousedown="return $$._onMouseDown(event, this);">' +
        buff.join('') +
        '</div>'
    },
    postRender: function (){
      var box = this.getDom();
      for (var i=0; i<this.items.length; i++) {
        this.items[i].postRender();
      }
      uiUtils.makeUnselectable(box);
    },
    _onMouseDown: function (e){
      var target = e.target || e.srcElement,
        tagName = target && target.tagName && target.tagName.toLowerCase();
      if (tagName == 'input' || tagName == 'object' || tagName == 'object') {
        return false;
      }
    }
  };
  utils.inherits(Toolbar, UIBase);

})();


// ui/menu.js
///import core
///import uicore
///import ui\popup.js
///import ui\stateful.js
(function () {
  var utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase,
    Popup = baidu.editor.ui.Popup,
    Stateful = baidu.editor.ui.Stateful,
    CellAlignPicker = baidu.editor.ui.CellAlignPicker,

    Menu = baidu.editor.ui.Menu = function (options) {
      this.initOptions(options);
      this.initMenu();
    };

  var menuSeparator = {
    renderHtml:function () {
      return '<div class="edui-menuitem edui-menuseparator"><div class="edui-menuseparator-inner"></div></div>';
    },
    postRender:function () {
    },
    queryAutoHide:function () {
      return true;
    }
  };
  Menu.prototype = {
    items:null,
    uiName:'menu',
    initMenu:function () {
      this.items = this.items || [];
      this.initPopup();
      this.initItems();
    },
    initItems:function () {
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item == '-') {
          this.items[i] = this.getSeparator();
        } else if (!(item instanceof MenuItem)) {
          item.editor = this.editor;
          item.theme = this.editor.options.theme;
          this.items[i] = this.createItem(item);
        }
      }
    },
    getSeparator:function () {
      return menuSeparator;
    },
    createItem:function (item) {
      //新增一个参数menu, 该参数存储了menuItem所对应的menu引用
      item.menu = this;
      return new MenuItem(item);
    },
    _Popup_getContentHtmlTpl:Popup.prototype.getContentHtmlTpl,
    getContentHtmlTpl:function () {
      if (this.items.length == 0) {
        return this._Popup_getContentHtmlTpl();
      }
      var buff = [];
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        buff[i] = item.renderHtml();
      }
      return ('<div class="%%-body">' + buff.join('') + '</div>');
    },
    _Popup_postRender:Popup.prototype.postRender,
    postRender:function () {
      var me = this;
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        item.ownerMenu = this;
        item.postRender();
      }
      domUtils.on(this.getDom(), 'mouseover', function (evt) {
        evt = evt || event;
        var rel = evt.relatedTarget || evt.fromElement;
        var el = me.getDom();
        if (!uiUtils.contains(el, rel) && el !== rel) {
          me.fireEvent('over');
        }
      });
      this._Popup_postRender();
    },
    queryAutoHide:function (el) {
      if (el) {
        if (uiUtils.contains(this.getDom(), el)) {
          return false;
        }
        for (var i = 0; i < this.items.length; i++) {
          var item = this.items[i];
          if (item.queryAutoHide(el) === false) {
            return false;
          }
        }
      }
    },
    clearItems:function () {
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        clearTimeout(item._showingTimer);
        clearTimeout(item._closingTimer);
        if (item.subMenu) {
          item.subMenu.destroy();
        }
      }
      this.items = [];
    },
    destroy:function () {
      if (this.getDom()) {
        domUtils.remove(this.getDom());
      }
      this.clearItems();
    },
    dispose:function () {
      this.destroy();
    }
  };
  utils.inherits(Menu, Popup);

  /**
   * @update 2013/04/03 hancong03 新增一个参数menu, 该参数存储了menuItem所对应的menu引用
   * @type {Function}
   */
  var MenuItem = baidu.editor.ui.MenuItem = function (options) {
    this.initOptions(options);
    this.initUIBase();
    this.Stateful_init();
    if (this.subMenu && !(this.subMenu instanceof Menu)) {
      if (options.className && options.className.indexOf("aligntd") != -1) {
        var me = this;

        //获取单元格对齐初始状态
        this.subMenu.selected = this.editor.queryCommandValue( 'cellalignment' );

        this.subMenu = new Popup({
          content:new CellAlignPicker(this.subMenu),
          parentMenu:me,
          editor:me.editor,
          destroy:function () {
            if (this.getDom()) {
              domUtils.remove(this.getDom());
            }
          }
        });
        this.subMenu.addListener("postRenderAfter", function () {
          domUtils.on(this.getDom(), "mouseover", function () {
            me.addState('opened');
          });
        });
      } else {
        this.subMenu = new Menu(this.subMenu);
      }
    }
  };
  MenuItem.prototype = {
    label:'',
    subMenu:null,
    ownerMenu:null,
    uiName:'menuitem',
    alwalysHoverable:true,
    getHtmlTpl:function () {
      return '<div id="##" class="%%" stateful onclick="$$._onClick(event, this);">' +
        '<div class="%%-body">' +
        this.renderLabelHtml() +
        '</div>' +
        '</div>';
    },
    postRender:function () {
      var me = this;
      this.addListener('over', function () {
        me.ownerMenu.fireEvent('submenuover', me);
        if (me.subMenu) {
          me.delayShowSubMenu();
        }
      });
      if (this.subMenu) {
        this.getDom().className += ' edui-hassubmenu';
        this.subMenu.render();
        this.addListener('out', function () {
          me.delayHideSubMenu();
        });
        this.subMenu.addListener('over', function () {
          clearTimeout(me._closingTimer);
          me._closingTimer = null;
          me.addState('opened');
        });
        this.ownerMenu.addListener('hide', function () {
          me.hideSubMenu();
        });
        this.ownerMenu.addListener('submenuover', function (t, subMenu) {
          if (subMenu !== me) {
            me.delayHideSubMenu();
          }
        });
        this.subMenu._bakQueryAutoHide = this.subMenu.queryAutoHide;
        this.subMenu.queryAutoHide = function (el) {
          if (el && uiUtils.contains(me.getDom(), el)) {
            return false;
          }
          return this._bakQueryAutoHide(el);
        };
      }
      this.getDom().style.tabIndex = '-1';
      uiUtils.makeUnselectable(this.getDom());
      this.Stateful_postRender();
    },
    delayShowSubMenu:function () {
      var me = this;
      if (!me.isDisabled()) {
        me.addState('opened');
        clearTimeout(me._showingTimer);
        clearTimeout(me._closingTimer);
        me._closingTimer = null;
        me._showingTimer = setTimeout(function () {
          me.showSubMenu();
        }, 250);
      }
    },
    delayHideSubMenu:function () {
      var me = this;
      if (!me.isDisabled()) {
        me.removeState('opened');
        clearTimeout(me._showingTimer);
        if (!me._closingTimer) {
          me._closingTimer = setTimeout(function () {
            if (!me.hasState('opened')) {
              me.hideSubMenu();
            }
            me._closingTimer = null;
          }, 400);
        }
      }
    },
    renderLabelHtml:function () {
      return '<div class="edui-arrow"></div>' +
        '<div class="edui-box edui-icon"></div>' +
        '<div class="edui-box edui-label %%-label">' + (this.label || '') + '</div>';
    },
    getStateDom:function () {
      return this.getDom();
    },
    queryAutoHide:function (el) {
      if (this.subMenu && this.hasState('opened')) {
        return this.subMenu.queryAutoHide(el);
      }
    },
    _onClick:function (event, this_) {
      if (this.hasState('disabled')) return;
      if (this.fireEvent('click', event, this_) !== false) {
        if (this.subMenu) {
          this.showSubMenu();
        } else {
          Popup.postHide(event);
        }
      }
    },
    showSubMenu:function () {
      var rect = uiUtils.getClientRect(this.getDom());
      rect.right -= 5;
      rect.left += 2;
      rect.width -= 7;
      rect.top -= 4;
      rect.bottom += 4;
      rect.height += 8;
      this.subMenu.showAnchorRect(rect, true, true);
    },
    hideSubMenu:function () {
      this.subMenu.hide();
    }
  };
  utils.inherits(MenuItem, UIBase);
  utils.extend(MenuItem.prototype, Stateful, true);
})();


// ui/combox.js
///import core
///import uicore
///import ui/menu.js
///import ui/splitbutton.js
(function (){
  // todo: menu和item提成通用list
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    Menu = baidu.editor.ui.Menu,
    SplitButton = baidu.editor.ui.SplitButton,
    Combox = baidu.editor.ui.Combox = function (options){
      this.initOptions(options);
      this.initCombox();
    };
  Combox.prototype = {
    uiName: 'combox',
    onbuttonclick:function () {
      this.showPopup();
    },
    initCombox: function (){
      var me = this;
      this.items = this.items || [];
      for (var i=0; i<this.items.length; i++) {
        var item = this.items[i];
        item.uiName = 'listitem';
        item.index = i;
        item.onclick = function (){
          me.selectByIndex(this.index);
        };
      }
      this.popup = new Menu({
        items: this.items,
        uiName: 'list',
        editor:this.editor,
        captureWheel: true,
        combox: this
      });

      this.initSplitButton();
    },
    _SplitButton_postRender: SplitButton.prototype.postRender,
    postRender: function (){
      this._SplitButton_postRender();
      this.setLabel(this.label || '');
      this.setValue(this.initValue || '');
    },
    showPopup: function (){
      var rect = uiUtils.getClientRect(this.getDom());
      rect.top += 1;
      rect.bottom -= 1;
      rect.height -= 2;
      this.popup.showAnchorRect(rect);
    },
    getValue: function (){
      return this.value;
    },
    setValue: function (value){
      var index = this.indexByValue(value);
      if (index != -1) {
        this.selectedIndex = index;
        this.setLabel(this.items[index].label);
        this.value = this.items[index].value;
      } else {
        this.selectedIndex = -1;
        this.setLabel(this.getLabelForUnknowValue(value));
        this.value = value;
      }
    },
    setLabel: function (label){
      this.getDom('button_body').innerHTML = label;
      this.label = label;
    },
    getLabelForUnknowValue: function (value){
      return value;
    },
    indexByValue: function (value){
      for (var i=0; i<this.items.length; i++) {
        if (value == this.items[i].value) {
          return i;
        }
      }
      return -1;
    },
    getItem: function (index){
      return this.items[index];
    },
    selectByIndex: function (index){
      if (index < this.items.length && this.fireEvent('select', index) !== false) {
        this.selectedIndex = index;
        this.value = this.items[index].value;
        this.setLabel(this.items[index].label);
      }
    }
  };
  utils.inherits(Combox, SplitButton);
})();


// ui/dialog.js
///import core
///import uicore
///import ui/mask.js
///import ui/button.js
(function (){
  var utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils,
    uiUtils = baidu.editor.ui.uiUtils,
    Mask = baidu.editor.ui.Mask,
    UIBase = baidu.editor.ui.UIBase,
    Button = baidu.editor.ui.Button,
    Dialog = baidu.editor.ui.Dialog = function (options){
      if(options.name){
        var name = options.name;
        var cssRules = options.cssRules;
        if(!options.className){
          options.className =  'edui-for-' + name;
        }
        if(cssRules){
          options.cssRules = '.edui-default .edui-for-'+ name +' .edui-dialog-content  {'+ cssRules +'}'
        }
      }
      this.initOptions(utils.extend({
        autoReset: true,
        draggable: true,
        onok: function (){},
        oncancel: function (){},
        onclose: function (t, ok){
          return ok ? this.onok() : this.oncancel();
        },
        //是否控制dialog中的scroll事件， 默认为不阻止
        holdScroll: false
      },options));
      this.initDialog();
    };
  var modalMask;
  var dragMask;
  var activeDialog;
  Dialog.prototype = {
    draggable: false,
    uiName: 'dialog',
    initDialog: function (){
      var me = this,
        theme=this.editor.options.theme;
      if(this.cssRules){
        utils.cssRule('edui-customize-'+this.name+'-style',this.cssRules);
      }
      this.initUIBase();
      this.modalMask = (modalMask || (modalMask = new Mask({
        className: 'edui-dialog-modalmask',
        theme:theme,
        onclick: function (){
          activeDialog && activeDialog.close(false);
        }
      })));
      this.dragMask = (dragMask || (dragMask = new Mask({
        className: 'edui-dialog-dragmask',
        theme:theme
      })));
      this.closeButton = new Button({
        className: 'edui-dialog-closebutton',
        title: me.closeDialog,
        theme:theme,
        onclick: function (){
          me.close(false);
        }
      });

      this.fullscreen && this.initResizeEvent();

      if (this.buttons) {
        for (var i=0; i<this.buttons.length; i++) {
          if (!(this.buttons[i] instanceof Button)) {
            this.buttons[i] = new Button(utils.extend(this.buttons[i],{
              editor : this.editor
            },true));
          }
        }
      }
    },
    initResizeEvent: function () {

      var me = this;

      domUtils.on( window, "resize", function () {

        if ( me._hidden || me._hidden === undefined ) {
          return;
        }

        if ( me.__resizeTimer ) {
          window.clearTimeout( me.__resizeTimer );
        }

        me.__resizeTimer = window.setTimeout( function () {

          me.__resizeTimer = null;

          var dialogWrapNode = me.getDom(),
            contentNode = me.getDom('content'),
            wrapRect = UE.ui.uiUtils.getClientRect( dialogWrapNode ),
            contentRect = UE.ui.uiUtils.getClientRect( contentNode ),
            vpRect = uiUtils.getViewportRect();

          contentNode.style.width = ( vpRect.width - wrapRect.width + contentRect.width ) + "px";
          contentNode.style.height = ( vpRect.height - wrapRect.height + contentRect.height ) + "px";

          dialogWrapNode.style.width = vpRect.width + "px";
          dialogWrapNode.style.height = vpRect.height + "px";

          me.fireEvent( "resize" );

        }, 100 );

      } );

    },
    fitSize: function (){
      var popBodyEl = this.getDom('body');
//            if (!(baidu.editor.browser.ie && baidu.editor.browser.version == 7)) {
//                uiUtils.removeStyle(popBodyEl, 'width');
//                uiUtils.removeStyle(popBodyEl, 'height');
//            }
      var size = this.mesureSize();
      popBodyEl.style.width = size.width + 'px';
      popBodyEl.style.height = size.height + 'px';
      return size;
    },
    safeSetOffset: function (offset){
      var me = this;
      var el = me.getDom();
      var vpRect = uiUtils.getViewportRect();
      var rect = uiUtils.getClientRect(el);
      var left = offset.left;
      if (left + rect.width > vpRect.right) {
        left = vpRect.right - rect.width;
      }
      var top = offset.top;
      if (top + rect.height > vpRect.bottom) {
        top = vpRect.bottom - rect.height;
      }
      el.style.left = Math.max(left, 0) + 'px';
      el.style.top = Math.max(top, 0) + 'px';
    },
    showAtCenter: function (){

      var vpRect = uiUtils.getViewportRect();

      if ( !this.fullscreen ) {
        this.getDom().style.display = '';
        var popSize = this.fitSize();
        var titleHeight = this.getDom('titlebar').offsetHeight | 0;
        var left = vpRect.width / 2 - popSize.width / 2;
        var top = vpRect.height / 2 - (popSize.height - titleHeight) / 2 - titleHeight;
        var popEl = this.getDom();
        this.safeSetOffset({
          left: Math.max(left | 0, 0),
          top: Math.max(top | 0, 0)
        });
        if (!domUtils.hasClass(popEl, 'edui-state-centered')) {
          popEl.className += ' edui-state-centered';
        }
      } else {
        var dialogWrapNode = this.getDom(),
          contentNode = this.getDom('content');

        dialogWrapNode.style.display = "block";

        var wrapRect = UE.ui.uiUtils.getClientRect( dialogWrapNode ),
          contentRect = UE.ui.uiUtils.getClientRect( contentNode );
        dialogWrapNode.style.left = "-100000px";

        contentNode.style.width = ( vpRect.width - wrapRect.width + contentRect.width ) + "px";
        contentNode.style.height = ( vpRect.height - wrapRect.height + contentRect.height ) + "px";

        dialogWrapNode.style.width = vpRect.width + "px";
        dialogWrapNode.style.height = vpRect.height + "px";
        dialogWrapNode.style.left = 0;

        //保存环境的overflow值
        this._originalContext = {
          html: {
            overflowX: document.documentElement.style.overflowX,
            overflowY: document.documentElement.style.overflowY
          },
          body: {
            overflowX: document.body.style.overflowX,
            overflowY: document.body.style.overflowY
          }
        };

        document.documentElement.style.overflowX = 'hidden';
        document.documentElement.style.overflowY = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'hidden';

      }

      this._show();
    },
    getContentHtml: function (){
      var contentHtml = '';
      if (typeof this.content == 'string') {
        contentHtml = this.content;
      } else if (this.iframeUrl) {
        contentHtml = '<span id="'+ this.id +'_contmask" class="dialogcontmask"></span><iframe id="'+ this.id +
          '_iframe" class="%%-iframe" height="100%" width="100%" frameborder="0" src="'+ this.iframeUrl +'"></iframe>';
      }
      return contentHtml;
    },
    getHtmlTpl: function (){
      var footHtml = '';

      if (this.buttons) {
        var buff = [];
        for (var i=0; i<this.buttons.length; i++) {
          buff[i] = this.buttons[i].renderHtml();
        }
        footHtml = '<div class="%%-foot">' +
          '<div id="##_buttons" class="%%-buttons">' + buff.join('') + '</div>' +
          '</div>';
      }

      return '<div id="##" class="%%"><div '+ ( !this.fullscreen ? 'class="%%"' : 'class="%%-wrap edui-dialog-fullscreen-flag"' ) +'><div id="##_body" class="%%-body">' +
        '<div class="%%-shadow"></div>' +
        '<div id="##_titlebar" class="%%-titlebar">' +
        '<div class="%%-draghandle" onmousedown="$$._onTitlebarMouseDown(event, this);">' +
        '<span class="%%-caption">' + (this.title || '') + '</span>' +
        '</div>' +
        this.closeButton.renderHtml() +
        '</div>' +
        '<div id="##_content" class="%%-content">'+ ( this.autoReset ? '' : this.getContentHtml()) +'</div>' +
        footHtml +
        '</div></div></div>';
    },
    postRender: function (){
      // todo: 保持居中/记住上次关闭位置选项
      if (!this.modalMask.getDom()) {
        this.modalMask.render();
        this.modalMask.hide();
      }
      if (!this.dragMask.getDom()) {
        this.dragMask.render();
        this.dragMask.hide();
      }
      var me = this;
      this.addListener('show', function (){
        me.modalMask.show(this.getDom().style.zIndex - 2);
      });
      this.addListener('hide', function (){
        me.modalMask.hide();
      });
      if (this.buttons) {
        for (var i=0; i<this.buttons.length; i++) {
          this.buttons[i].postRender();
        }
      }
      domUtils.on(window, 'resize', function (){
        setTimeout(function (){
          if (!me.isHidden()) {
            me.safeSetOffset(uiUtils.getClientRect(me.getDom()));
          }
        });
      });

      //hold住scroll事件，防止dialog的滚动影响页面
//            if( this.holdScroll ) {
//
//                if( !me.iframeUrl ) {
//                    domUtils.on( document.getElementById( me.id + "_iframe"), !browser.gecko ? "mousewheel" : "DOMMouseScroll", function(e){
//                        domUtils.preventDefault(e);
//                    } );
//                } else {
//                    me.addListener('dialogafterreset', function(){
//                        window.setTimeout(function(){
//                            var iframeWindow = document.getElementById( me.id + "_iframe").contentWindow;
//
//                            if( browser.ie ) {
//
//                                var timer = window.setInterval(function(){
//
//                                    if( iframeWindow.document && iframeWindow.document.body ) {
//                                        window.clearInterval( timer );
//                                        timer = null;
//                                        domUtils.on( iframeWindow.document.body, !browser.gecko ? "mousewheel" : "DOMMouseScroll", function(e){
//                                            domUtils.preventDefault(e);
//                                        } );
//                                    }
//
//                                }, 100);
//
//                            } else {
//                                domUtils.on( iframeWindow, !browser.gecko ? "mousewheel" : "DOMMouseScroll", function(e){
//                                    domUtils.preventDefault(e);
//                                } );
//                            }
//
//                        }, 1);
//                    });
//                }
//
//            }
      this._hide();
    },
    mesureSize: function (){
      var body = this.getDom('body');
      var width = uiUtils.getClientRect(this.getDom('content')).width;
      var dialogBodyStyle = body.style;
      dialogBodyStyle.width = width;
      return uiUtils.getClientRect(body);
    },
    _onTitlebarMouseDown: function (evt, el){
      if (this.draggable) {
        var rect;
        var vpRect = uiUtils.getViewportRect();
        var me = this;
        uiUtils.startDrag(evt, {
          ondragstart: function (){
            rect = uiUtils.getClientRect(me.getDom());
            me.getDom('contmask').style.visibility = 'visible';
            me.dragMask.show(me.getDom().style.zIndex - 1);
          },
          ondragmove: function (x, y){
            var left = rect.left + x;
            var top = rect.top + y;
            me.safeSetOffset({
              left: left,
              top: top
            });
          },
          ondragstop: function (){
            me.getDom('contmask').style.visibility = 'hidden';
            domUtils.removeClasses(me.getDom(), ['edui-state-centered']);
            me.dragMask.hide();
          }
        });
      }
    },
    reset: function (){
      this.getDom('content').innerHTML = this.getContentHtml();
      this.fireEvent('dialogafterreset');
    },
    _show: function (){
      if (this._hidden) {
        this.getDom().style.display = '';

        //要高过编辑器的zindxe
        this.editor.container.style.zIndex && (this.getDom().style.zIndex = this.editor.container.style.zIndex * 1 + 10);
        this._hidden = false;
        this.fireEvent('show');
        baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex = this.getDom().style.zIndex - 4;
      }
    },
    isHidden: function (){
      return this._hidden;
    },
    _hide: function (){
      if (!this._hidden) {
        var wrapNode = this.getDom();
        wrapNode.style.display = 'none';
        wrapNode.style.zIndex = '';
        wrapNode.style.width = '';
        wrapNode.style.height = '';
        this._hidden = true;
        this.fireEvent('hide');
      }
    },
    open: function (){
      if (this.autoReset) {
        //有可能还没有渲染
        try{
          this.reset();
        }catch(e){
          this.render();
          this.open()
        }
      }
      this.showAtCenter();
      if (this.iframeUrl) {
        try {
          this.getDom('iframe').focus();
        } catch(ex){}
      }
      activeDialog = this;
    },
    _onCloseButtonClick: function (evt, el){
      this.close(false);
    },
    close: function (ok){
      if (this.fireEvent('close', ok) !== false) {
        //还原环境
        if ( this.fullscreen ) {

          document.documentElement.style.overflowX = this._originalContext.html.overflowX;
          document.documentElement.style.overflowY = this._originalContext.html.overflowY;
          document.body.style.overflowX = this._originalContext.body.overflowX;
          document.body.style.overflowY = this._originalContext.body.overflowY;
          delete this._originalContext;

        }
        this._hide();

        //销毁content
        var content = this.getDom('content');
        var iframe = this.getDom('iframe');
        if (content && iframe) {
          var doc = iframe.contentDocument || iframe.contentWindow.document;
          doc && (doc.body.innerHTML = '');
          domUtils.remove(content);
        }
      }
    }
  };
  utils.inherits(Dialog, UIBase);
})();


// ui/menubutton.js
///import core
///import uicore
///import ui/menu.js
///import ui/splitbutton.js
(function (){
  var utils = baidu.editor.utils,
    Menu = baidu.editor.ui.Menu,
    SplitButton = baidu.editor.ui.SplitButton,
    MenuButton = baidu.editor.ui.MenuButton = function (options){
      this.initOptions(options);
      this.initMenuButton();
    };
  MenuButton.prototype = {
    initMenuButton: function (){
      var me = this;
      this.uiName = "menubutton";
      this.popup = new Menu({
        items: me.items,
        className: me.className,
        editor:me.editor
      });
      this.popup.addListener('show', function (){
        var list = this;
        for (var i=0; i<list.items.length; i++) {
          list.items[i].removeState('checked');
          if (list.items[i].value == me._value) {
            list.items[i].addState('checked');
            this.value = me._value;
          }
        }
      });
      this.initSplitButton();
    },
    setValue : function(value){
      this._value = value;
    }

  };
  utils.inherits(MenuButton, SplitButton);
})();

// ui/multiMenu.js
///import core
///import uicore
///commands 表情
(function(){
  var utils = baidu.editor.utils,
    Popup = baidu.editor.ui.Popup,
    SplitButton = baidu.editor.ui.SplitButton,
    MultiMenuPop = baidu.editor.ui.MultiMenuPop = function(options){
      this.initOptions(options);
      this.initMultiMenu();
    };

  MultiMenuPop.prototype = {
    initMultiMenu: function (){
      var me = this;
      this.popup = new Popup({
        content: '',
        editor : me.editor,
        iframe_rendered: false,
        onshow: function (){
          if (!this.iframe_rendered) {
            this.iframe_rendered = true;
            this.getDom('content').innerHTML = '<iframe id="'+me.id+'_iframe" src="'+ me.iframeUrl +'" frameborder="0"></iframe>';
            me.editor.container.style.zIndex && (this.getDom().style.zIndex = me.editor.container.style.zIndex * 1 + 1);
          }
        }
        // canSideUp:false,
        // canSideLeft:false
      });
      this.onbuttonclick = function(){
        this.showPopup();
      };
      this.initSplitButton();
    }

  };

  utils.inherits(MultiMenuPop, SplitButton);
})();


// ui/shortcutmenu.js
(function () {
  var UI = baidu.editor.ui,
    UIBase = UI.UIBase,
    uiUtils = UI.uiUtils,
    utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils;

  var allMenus = [],//存储所有快捷菜单
    timeID,
    isSubMenuShow = false;//是否有子pop显示

  var ShortCutMenu = UI.ShortCutMenu = function (options) {
    this.initOptions (options);
    this.initShortCutMenu ();
  };

  ShortCutMenu.postHide = hideAllMenu;

  ShortCutMenu.prototype = {
    isHidden : true ,
    SPACE : 5 ,
    initShortCutMenu : function () {
      this.items = this.items || [];
      this.initUIBase ();
      this.initItems ();
      this.initEvent ();
      allMenus.push (this);
    } ,
    initEvent : function () {
      var me = this,
        doc = me.editor.document;

      domUtils.on (doc , "mousemove" , function (e) {
        if (me.isHidden === false) {
          //有pop显示就不隐藏快捷菜单
          if (me.getSubMenuMark () || me.eventType == "contextmenu")   return;


          var flag = true,
            el = me.getDom (),
            wt = el.offsetWidth,
            ht = el.offsetHeight,
            distanceX = wt / 2 + me.SPACE,//距离中心X标准
            distanceY = ht / 2,//距离中心Y标准
            x = Math.abs (e.screenX - me.left),//离中心距离横坐标
            y = Math.abs (e.screenY - me.top);//离中心距离纵坐标

          clearTimeout (timeID);
          timeID = setTimeout (function () {
            if (y > 0 && y < distanceY) {
              me.setOpacity (el , "1");
            } else if (y > distanceY && y < distanceY + 70) {
              me.setOpacity (el , "0.5");
              flag = false;
            } else if (y > distanceY + 70 && y < distanceY + 140) {
              me.hide ();
            }

            if (flag && x > 0 && x < distanceX) {
              me.setOpacity (el , "1")
            } else if (x > distanceX && x < distanceX + 70) {
              me.setOpacity (el , "0.5")
            } else if (x > distanceX + 70 && x < distanceX + 140) {
              me.hide ();
            }
          });
        }
      });

      //ie\ff下 mouseout不准
      if (browser.chrome) {
        domUtils.on (doc , "mouseout" , function (e) {
          var relatedTgt = e.relatedTarget || e.toElement;

          if (relatedTgt == null || relatedTgt.tagName == "HTML") {
            me.hide ();
          }
        });
      }

      me.editor.addListener ("afterhidepop" , function () {
        if (!me.isHidden) {
          isSubMenuShow = true;
        }
      });

    } ,
    initItems : function () {
      if (utils.isArray (this.items)) {
        for (var i = 0, len = this.items.length ; i < len ; i++) {
          var item = this.items[i].toLowerCase ();

          if (UI[item]) {
            this.items[i] = new UI[item] (this.editor);
            this.items[i].className += " edui-shortcutsubmenu ";
          }
        }
      }
    } ,
    setOpacity : function (el , value) {
      if (browser.ie && browser.version < 9) {
        el.style.filter = "alpha(opacity = " + parseFloat (value) * 100 + ");"
      } else {
        el.style.opacity = value;
      }
    } ,
    getSubMenuMark : function () {
      isSubMenuShow = false;
      var layerEle = uiUtils.getFixedLayer ();
      var list = domUtils.getElementsByTagName (layerEle , "div" , function (node) {
        return domUtils.hasClass (node , "edui-shortcutsubmenu edui-popup")
      });

      for (var i = 0, node ; node = list[i++] ;) {
        if (node.style.display != "none") {
          isSubMenuShow = true;
        }
      }
      return isSubMenuShow;
    } ,
    show : function (e , hasContextmenu) {
      var me = this,
        offset = {},
        el = this.getDom (),
        fixedlayer = uiUtils.getFixedLayer ();

      function setPos (offset) {
        if (offset.left < 0) {
          offset.left = 0;
        }
        if (offset.top < 0) {
          offset.top = 0;
        }
        el.style.cssText = "position:absolute;left:" + offset.left + "px;top:" + offset.top + "px;";
      }

      function setPosByCxtMenu (menu) {
        if (!menu.tagName) {
          menu = menu.getDom ();
        }
        offset.left = parseInt (menu.style.left);
        offset.top = parseInt (menu.style.top);
        offset.top -= el.offsetHeight + 15;
        setPos (offset);
      }


      me.eventType = e.type;
      el.style.cssText = "display:block;left:-9999px";

      if (e.type == "contextmenu" && hasContextmenu) {
        var menu = domUtils.getElementsByTagName (fixedlayer , "div" , "edui-contextmenu")[0];
        if (menu) {
          setPosByCxtMenu (menu)
        } else {
          me.editor.addListener ("aftershowcontextmenu" , function (type , menu) {
            setPosByCxtMenu (menu);
          });
        }
      } else {
        offset = uiUtils.getViewportOffsetByEvent (e);
        offset.top -= el.offsetHeight + me.SPACE;
        offset.left += me.SPACE + 20;
        setPos (offset);
        me.setOpacity (el , 0.2);
      }


      me.isHidden = false;
      me.left = e.screenX + el.offsetWidth / 2 - me.SPACE;
      me.top = e.screenY - (el.offsetHeight / 2) - me.SPACE;

      if (me.editor) {
        el.style.zIndex = me.editor.container.style.zIndex * 1 + 10;
        fixedlayer.style.zIndex = el.style.zIndex - 1;
      }
    } ,
    hide : function () {
      if (this.getDom ()) {
        this.getDom ().style.display = "none";
      }
      this.isHidden = true;
    } ,
    postRender : function () {
      if (utils.isArray (this.items)) {
        for (var i = 0, item ; item = this.items[i++] ;) {
          item.postRender ();
        }
      }
    } ,
    getHtmlTpl : function () {
      var buff;
      if (utils.isArray (this.items)) {
        buff = [];
        for (var i = 0 ; i < this.items.length ; i++) {
          buff[i] = this.items[i].renderHtml ();
        }
        buff = buff.join ("");
      } else {
        buff = this.items;
      }

      return '<div id="##" class="%% edui-toolbar" data-src="shortcutmenu" onmousedown="return false;" onselectstart="return false;" >' +
        buff +
        '</div>';
    }
  };

  utils.inherits (ShortCutMenu , UIBase);

  function hideAllMenu (e) {
    var tgt = e.target || e.srcElement,
      cur = domUtils.findParent (tgt , function (node) {
        return domUtils.hasClass (node , "edui-shortcutmenu") || domUtils.hasClass (node , "edui-popup");
      } , true);

    if (!cur) {
      for (var i = 0, menu ; menu = allMenus[i++] ;) {
        menu.hide ()
      }
    }
  }

  domUtils.on (document , 'mousedown' , function (e) {
    hideAllMenu (e);
  });

  domUtils.on (window , 'scroll' , function (e) {
    hideAllMenu (e);
  });

}) ();


// ui/breakline.js
(function (){
  var utils = baidu.editor.utils,
    UIBase = baidu.editor.ui.UIBase,
    Breakline = baidu.editor.ui.Breakline = function (options){
      this.initOptions(options);
      this.initSeparator();
    };
  Breakline.prototype = {
    uiName: 'Breakline',
    initSeparator: function (){
      this.initUIBase();
    },
    getHtmlTpl: function (){
      return '<br/>';
    }
  };
  utils.inherits(Breakline, UIBase);

})();


// ui/message.js
///import core
///import uicore
(function () {
  var utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils,
    UIBase = baidu.editor.ui.UIBase,
    Message = baidu.editor.ui.Message = function (options){
      this.initOptions(options);
      this.initMessage();
    };

  Message.prototype = {
    initMessage: function (){
      this.initUIBase();
    },
    getHtmlTpl: function (){
      return '<div id="##" class="edui-message %%">' +
        ' <div id="##_closer" class="edui-message-closer">×</div>' +
        ' <div id="##_body" class="edui-message-body edui-message-type-info">' +
        ' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
        ' <div class="edui-shadow"></div>' +
        ' <div id="##_content" class="edui-message-content">' +
        '  </div>' +
        ' </div>' +
        '</div>';
    },
    reset: function(opt){
      var me = this;
      if (!opt.keepshow) {
        clearTimeout(this.timer);
        me.timer = setTimeout(function(){
          me.hide();
        }, opt.timeout || 4000);
      }

      opt.content !== undefined && me.setContent(opt.content);
      opt.type !== undefined && me.setType(opt.type);

      me.show();
    },
    postRender: function(){
      var me = this,
        closer = this.getDom('closer');
      closer && domUtils.on(closer, 'click', function(){
        me.hide();
      });
    },
    setContent: function(content){
      this.getDom('content').innerHTML = content;
    },
    setType: function(type){
      type = type || 'info';
      var body = this.getDom('body');
      body.className = body.className.replace(/edui-message-type-[\w-]+/, 'edui-message-type-' + type);
    },
    getContent: function(){
      return this.getDom('content').innerHTML;
    },
    getType: function(){
      var arr = this.getDom('body').match(/edui-message-type-([\w-]+)/);
      return arr ? arr[1]:'';
    },
    show: function (){
      this.getDom().style.display = 'block';
    },
    hide: function (){
      var dom = this.getDom();
      if (dom) {
        dom.style.display = 'none';
        dom.parentNode && dom.parentNode.removeChild(dom);
      }
    }
  };

  utils.inherits(Message, UIBase);

})();


// adapter/editorui.js
//ui跟编辑器的适配層
//那个按钮弹出是dialog，是下拉筐等都是在这个js中配置
//自己写的ui也要在这里配置，放到baidu.editor.ui下边，当编辑器实例化的时候会根据ueditor.config中的toolbars找到相应的进行实例化
(function () {
  var utils = baidu.editor.utils;
  var editorui = baidu.editor.ui;
  var _Dialog = editorui.Dialog;
  editorui.buttons = {};

  editorui.Dialog = function (options) {
    var dialog = new _Dialog(options);
    dialog.addListener('hide', function () {

      if (dialog.editor) {
        var editor = dialog.editor;
        try {
          if (browser.gecko) {
            var y = editor.window.scrollY,
              x = editor.window.scrollX;
            editor.body.focus();
            editor.window.scrollTo(x, y);
          } else {
            editor.focus();
          }


        } catch (ex) {
        }
      }
    });
    return dialog;
  };

  var iframeUrlMap = {
    'anchor':'~/dialogs/anchor/anchor.html',
    'insertimage':'~/dialogs/image/image.html',
    'link':'~/dialogs/link/link.html',
    'spechars':'~/dialogs/spechars/spechars.html',
    'searchreplace':'~/dialogs/searchreplace/searchreplace.html',
    'map':'~/dialogs/map/map.html',
    'gmap':'~/dialogs/gmap/gmap.html',
    'insertvideo':'~/dialogs/video/video.html',
    'help':'~/dialogs/help/help.html',
    'preview':'~/dialogs/preview/preview.html',
    'emotion':'~/dialogs/emotion/emotion.html',
    'wordimage':'~/dialogs/wordimage/wordimage.html',
    'attachment':'~/dialogs/attachment/attachment.html',
    'insertframe':'~/dialogs/insertframe/insertframe.html',
    'edittip':'~/dialogs/table/edittip.html',
    'edittable':'~/dialogs/table/edittable.html',
    'edittd':'~/dialogs/table/edittd.html',
    'webapp':'~/dialogs/webapp/webapp.html',
    'snapscreen':'~/dialogs/snapscreen/snapscreen.html',
    'scrawl':'~/dialogs/scrawl/scrawl.html',
    'music':'~/dialogs/music/music.html',
    'template':'~/dialogs/template/template.html',
    'background':'~/dialogs/background/background.html',
    'charts': '~/dialogs/charts/charts.html'
  };
  //为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
  var btnCmds = ['undo', 'redo', 'formatmatch',
    'bold', 'italic', 'underline', 'fontborder', 'touppercase', 'tolowercase',
    'strikethrough', 'subscript', 'superscript', 'source', 'indent', 'outdent',
    'blockquote', 'pasteplain', 'pagebreak',
    'selectall', 'print','horizontal', 'removeformat', 'time', 'date', 'unlink',
    'insertparagraphbeforetable', 'insertrow', 'insertcol', 'mergeright', 'mergedown', 'deleterow',
    'deletecol', 'splittorows', 'splittocols', 'splittocells', 'mergecells', 'deletetable', 'drafts',
    'insertdesigntitle', 'insertdesignmobile', 'insertdesignname', 'imgupload', 'rowspacingleft', 'rowspacingright','fontplus', 'fontminus', 'lineheightplus', 'lineheightminus'];

  for (var i = 0, ci; ci = btnCmds[i++];) {
    ci = ci.toLowerCase();
    editorui[ci] = function (cmd) {
      return function (editor) {
        var ui = new editorui.Button({
          className:'edui-for-' + cmd,
          title:editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || '',
          onclick:function () {
            editor.execCommand(cmd);
          },
          theme:editor.options.theme,
          showText:false
        });
        editorui.buttons[cmd] = ui;
        editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
          var state = editor.queryCommandState(cmd);
          if (state == -1) {
            ui.setDisabled(true);
            ui.setChecked(false);
          } else {
            if (!uiReady) {
              ui.setDisabled(false);
              ui.setChecked(state);
            }
          }
        });
        return ui;
      };
    }(ci);
  }

  //清除文档
  editorui.cleardoc = function (editor) {
    var ui = new editorui.Button({
      className:'edui-for-cleardoc',
      title:editor.options.labelMap.cleardoc || editor.getLang("labelMap.cleardoc") || '',
      theme:editor.options.theme,
      onclick:function () {
        if (confirm(editor.getLang("confirmClear"))) {
          editor.execCommand('cleardoc');
        }
      }
    });
    editorui.buttons["cleardoc"] = ui;
    editor.addListener('selectionchange', function () {
      ui.setDisabled(editor.queryCommandState('cleardoc') == -1);
    });
    return ui;
  };

  //排版，图片排版，文字方向
  var typeset = {
    'justify':['left', 'right', 'center', 'justify'],
    'imagefloat':['none', 'left', 'center', 'right'],
    'directionality':['ltr', 'rtl']
  };

  for (var p in typeset) {

    (function (cmd, val) {
      for (var i = 0, ci; ci = val[i++];) {
        (function (cmd2) {
          editorui[cmd.replace('float', '') + cmd2] = function (editor) {
            var ui = new editorui.Button({
              className:'edui-for-' + cmd.replace('float', '') + cmd2,
              title:editor.options.labelMap[cmd.replace('float', '') + cmd2] || editor.getLang("labelMap." + cmd.replace('float', '') + cmd2) || '',
              theme:editor.options.theme,
              onclick:function () {
                editor.execCommand(cmd, cmd2);
              }
            });
            editorui.buttons[cmd] = ui;
            editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
              ui.setDisabled(editor.queryCommandState(cmd) == -1);
              ui.setChecked(editor.queryCommandValue(cmd) == cmd2 && !uiReady);
            });
            return ui;
          };
        })(ci)
      }
    })(p, typeset[p])
  }

  //字体颜色和背景颜色
  for (var i = 0, ci; ci = ['backcolor', 'forecolor'][i++];) {
    editorui[ci] = function (cmd) {
      return function (editor) {
        var ui = new editorui.ColorButton({
          className:'edui-for-' + cmd,
          color:'default',
          cmdNameCustom: cmd,
          title:editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || '',
          editor:editor,
          onpickcolor:function (t, color) {
            editor.execCommand(cmd, color);
          },
          onpicknocolor:function () {
            editor.execCommand(cmd, 'default');
            this.setColor('transparent');
            this.color = 'default';
          },
          onbuttonclick:function () {
            this.showPopup()
          }
        });
        editorui.buttons[cmd] = ui;
        editor.addListener('selectionchange', function () {
          ui.setDisabled(editor.queryCommandState(cmd) == -1);
        });
        return ui;
      };
    }(ci);
  }


  var dialogBtns = {
    noOk:['searchreplace', 'help', 'spechars', 'webapp','preview'],
    ok:['attachment', 'anchor', 'link', 'insertimage', 'map', 'gmap', 'insertframe', 'wordimage',
      'insertvideo', 'insertframe', 'edittip', 'edittable', 'edittd', 'scrawl', 'template', 'music', 'background', 'charts']
  };

  for (var p in dialogBtns) {
    (function (type, vals) {
      for (var i = 0, ci; ci = vals[i++];) {
        //todo opera下存在问题
        if (browser.opera && ci === "searchreplace") {
          continue;
        }
        (function (cmd) {
          editorui[cmd] = function (editor, iframeUrl, title) {
            iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd];
            title = editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || '';

            var dialog;
            //没有iframeUrl不创建dialog
            if (iframeUrl) {
              dialog = new editorui.Dialog(utils.extend({
                iframeUrl:editor.ui.mapUrl(iframeUrl),
                editor:editor,
                className:'edui-for-' + cmd,
                title:title,
                holdScroll: cmd === 'insertimage',
                fullscreen: /charts|preview/.test(cmd),
                closeDialog:editor.getLang("closeDialog")
              }, type == 'ok' ? {
                buttons:[
                  {
                    className:'edui-okbutton',
                    label:editor.getLang("ok"),
                    editor:editor,
                    onclick:function () {
                      dialog.close(true);
                    }
                  },
                  {
                    className:'edui-cancelbutton',
                    label:editor.getLang("cancel"),
                    editor:editor,
                    onclick:function () {
                      dialog.close(false);
                    }
                  }
                ]
              } : {}));

              editor.ui._dialogs[cmd + "Dialog"] = dialog;
            }

            var ui = new editorui.Button({
              className:'edui-for-' + cmd,
              title:title,
              onclick:function () {
                if (dialog) {
                  switch (cmd) {
                    case "wordimage":
                      var images = editor.execCommand("wordimage");
                      if (images && images.length) {
                        dialog.render();
                        dialog.open();
                      }
                      break;
                    case "scrawl":
                      if (editor.queryCommandState("scrawl") != -1) {
                        dialog.render();
                        dialog.open();
                      }

                      break;
                    default:
                      dialog.render();
                      dialog.open();
                  }
                }
              },
              theme:editor.options.theme,
              disabled:(cmd == 'scrawl' && editor.queryCommandState("scrawl") == -1) || ( cmd == 'charts' )
            });
            editorui.buttons[cmd] = ui;
            editor.addListener('selectionchange', function () {
              //只存在于右键菜单而无工具栏按钮的ui不需要检测状态
              var unNeedCheckState = {'edittable':1};
              if (cmd in unNeedCheckState)return;

              var state = editor.queryCommandState(cmd);
              if (ui.getDom()) {
                ui.setDisabled(state == -1);
                ui.setChecked(state);
              }

            });

            return ui;
          };
        })(ci.toLowerCase())
      }
    })(p, dialogBtns[p]);
  }

  editorui.snapscreen = function (editor, iframeUrl, title) {
    title = editor.options.labelMap['snapscreen'] || editor.getLang("labelMap.snapscreen") || '';
    var ui = new editorui.Button({
      className:'edui-for-snapscreen',
      title:title,
      onclick:function () {
        editor.execCommand("snapscreen");
      },
      theme:editor.options.theme

    });
    editorui.buttons['snapscreen'] = ui;
    iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})["snapscreen"] || iframeUrlMap["snapscreen"];
    if (iframeUrl) {
      var dialog = new editorui.Dialog({
        iframeUrl:editor.ui.mapUrl(iframeUrl),
        editor:editor,
        className:'edui-for-snapscreen',
        title:title,
        buttons:[
          {
            className:'edui-okbutton',
            label:editor.getLang("ok"),
            editor:editor,
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:editor.getLang("cancel"),
            editor:editor,
            onclick:function () {
              dialog.close(false);
            }
          }
        ]

      });
      dialog.render();
      editor.ui._dialogs["snapscreenDialog"] = dialog;
    }
    editor.addListener('selectionchange', function () {
      ui.setDisabled(editor.queryCommandState('snapscreen') == -1);
    });
    return ui;
  };

  editorui.insertcode = function (editor, list, title) {
    list = editor.options['insertcode'] || [];
    title = editor.options.labelMap['insertcode'] || editor.getLang("labelMap.insertcode") || '';
    // if (!list.length) return;
    var items = [];
    utils.each(list,function(key,val){
      items.push({
        label:key,
        value:val,
        theme:editor.options.theme,
        renderLabelHtml:function () {
          return '<div class="edui-label %%-label" >' + (this.label || '') + '</div>';
        }
      });
    });

    var ui = new editorui.Combox({
      editor:editor,
      items:items,
      onselect:function (t, index) {
        editor.execCommand('insertcode', this.items[index].value);
      },
      onbuttonclick:function () {
        this.showPopup();
      },
      title:title,
      initValue:title,
      className:'edui-for-insertcode',
      indexByValue:function (value) {
        if (value) {
          for (var i = 0, ci; ci = this.items[i]; i++) {
            if (ci.value.indexOf(value) != -1)
              return i;
          }
        }

        return -1;
      }
    });
    editorui.buttons['insertcode'] = ui;
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      if (!uiReady) {
        var state = editor.queryCommandState('insertcode');
        if (state == -1) {
          ui.setDisabled(true);
        } else {
          ui.setDisabled(false);
          var value = editor.queryCommandValue('insertcode');
          if(!value){
            ui.setValue(title);
            return;
          }
          //trace:1871 ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
          value && (value = value.replace(/['"]/g, '').split(',')[0]);
          ui.setValue(value);

        }
      }

    });
    return ui;
  };
  editorui.fontfamily = function (editor, list, title) {

    list = editor.options['fontfamily'] || [];
    title = editor.options.labelMap['fontfamily'] || editor.getLang("labelMap.fontfamily") || '';
    if (!list.length) return;
    for (var i = 0, ci, items = []; ci = list[i]; i++) {
      var langLabel = editor.getLang('fontfamily')[ci.name] || "";
      (function (key, val) {
        items.push({
          label:key,
          value:val,
          theme:editor.options.theme,
          renderLabelHtml:function () {
            return '<div class="edui-label %%-label" style="font-family:' +
              utils.unhtml(this.value) + '">' + (this.label || '') + '</div>';
          }
        });
      })(ci.label || langLabel, ci.val)
    }
    var ui = new editorui.Combox({
      editor:editor,
      items:items,
      onselect:function (t, index) {
        editor.execCommand('FontFamily', this.items[index].value);
      },
      onbuttonclick:function () {
        this.showPopup();
      },
      title:title,
      initValue:title,
      className:'edui-for-fontfamily',
      indexByValue:function (value) {
        if (value) {
          for (var i = 0, ci; ci = this.items[i]; i++) {
            if (ci.value.indexOf(value) != -1)
              return i;
          }
        }

        return -1;
      }
    });
    editorui.buttons['fontfamily'] = ui;
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      if (!uiReady) {
        var state = editor.queryCommandState('FontFamily');
        if (state == -1) {
          ui.setDisabled(true);
        } else {
          ui.setDisabled(false);
          var value = editor.queryCommandValue('FontFamily');
          //trace:1871 ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
          value && (value = value.replace(/['"]/g, '').split(',')[0]);
          ui.setValue(value);

        }
      }

    });
    return ui;
  };

  editorui.fontsize = function (editor, list, title) {
    title = editor.options.labelMap['fontsize'] || editor.getLang("labelMap.fontsize") || '';
    list = list || editor.options['fontsize'] || [];
    if (!list.length) return;
    var items = [];
    for (var i = 0; i < list.length; i++) {
      var size = list[i] + 'px';
      items.push({
        label:size,
        value:size,
        theme:editor.options.theme,
        renderLabelHtml:function () {
          return '<div class="edui-label %%-label" style="line-height:1;font-size:' +
            this.value + '">' + (this.label || '') + '</div>';
        }
      });
    }
    var ui = new editorui.Combox({
      editor:editor,
      items:items,
      title:title,
      initValue:title,
      onselect:function (t, index) {
        editor.execCommand('FontSize', this.items[index].value);
      },
      onbuttonclick:function () {
        this.showPopup();
      },
      className:'edui-for-fontsize'
    });
    editorui.buttons['fontsize'] = ui;
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      if (!uiReady) {
        var state = editor.queryCommandState('FontSize');
        if (state == -1) {
          ui.setDisabled(true);
        } else {
          ui.setDisabled(false);
          ui.setValue(editor.queryCommandValue('FontSize'));
        }
      }

    });
    return ui;
  };

  editorui.paragraph = function (editor, list, title) {
    title = editor.options.labelMap['paragraph'] || editor.getLang("labelMap.paragraph") || '';
    list = editor.options['paragraph'] || [];
    if (utils.isEmptyObject(list)) return;
    var items = [];
    for (var i in list) {
      items.push({
        value:i,
        label:list[i] || editor.getLang("paragraph")[i],
        theme:editor.options.theme,
        renderLabelHtml:function () {
          return '<div class="edui-label %%-label"><span class="edui-for-' + this.value + '">' + (this.label || '') + '</span></div>';
        }
      })
    }
    var ui = new editorui.Combox({
      editor:editor,
      items:items,
      title:title,
      initValue:title,
      className:'edui-for-paragraph',
      onselect:function (t, index) {
        editor.execCommand('Paragraph', this.items[index].value);
      },
      onbuttonclick:function () {
        this.showPopup();
      }
    });
    editorui.buttons['paragraph'] = ui;
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      if (!uiReady) {
        var state = editor.queryCommandState('Paragraph');
        if (state == -1) {
          ui.setDisabled(true);
        } else {
          ui.setDisabled(false);
          var value = editor.queryCommandValue('Paragraph');
          var index = ui.indexByValue(value);
          if (index != -1) {
            ui.setValue(value);
          } else {
            ui.setValue(ui.initValue);
          }
        }
      }

    });
    return ui;
  };


  //自定义标题
  editorui.customstyle = function (editor) {
    var list = editor.options['customstyle'] || [],
      title = editor.options.labelMap['customstyle'] || editor.getLang("labelMap.customstyle") || '';
    if (!list.length)return;
    var langCs = editor.getLang('customstyle');
    for (var i = 0, items = [], t; t = list[i++];) {
      (function (t) {
        var ck = {};
        ck.label = t.label ? t.label : langCs[t.name];
        ck.style = t.style;
        ck.className = t.className;
        ck.tag = t.tag;
        items.push({
          label:ck.label,
          value:ck,
          theme:editor.options.theme,
          renderLabelHtml:function () {
            return '<div class="edui-label %%-label">' + '<' + ck.tag + ' ' + (ck.className ? ' class="' + ck.className + '"' : "")
              + (ck.style ? ' style="' + ck.style + '"' : "") + '>' + ck.label + "<\/" + ck.tag + ">"
              + '</div>';
          }
        });
      })(t);
    }

    var ui = new editorui.Combox({
      editor:editor,
      items:items,
      title:title,
      initValue:title,
      className:'edui-for-customstyle',
      onselect:function (t, index) {
        editor.execCommand('customstyle', this.items[index].value);
      },
      onbuttonclick:function () {
        this.showPopup();
      },
      indexByValue:function (value) {
        for (var i = 0, ti; ti = this.items[i++];) {
          if (ti.label == value) {
            return i - 1
          }
        }
        return -1;
      }
    });
    editorui.buttons['customstyle'] = ui;
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      if (!uiReady) {
        var state = editor.queryCommandState('customstyle');
        if (state == -1) {
          ui.setDisabled(true);
        } else {
          ui.setDisabled(false);
          var value = editor.queryCommandValue('customstyle');
          var index = ui.indexByValue(value);
          if (index != -1) {
            ui.setValue(value);
          } else {
            ui.setValue(ui.initValue);
          }
        }
      }

    });
    return ui;
  };
  editorui.inserttable = function (editor, iframeUrl, title) {
    title = editor.options.labelMap['inserttable'] || editor.getLang("labelMap.inserttable") || '';
    var ui = new editorui.TableButton({
      editor:editor,
      title:title,
      className:'edui-for-inserttable',
      onpicktable:function (t, numCols, numRows) {
        editor.execCommand('InsertTable', {numRows:numRows, numCols:numCols, border:1});
      },
      onbuttonclick:function () {
        this.showPopup();
      }
    });
    editorui.buttons['inserttable'] = ui;
    editor.addListener('selectionchange', function () {
      ui.setDisabled(editor.queryCommandState('inserttable') == -1);
    });
    return ui;
  };

  editorui.lineheight = function (editor) {
    var val = editor.options.lineheight || [];
    if (!val.length)return;
    for (var i = 0, ci, items = []; ci = val[i++];) {
      items.push({
        //todo:写死了
        label:ci,
        value:ci,
        theme:editor.options.theme,
        onclick:function () {
          editor.execCommand("lineheight", this.value);
        }
      })
    }
    var ui = new editorui.MenuButton({
      editor:editor,
      className:'edui-for-lineheight',
      title:editor.options.labelMap['lineheight'] || editor.getLang("labelMap.lineheight") || '',
      items:items,
      onbuttonclick:function () {
        this.showPopup();
        /*var value = editor.queryCommandValue('LineHeight') || this.value;
        editor.execCommand("LineHeight", value);*/
      }
    });
    editorui.buttons['lineheight'] = ui;
    editor.addListener('selectionchange', function () {
      var state = editor.queryCommandState('LineHeight');
      if (state == -1) {
        ui.setDisabled(true);
      } else {
        ui.setDisabled(false);
        var value = editor.queryCommandValue('LineHeight');
        value && ui.setValue((value + '').replace(/cm/, ''));
        ui.setChecked(state)
      }
    });
    return ui;
  };

  var rowspacings = ['top', 'bottom', 'left', 'right'];
  for (var r = 0, ri; ri = rowspacings[r++];) {
    (function (cmd) {
      editorui['rowspacing' + cmd] = function (editor) {
        var val = editor.options['rowspacing' + cmd] || [];
        if (!val.length) return null;
        for (var i = 0, ci, items = []; ci = val[i++];) {
          items.push({
            label:ci,
            value:ci,
            theme:editor.options.theme,
            onclick:function () {
              editor.execCommand("rowspacing", this.value, cmd);
            }
          })
        }
        var ui = new editorui.MenuButton({
          editor:editor,
          className:'edui-for-rowspacing' + cmd,
          title:editor.options.labelMap['rowspacing' + cmd] || editor.getLang("labelMap.rowspacing" + cmd) || '',
          items:items,
          onbuttonclick:function () {
            var value = editor.queryCommandValue('rowspacing', cmd) || this.value;
            editor.execCommand("rowspacing", value, cmd);
          }
        });
        editorui.buttons[cmd] = ui;
        editor.addListener('selectionchange', function () {
          var state = editor.queryCommandState('rowspacing', cmd);
          if (state == -1) {
            ui.setDisabled(true);
          } else {
            ui.setDisabled(false);
            var value = editor.queryCommandValue('rowspacing', cmd);
            value && ui.setValue((value + '').replace(/%/, ''));
            ui.setChecked(state)
          }
        });
        return ui;
      }
    })(ri)
  }
  //有序，无序列表
  var lists = ['insertorderedlist', 'insertunorderedlist'];
  for (var l = 0, cl; cl = lists[l++];) {
    (function (cmd) {
      editorui[cmd] = function (editor) {
        var vals = editor.options[cmd],
          _onMenuClick = function () {
            editor.execCommand(cmd, this.value);
          }, items = [];
        for (var i in vals) {
          items.push({
            label:vals[i] || editor.getLang()[cmd][i] || "",
            value:i,
            theme:editor.options.theme,
            onclick:_onMenuClick
          })
        }
        var ui = new editorui.MenuButton({
          editor:editor,
          className:'edui-for-' + cmd,
          title:editor.getLang("labelMap." + cmd) || '',
          'items':items,
          onbuttonclick:function () {
            var value = editor.queryCommandValue(cmd) || this.value;
            editor.execCommand(cmd, value);
          }
        });
        editorui.buttons[cmd] = ui;
        editor.addListener('selectionchange', function () {
          var state = editor.queryCommandState(cmd);
          if (state == -1) {
            ui.setDisabled(true);
          } else {
            ui.setDisabled(false);
            var value = editor.queryCommandValue(cmd);
            ui.setValue(value);
            ui.setChecked(state)
          }
        });
        return ui;
      };
    })(cl)
  }

  editorui.fullscreen = function (editor, title) {
    title = editor.options.labelMap['fullscreen'] || editor.getLang("labelMap.fullscreen") || '';
    var ui = new editorui.Button({
      className:'edui-for-fullscreen',
      title:title,
      theme:editor.options.theme,
      onclick:function () {
        if (editor.ui) {
          editor.ui.setFullScreen(!editor.ui.isFullScreen());
        }
        this.setChecked(editor.ui.isFullScreen());
      }
    });
    editorui.buttons['fullscreen'] = ui;
    editor.addListener('selectionchange', function () {
      var state = editor.queryCommandState('fullscreen');
      ui.setDisabled(state == -1);
      ui.setChecked(editor.ui.isFullScreen());
    });
    return ui;
  };

  // 表情
  editorui["emotion"] = function (editor, iframeUrl) {
    var cmd = "emotion";
    var ui = new editorui.MultiMenuPop({
      title:editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd + "") || '',
      editor:editor,
      className:'edui-for-' + cmd,
      iframeUrl:editor.ui.mapUrl(iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd])
    });
    editorui.buttons[cmd] = ui;

    editor.addListener('selectionchange', function () {
      ui.setDisabled(editor.queryCommandState(cmd) == -1)
    });
    return ui;
  };

  editorui.autotypeset = function (editor) {
    var ui = new editorui.AutoTypeSetButton({
      editor:editor,
      title:editor.options.labelMap['autotypeset'] || editor.getLang("labelMap.autotypeset") || '',
      className:'edui-for-autotypeset',
      onbuttonclick:function () {
        editor.execCommand('autotypeset')
      }
    });
    editorui.buttons['autotypeset'] = ui;
    editor.addListener('selectionchange', function () {
      ui.setDisabled(editor.queryCommandState('autotypeset') == -1);
    });
    return ui;
  };

  /* 简单上传插件 */
  editorui["simpleupload"] = function (editor) {
    var name = 'simpleupload',
      ui = new editorui.Button({
        className:'edui-for-' + name,
        title:editor.options.labelMap[name] || editor.getLang("labelMap." + name) || '',
        onclick:function () {},
        theme:editor.options.theme,
        showText:false
      });
    editorui.buttons[name] = ui;
    editor.addListener('ready', function() {
      var b = ui.getDom('body'),
        iconSpan = b.children[0];
      editor.fireEvent('simpleuploadbtnready', iconSpan);
    });
    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
      var state = editor.queryCommandState(name);
      if (state == -1) {
        ui.setDisabled(true);
        ui.setChecked(false);
      } else {
        if (!uiReady) {
          ui.setDisabled(false);
          ui.setChecked(state);
        }
      }
    });
    return ui;
  };

})();


// adapter/editor.js
///import core
///commands 全屏
///commandsName FullScreen
///commandsTitle  全屏
(function () {
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase,
    domUtils = baidu.editor.dom.domUtils;
  var nodeStack = [];

  function EditorUI(options) {
    this.initOptions(options);
    this.initEditorUI();
  }

  EditorUI.prototype = {
    uiName:'editor',
    initEditorUI:function () {
      this.editor.ui = this;
      this._dialogs = {};
      this.initUIBase();
      this._initToolbars();
      var editor = this.editor,
        me = this;

      editor.addListener('ready', function () {
        //提供getDialog方法
        editor.getDialog = function (name) {
          return editor.ui._dialogs[name + "Dialog"];
        };
        domUtils.on(editor.window, 'scroll', function (evt) {
          baidu.editor.ui.Popup.postHide(evt);
        });
        //提供编辑器实时宽高(全屏时宽高不变化)
        editor.ui._actualFrameWidth = editor.options.initialFrameWidth;

        UE.browser.ie && UE.browser.version === 6 && editor.container.ownerDocument.execCommand("BackgroundImageCache", false, true);

        //display bottom-bar label based on config
        if (editor.options.elementPathEnabled) {
          editor.ui.getDom('elementpath').innerHTML = '<div class="edui-editor-breadcrumb">' + editor.getLang("elementPathTip") + ':</div>';
        }
        if (editor.options.wordCount) {
          function countFn() {
            setCount(editor,me);
            domUtils.un(editor.document, "click", arguments.callee);
          }
          domUtils.on(editor.document, "click", countFn);
          editor.ui.getDom('wordcount').innerHTML = editor.getLang("wordCountTip");
        }
        editor.ui._scale();
        if (editor.options.scaleEnabled) {
          if (editor.autoHeightEnabled) {
            editor.disableAutoHeight();
          }
          me.enableScale();
        } else {
          me.disableScale();
        }
        if (!editor.options.elementPathEnabled && !editor.options.wordCount && !editor.options.scaleEnabled) {
          editor.ui.getDom('elementpath').style.display = "none";
          editor.ui.getDom('wordcount').style.display = "none";
          editor.ui.getDom('scale').style.display = "none";
        }

        if (!editor.selection.isFocus())return;
        editor.fireEvent('selectionchange', false, true);


      });

      editor.addListener('mousedown', function (t, evt) {
        var el = evt.target || evt.srcElement;
        baidu.editor.ui.Popup.postHide(evt, el);
        baidu.editor.ui.ShortCutMenu.postHide(evt);

      });
      editor.addListener("delcells", function () {
        if (UE.ui['edittip']) {
          new UE.ui['edittip'](editor);
        }
        editor.getDialog('edittip').open();
      });

      var pastePop, isPaste = false, timer;
      editor.addListener("afterpaste", function () {
        if(editor.queryCommandState('pasteplain'))
          return;
        if(baidu.editor.ui.PastePicker){
          pastePop = new baidu.editor.ui.Popup({
            content:new baidu.editor.ui.PastePicker({editor:editor}),
            editor:editor,
            className:'edui-wordpastepop'
          });
          pastePop.render();
        }
        isPaste = true;
      });

      editor.addListener("afterinserthtml", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (pastePop && (isPaste || editor.ui._isTransfer)) {
            if(pastePop.isHidden()){
              var span = domUtils.createElement(editor.document, 'span', {
                  'style':"line-height:0px;",
                  'innerHTML':'\ufeff'
                }),
                range = editor.selection.getRange();
              range.insertNode(span);
              var tmp= getDomNode(span, 'firstChild', 'previousSibling');
              tmp && pastePop.showAnchor(tmp.nodeType == 3 ? tmp.parentNode : tmp);
              domUtils.remove(span);
            }else{
              pastePop.show();
            }
            delete editor.ui._isTransfer;
            isPaste = false;
          }
        }, 200)
      });
      editor.addListener('contextmenu', function (t, evt) {
        baidu.editor.ui.Popup.postHide(evt);
      });
      editor.addListener('keydown', function (t, evt) {
        if (pastePop)    pastePop.dispose(evt);
        var keyCode = evt.keyCode || evt.which;
        if(evt.altKey&&keyCode==90){
          UE.ui.buttons['fullscreen'].onclick();
        }
      });
      editor.addListener('wordcount', function (type) {
        setCount(this,me);
      });
      function setCount(editor,ui) {
        editor.setOpt({
          wordCount:true,
          maximumWords:10000,
          wordCountMsg:editor.options.wordCountMsg || editor.getLang("wordCountMsg"),
          wordOverFlowMsg:editor.options.wordOverFlowMsg || editor.getLang("wordOverFlowMsg")
        });
        var opt = editor.options,
          max = opt.maximumWords,
          msg = opt.wordCountMsg ,
          errMsg = opt.wordOverFlowMsg,
          countDom = ui.getDom('wordcount');
        if (!opt.wordCount) {
          return;
        }
        var count = editor.getContentLength(true);
        if (count > max) {
          countDom.innerHTML = errMsg;
          editor.fireEvent("wordcountoverflow");
        } else {
          countDom.innerHTML = msg.replace("{#leave}", max - count).replace("{#count}", count);
        }
      }

      editor.addListener('selectionchange', function () {
        if (editor.options.elementPathEnabled) {
          me[(editor.queryCommandState('elementpath') == -1 ? 'dis' : 'en') + 'ableElementPath']()
        }
        if (editor.options.scaleEnabled) {
          me[(editor.queryCommandState('scale') == -1 ? 'dis' : 'en') + 'ableScale']();

        }
      });
      var popup = new baidu.editor.ui.Popup({
        editor:editor,
        content:'',
        className:'edui-bubble',
        _onEditButtonClick:function () {
          this.hide();
          editor.ui._dialogs.linkDialog.open();
        },
        _onImgEditButtonClick:function (name) {
          this.hide();
          editor.ui._dialogs[name] && editor.ui._dialogs[name].open();

        },
        _onImgSetFloat:function (value) {
          this.hide();
          editor.execCommand("imagefloat", value);

        },
        _setIframeAlign:function (value) {
          var frame = popup.anchorEl;
          var newFrame = frame.cloneNode(true);
          switch (value) {
            case -2:
              newFrame.setAttribute("align", "");
              break;
            case -1:
              newFrame.setAttribute("align", "left");
              break;
            case 1:
              newFrame.setAttribute("align", "right");
              break;
          }
          frame.parentNode.insertBefore(newFrame, frame);
          domUtils.remove(frame);
          popup.anchorEl = newFrame;
          popup.showAnchor(popup.anchorEl);
        },
        _updateIframe:function () {
          var frame = editor._iframe = popup.anchorEl;
          if(domUtils.hasClass(frame, 'ueditor_baidumap')) {
            editor.selection.getRange().selectNode(frame).select();
            editor.ui._dialogs.mapDialog.open();
            popup.hide();
          } else {
            editor.ui._dialogs.insertframeDialog.open();
            popup.hide();
          }
        },
        _onRemoveButtonClick:function (cmdName) {
          editor.execCommand(cmdName);
          this.hide();
        },
        queryAutoHide:function (el) {
          if (el && el.ownerDocument == editor.document) {
            if (el.tagName.toLowerCase() == 'img' || domUtils.findParentByTagName(el, 'a', true)) {
              return el !== popup.anchorEl;
            }
          }
          return baidu.editor.ui.Popup.prototype.queryAutoHide.call(this, el);
        }
      });
      popup.render();
      if (editor.options.imagePopup) {
        editor.addListener('mouseover', function (t, evt) {
          evt = evt || window.event;
          var el = evt.target || evt.srcElement;
          if (editor.ui._dialogs.insertframeDialog && /iframe/ig.test(el.tagName)) {
            var html = popup.formatHtml(
                '<nobr>' + editor.getLang("property") + ': <span onclick=$$._setIframeAlign(-2) class="edui-clickable">' + editor.getLang("default") + '</span>&nbsp;&nbsp;<span onclick=$$._setIframeAlign(-1) class="edui-clickable">' + editor.getLang("justifyleft") + '</span>&nbsp;&nbsp;<span onclick=$$._setIframeAlign(1) class="edui-clickable">' + editor.getLang("justifyright") + '</span>&nbsp;&nbsp;' +
                ' <span onclick="$$._updateIframe( this);" class="edui-clickable">' + editor.getLang("modify") + '</span></nobr>');
            if (html) {
              popup.getDom('content').innerHTML = html;
              popup.anchorEl = el;
              popup.showAnchor(popup.anchorEl);
            } else {
              popup.hide();
            }
          }
        });
        editor.addListener('selectionchange', function (t, causeByUi) {
          if (!causeByUi) return;
          var html = '', str = "",
            img = editor.selection.getRange().getClosedNode(),
            dialogs = editor.ui._dialogs;
          if (img && img.tagName == 'IMG') {
            var dialogName = 'insertimageDialog';
            if (img.className.indexOf("edui-faked-video") != -1 || img.className.indexOf("edui-upload-video") != -1) {
              dialogName = "insertvideoDialog"
            }
            if (img.className.indexOf("edui-faked-webapp") != -1) {
              dialogName = "webappDialog"
            }
            if (img.src.indexOf("http://api.map.baidu.com") != -1) {
              dialogName = "mapDialog"
            }
            if (img.className.indexOf("edui-faked-music") != -1) {
              dialogName = "musicDialog"
            }
            if (img.src.indexOf("http://maps.google.com/maps/api/staticmap") != -1) {
              dialogName = "gmapDialog"
            }
            if (img.getAttribute("anchorname")) {
              dialogName = "anchorDialog";
              html = popup.formatHtml(
                  '<nobr>' + editor.getLang("property") + ': <span onclick=$$._onImgEditButtonClick("anchorDialog") class="edui-clickable">' + editor.getLang("modify") + '</span>&nbsp;&nbsp;' +
                  '<span onclick=$$._onRemoveButtonClick(\'anchor\') class="edui-clickable">' + editor.getLang("delete") + '</span></nobr>');
            }
            if (img.getAttribute("word_img")) {
              //todo 放到dialog去做查询
              editor.word_img = [img.getAttribute("word_img")];
              dialogName = "wordimageDialog"
            }
            if(domUtils.hasClass(img, 'loadingclass') || domUtils.hasClass(img, 'loaderrorclass')) {
              dialogName = "";
            }
            if (!dialogs[dialogName]) {
              return;
            }
            str = '<nobr>' + editor.getLang("property") + ': '+
              '<span onclick=$$._onImgSetFloat("none") class="edui-clickable">' + editor.getLang("default") + '</span>&nbsp;&nbsp;' +
              '<span onclick=$$._onImgSetFloat("left") class="edui-clickable">' + editor.getLang("justifyleft") + '</span>&nbsp;&nbsp;' +
              '<span onclick=$$._onImgSetFloat("right") class="edui-clickable">' + editor.getLang("justifyright") + '</span>&nbsp;&nbsp;' +
              '<span onclick=$$._onImgSetFloat("center") class="edui-clickable">' + editor.getLang("justifycenter") + '</span>&nbsp;&nbsp;'+
              '<span onclick="$$._onImgEditButtonClick(\'' + dialogName + '\');" class="edui-clickable">' + editor.getLang("modify") + '</span></nobr>';

            !html && (html = popup.formatHtml(str))

          }
          if (editor.ui._dialogs.linkDialog) {
            var link = editor.queryCommandValue('link');
            var url;
            if (link && (url = (link.getAttribute('_href') || link.getAttribute('href', 2)))) {
              var txt = url;
              if (url.length > 30) {
                txt = url.substring(0, 20) + "...";
              }
              if (html) {
                html += '<div style="height:5px;"></div>'
              }
              html += popup.formatHtml(
                  '<nobr>' + editor.getLang("anthorMsg") + ': <a target="_blank" href="' + url + '" title="' + url + '" >' + txt + '</a>' +
                  ' <span class="edui-clickable" onclick="$$._onEditButtonClick();">' + editor.getLang("modify") + '</span>' +
                  ' <span class="edui-clickable" onclick="$$._onRemoveButtonClick(\'unlink\');"> ' + editor.getLang("clear") + '</span></nobr>');
              popup.showAnchor(link);
            }
          }

          if (html) {
            popup.getDom('content').innerHTML = html;
            popup.anchorEl = img || link;
            popup.showAnchor(popup.anchorEl);
          } else {
            popup.hide();
          }
        });
      }

    },
    _initToolbars:function () {
      var editor = this.editor;
      var toolbars = this.toolbars || [];
      var toolbarUis = [];
      for (var i = 0; i < toolbars.length; i++) {
        var toolbar = toolbars[i];
        var toolbarUi = new baidu.editor.ui.Toolbar({theme:editor.options.theme});
        for (var j = 0; j < toolbar.length; j++) {
          var toolbarItem = toolbar[j];
          var toolbarItemUi = null;
          if (typeof toolbarItem == 'string') {
            toolbarItem = toolbarItem.toLowerCase();
            if (toolbarItem == '|') {
              toolbarItem = 'Separator';
            }
            if(toolbarItem == '||'){
              toolbarItem = 'Breakline';
            }
            if (baidu.editor.ui[toolbarItem]) {
              toolbarItemUi = new baidu.editor.ui[toolbarItem](editor);
            }

            //fullscreen这里单独处理一下，放到首行去
            if (toolbarItem == 'fullscreen') {
              if (toolbarUis && toolbarUis[0]) {
                toolbarUis[0].items.splice(0, 0, toolbarItemUi);
              } else {
                toolbarItemUi && toolbarUi.items.splice(0, 0, toolbarItemUi);
              }

              continue;


            }
          } else {
            toolbarItemUi = toolbarItem;
          }
          if (toolbarItemUi && toolbarItemUi.id) {

            toolbarUi.add(toolbarItemUi);
          }
        }
        toolbarUis[i] = toolbarUi;
      }

      //接受外部定制的UI

      utils.each(UE._customizeUI,function(obj,key){
        var itemUI,index;
        if(obj.id && obj.id != editor.key){
          return false;
        }
        itemUI = obj.execFn.call(editor,editor,key);
        if(itemUI){
          index = obj.index;
          if(index === undefined){
            index = toolbarUi.items.length;
          }
          toolbarUi.add(itemUI,index)
        }
      });

      this.toolbars = toolbarUis;
    },
    getHtmlTpl:function () {
      return '<div id="##" class="%%">' +
        '<div id="##_toolbarbox" class="%%-toolbarbox">' +
        (this.toolbars.length ?
          '<div id="##_toolbarboxouter" class="%%-toolbarboxouter"><div class="%%-toolbarboxinner">' +
          this.renderToolbarBoxHtml() +
          '</div></div>' : '') +
        '<div id="##_toolbarmsg" class="%%-toolbarmsg" style="display:none;">' +
        '<div id = "##_upload_dialog" class="%%-toolbarmsg-upload" onclick="$$.showWordImageDialog();">' + this.editor.getLang("clickToUpload") + '</div>' +
        '<div class="%%-toolbarmsg-close" onclick="$$.hideToolbarMsg();">x</div>' +
        '<div id="##_toolbarmsg_label" class="%%-toolbarmsg-label"></div>' +
        '<div style="height:0;overflow:hidden;clear:both;"></div>' +
        '</div>' +
        '<div id="##_message_holder" class="%%-messageholder"></div>' +
        '</div>' +
        '<div id="##_iframeholder" class="%%-iframeholder">' +
        '</div>' +
        //modify wdcount by matao
        '<div id="##_bottombar" class="%%-bottomContainer"><table><tr>' +
        '<td id="##_elementpath" class="%%-bottombar"></td>' +
        '<td id="##_wordcount" class="%%-wordcount"></td>' +
        '<td id="##_scale" class="%%-scale"><div class="%%-icon"></div></td>' +
        '</tr></table></div>' +
        '<div id="##_scalelayer"></div>' +
        '</div>';
    },
    showWordImageDialog:function () {
      this._dialogs['wordimageDialog'].open();
    },
    renderToolbarBoxHtml:function () {
      var buff = [];
      for (var i = 0; i < this.toolbars.length; i++) {
        buff.push(this.toolbars[i].renderHtml());
      }
      return buff.join('');
    },
    setFullScreen:function (fullscreen) {

      var editor = this.editor,
        container = editor.container.parentNode.parentNode;
      if (this._fullscreen != fullscreen) {
        this._fullscreen = fullscreen;
        this.editor.fireEvent('beforefullscreenchange', fullscreen);
        if (baidu.editor.browser.gecko) {
          var bk = editor.selection.getRange().createBookmark();
        }
        if (fullscreen) {
          while (container.tagName != "BODY") {
            var position = baidu.editor.dom.domUtils.getComputedStyle(container, "position");
            nodeStack.push(position);
            container.style.position = "static";
            container = container.parentNode;
          }
          this._bakHtmlOverflow = document.documentElement.style.overflow;
          this._bakBodyOverflow = document.body.style.overflow;
          this._bakAutoHeight = this.editor.autoHeightEnabled;
          this._bakScrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

          this._bakEditorContaninerWidth = editor.iframe.parentNode.offsetWidth;
          if (this._bakAutoHeight) {
            //当全屏时不能执行自动长高
            editor.autoHeightEnabled = false;
            this.editor.disableAutoHeight();
          }

          document.documentElement.style.overflow = 'hidden';
          //修复，滚动条不收起的问题

          window.scrollTo(0,window.scrollY);
          this._bakCssText = this.getDom().style.cssText;
          this._bakCssText1 = this.getDom('iframeholder').style.cssText;
          editor.iframe.parentNode.style.width = '';
          this._updateFullScreen();
        } else {
          while (container.tagName != "BODY") {
            container.style.position = nodeStack.shift();
            container = container.parentNode;
          }
          this.getDom().style.cssText = this._bakCssText;
          this.getDom('iframeholder').style.cssText = this._bakCssText1;
          if (this._bakAutoHeight) {
            editor.autoHeightEnabled = true;
            this.editor.enableAutoHeight();
          }

          document.documentElement.style.overflow = this._bakHtmlOverflow;
          document.body.style.overflow = this._bakBodyOverflow;
          editor.iframe.parentNode.style.width = this._bakEditorContaninerWidth + 'px';
          window.scrollTo(0, this._bakScrollTop);
        }
        if (browser.gecko && editor.body.contentEditable === 'true') {
          var input = document.createElement('input');
          document.body.appendChild(input);
          editor.body.contentEditable = false;
          setTimeout(function () {
            input.focus();
            setTimeout(function () {
              editor.body.contentEditable = true;
              editor.fireEvent('fullscreenchanged', fullscreen);
              editor.selection.getRange().moveToBookmark(bk).select(true);
              baidu.editor.dom.domUtils.remove(input);
              fullscreen && window.scroll(0, 0);
            }, 0)
          }, 0)
        }

        if(editor.body.contentEditable === 'true'){
          this.editor.fireEvent('fullscreenchanged', fullscreen);
          this.triggerLayout();
        }

      }
    },
    _updateFullScreen:function () {
      if (this._fullscreen) {
        var vpRect = uiUtils.getViewportRect();
        this.getDom().style.cssText = 'border:0;position:absolute;left:0;top:' + (this.editor.options.topOffset || 0) + 'px;width:' + vpRect.width + 'px;height:' + vpRect.height + 'px;z-index:' + (this.getDom().style.zIndex * 1 + 100);
        uiUtils.setViewportOffset(this.getDom(), { left:0, top:this.editor.options.topOffset || 0 });
        this.editor.setHeight(vpRect.height - this.getDom('toolbarbox').offsetHeight - this.getDom('bottombar').offsetHeight - (this.editor.options.topOffset || 0),true);
        //不手动调一下，会导致全屏失效
        if(browser.gecko){
          try{
            window.onresize();
          }catch(e){

          }

        }
      }
    },
    _updateElementPath:function () {
      var bottom = this.getDom('elementpath'), list;
      if (this.elementPathEnabled && (list = this.editor.queryCommandValue('elementpath'))) {

        var buff = [];
        for (var i = 0, ci; ci = list[i]; i++) {
          buff[i] = this.formatHtml('<span unselectable="on" onclick="$$.editor.execCommand(&quot;elementpath&quot;, &quot;' + i + '&quot;);">' + ci + '</span>');
        }
        bottom.innerHTML = '<div class="edui-editor-breadcrumb" onmousedown="return false;">' + this.editor.getLang("elementPathTip") + ': ' + buff.join(' &gt; ') + '</div>';

      } else {
        bottom.style.display = 'none'
      }
    },
    disableElementPath:function () {
      var bottom = this.getDom('elementpath');
      bottom.innerHTML = '';
      bottom.style.display = 'none';
      this.elementPathEnabled = false;

    },
    enableElementPath:function () {
      var bottom = this.getDom('elementpath');
      bottom.style.display = '';
      this.elementPathEnabled = true;
      this._updateElementPath();
    },
    _scale:function () {
      var doc = document,
        editor = this.editor,
        editorHolder = editor.container,
        editorDocument = editor.document,
        toolbarBox = this.getDom("toolbarbox"),
        bottombar = this.getDom("bottombar"),
        scale = this.getDom("scale"),
        scalelayer = this.getDom("scalelayer");

      var isMouseMove = false,
        position = null,
        minEditorHeight = 0,
        minEditorWidth = editor.options.minFrameWidth,
        pageX = 0,
        pageY = 0,
        scaleWidth = 0,
        scaleHeight = 0;

      function down() {
        position = domUtils.getXY(editorHolder);

        if (!minEditorHeight) {
          minEditorHeight = editor.options.minFrameHeight + toolbarBox.offsetHeight + bottombar.offsetHeight;
        }

        scalelayer.style.cssText = "position:absolute;left:0;display:;top:0;background-color:#41ABFF;opacity:0.4;filter: Alpha(opacity=40);width:" + editorHolder.offsetWidth + "px;height:"
          + editorHolder.offsetHeight + "px;z-index:" + (editor.options.zIndex + 1);

        domUtils.on(doc, "mousemove", move);
        domUtils.on(editorDocument, "mouseup", up);
        domUtils.on(doc, "mouseup", up);
      }

      var me = this;
      //by xuheng 全屏时关掉缩放
      this.editor.addListener('fullscreenchanged', function (e, fullScreen) {
        if (fullScreen) {
          me.disableScale();

        } else {
          if (me.editor.options.scaleEnabled) {
            me.enableScale();
            var tmpNode = me.editor.document.createElement('span');
            me.editor.body.appendChild(tmpNode);
            me.editor.body.style.height = Math.max(domUtils.getXY(tmpNode).y, me.editor.iframe.offsetHeight - 20) + 'px';
            domUtils.remove(tmpNode)
          }
        }
      });
      function move(event) {
        clearSelection();
        var e = event || window.event;
        pageX = e.pageX || (doc.documentElement.scrollLeft + e.clientX);
        pageY = e.pageY || (doc.documentElement.scrollTop + e.clientY);
        scaleWidth = pageX - position.x;
        scaleHeight = pageY - position.y;

        if (scaleWidth >= minEditorWidth) {
          isMouseMove = true;
          scalelayer.style.width = scaleWidth + 'px';
        }
        if (scaleHeight >= minEditorHeight) {
          isMouseMove = true;
          scalelayer.style.height = scaleHeight + "px";
        }
      }

      function up() {
        if (isMouseMove) {
          isMouseMove = false;
          editor.ui._actualFrameWidth = scalelayer.offsetWidth - 2;
          editorHolder.style.width = editor.ui._actualFrameWidth + 'px';

          editor.setHeight(scalelayer.offsetHeight - bottombar.offsetHeight - toolbarBox.offsetHeight - 2,true);
        }
        if (scalelayer) {
          scalelayer.style.display = "none";
        }
        clearSelection();
        domUtils.un(doc, "mousemove", move);
        domUtils.un(editorDocument, "mouseup", up);
        domUtils.un(doc, "mouseup", up);
      }

      function clearSelection() {
        if (browser.ie)
          doc.selection.clear();
        else
          window.getSelection().removeAllRanges();
      }

      this.enableScale = function () {
        //trace:2868
        if (editor.queryCommandState("source") == 1)    return;
        scale.style.display = "";
        this.scaleEnabled = true;
        domUtils.on(scale, "mousedown", down);
      };
      this.disableScale = function () {
        scale.style.display = "none";
        this.scaleEnabled = false;
        domUtils.un(scale, "mousedown", down);
      };
    },
    isFullScreen:function () {
      return this._fullscreen;
    },
    postRender:function () {
      UIBase.prototype.postRender.call(this);
      for (var i = 0; i < this.toolbars.length; i++) {
        this.toolbars[i].postRender();
      }
      var me = this;
      var timerId,
        domUtils = baidu.editor.dom.domUtils,
        updateFullScreenTime = function () {
          clearTimeout(timerId);
          timerId = setTimeout(function () {
            me._updateFullScreen();
          });
        };
      domUtils.on(window, 'resize', updateFullScreenTime);

      me.addListener('destroy', function () {
        domUtils.un(window, 'resize', updateFullScreenTime);
        clearTimeout(timerId);
      })
    },
    showToolbarMsg:function (msg, flag) {
      this.getDom('toolbarmsg_label').innerHTML = msg;
      this.getDom('toolbarmsg').style.display = '';
      //
      if (!flag) {
        var w = this.getDom('upload_dialog');
        w.style.display = 'none';
      }
    },
    hideToolbarMsg:function () {
      this.getDom('toolbarmsg').style.display = 'none';
    },
    mapUrl:function (url) {
      return url ? url.replace('~/', this.editor.options.UEDITOR_HOME_URL || '') : ''
    },
    triggerLayout:function () {
      var dom = this.getDom();
      if (dom.style.zoom == '1') {
        dom.style.zoom = '100%';
      } else {
        dom.style.zoom = '1';
      }
    }
  };
  utils.inherits(EditorUI, baidu.editor.ui.UIBase);


  var instances = {};


  UE.ui.Editor = function (options) {
    var editor = new UE.Editor(options);
    editor.options.editor = editor;
    utils.loadFile(document, {
      href:editor.options.themePath + editor.options.theme + "/css/ueditor.css?v=1",
      tag:"link",
      type:"text/css",
      rel:"stylesheet"
    });

    var oldRender = editor.render;
    editor.render = function (holder) {
      if (holder.constructor === String) {
        editor.key = holder;
        instances[holder] = editor;
      }
      utils.domReady(function () {
        editor.langIsReady ? renderUI() : editor.addListener("langReady", renderUI);
        function renderUI() {
          editor.setOpt({
            labelMap:editor.options.labelMap || editor.getLang('labelMap')
          });
          new EditorUI(editor.options);
          if (holder) {
            if (holder.constructor === String) {
              holder = document.getElementById(holder);
            }
            holder && holder.getAttribute('name') && ( editor.options.textarea = holder.getAttribute('name'));
            if (holder && /script|textarea/ig.test(holder.tagName)) {
              var newDiv = document.createElement('div');
              holder.parentNode.insertBefore(newDiv, holder);
              var cont = holder.value || holder.innerHTML;
              editor.options.initialContent = /^[\t\r\n ]*$/.test(cont) ? editor.options.initialContent :
                cont.replace(/>[\n\r\t]+([ ]{4})+/g, '>')
                  .replace(/[\n\r\t]+([ ]{4})+</g, '<')
                  .replace(/>[\n\r\t]+</g, '><');
              holder.className && (newDiv.className = holder.className);
              holder.style.cssText && (newDiv.style.cssText = holder.style.cssText);
              if (/textarea/i.test(holder.tagName)) {
                editor.textarea = holder;
                editor.textarea.style.display = 'none';


              } else {
                holder.parentNode.removeChild(holder);


              }
              if(holder.id){
                newDiv.id = holder.id;
                domUtils.removeAttributes(holder,'id');
              }
              holder = newDiv;
              holder.innerHTML = '';
            }

          }
          domUtils.addClass(holder, "edui-" + editor.options.theme);
          editor.ui.render(holder);
          var opt = editor.options;
          //给实例添加一个编辑器的容器引用
          editor.container = editor.ui.getDom();
          var parents = domUtils.findParents(holder,true);
          var displays = [];
          for(var i = 0 ,ci;ci=parents[i];i++){
            displays[i] = ci.style.display;
            ci.style.display = 'block'
          }
          if (opt.initialFrameWidth) {
            opt.minFrameWidth = opt.initialFrameWidth;
          } else {
            opt.minFrameWidth = opt.initialFrameWidth = holder.offsetWidth;
            var styleWidth = holder.style.width;
            if(/%$/.test(styleWidth)) {
              opt.initialFrameWidth = styleWidth;
            }
          }
          if (opt.initialFrameHeight) {
            opt.minFrameHeight = opt.initialFrameHeight;
          } else {
            opt.initialFrameHeight = opt.minFrameHeight = holder.offsetHeight;
          }
          for(var i = 0 ,ci;ci=parents[i];i++){
            ci.style.display =  displays[i]
          }
          //编辑器最外容器设置了高度，会导致，编辑器不占位
          //todo 先去掉，没有找到原因
          if(holder.style.height){
            holder.style.height = ''
          }
          editor.container.style.width = opt.initialFrameWidth + (/%$/.test(opt.initialFrameWidth) ? '' : 'px');
          editor.container.style.zIndex = opt.zIndex;
          oldRender.call(editor, editor.ui.getDom('iframeholder'));
          editor.fireEvent("afteruiready");
        }
      })
    };
    return editor;
  };


  /**
   * @file
   * @name UE
   * @short UE
   * @desc UEditor的顶部命名空间
   */
  /**
   * @name getEditor
   * @since 1.2.4+
   * @grammar UE.getEditor(id,[opt])  =>  Editor实例
   * @desc 提供一个全局的方法得到编辑器实例
   *
   * * ''id''  放置编辑器的容器id, 如果容器下的编辑器已经存在，就直接返回
   * * ''opt'' 编辑器的可选参数
   * @example
   *  UE.getEditor('containerId',{onready:function(){//创建一个编辑器实例
     *      this.setContent('hello')
     *  }});
   *  UE.getEditor('containerId'); //返回刚创建的实例
   *
   */
  UE.getEditor = function (id, opt) {
    var editor = instances[id];
    if (!editor) {
      editor = instances[id] = new UE.ui.Editor(opt);
      editor.render(id);
    }
    return editor;
  };


  UE.delEditor = function (id) {
    var editor;
    if (editor = instances[id]) {
      editor.key && editor.destroy();
      delete instances[id]
    }
  };

  UE.registerUI = function(uiName,fn,index,editorId){
    utils.each(uiName.split(/\s+/), function (name) {
      UE._customizeUI[name] = {
        id : editorId,
        execFn:fn,
        index:index
      };
    })

  }

})();
