// plugins/font.js
/**
 * 字体颜色,背景色,字号,字体,下划线,删除线
 * @file
 * @since 1.2.6.1
 */

/**
 * 字体颜色
 * @command forecolor
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } value 色值(必须十六进制)
 * @example
 * ```javascript
 * editor.execCommand( 'forecolor', '#000' );
 * ```
 */
/**
 * 返回选区字体颜色
 * @command forecolor
 * @method queryCommandValue
 * @param { String } cmd 命令字符串
 * @return { String } 返回字体颜色
 * @example
 * ```javascript
 * editor.queryCommandValue( 'forecolor' );
 * ```
 */

/**
 * 字体背景颜色
 * @command backcolor
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } value 色值(必须十六进制)
 * @example
 * ```javascript
 * editor.execCommand( 'backcolor', '#000' );
 * ```
 */
/**
 * 返回选区字体颜色
 * @command backcolor
 * @method queryCommandValue
 * @param { String } cmd 命令字符串
 * @return { String } 返回字体背景颜色
 * @example
 * ```javascript
 * editor.queryCommandValue( 'backcolor' );
 * ```
 */

/**
 * 字体大小
 * @command fontsize
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } value 字体大小
 * @example
 * ```javascript
 * editor.execCommand( 'fontsize', '14px' );
 * ```
 */
/**
 * 返回选区字体大小
 * @command fontsize
 * @method queryCommandValue
 * @param { String } cmd 命令字符串
 * @return { String } 返回字体大小
 * @example
 * ```javascript
 * editor.queryCommandValue( 'fontsize' );
 * ```
 */

/**
 * 字体样式
 * @command fontfamily
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } value 字体样式
 * @example
 * ```javascript
 * editor.execCommand( 'fontfamily', '微软雅黑' );
 * ```
 */
/**
 * 返回选区字体样式
 * @command fontfamily
 * @method queryCommandValue
 * @param { String } cmd 命令字符串
 * @return { String } 返回字体样式
 * @example
 * ```javascript
 * editor.queryCommandValue( 'fontfamily' );
 * ```
 */

/**
 * 字体下划线,与删除线互斥
 * @command underline
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'underline' );
 * ```
 */

/**
 * 字体删除线,与下划线互斥
 * @command strikethrough
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'strikethrough' );
 * ```
 */

/**
 * 字体边框
 * @command fontborder
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'fontborder' );
 * ```
 */

UE.plugins['font'] = function () {
  var me = this,
    fonts = {
      'forecolor': 'color',
      'backcolor': 'background-color',
      'fontsize': 'font-size',
      'fontfamily': 'font-family',
      'underline': 'text-decoration',
      'strikethrough': 'text-decoration',
      'fontborder': 'border'
    },
    needCmd = {'underline': 1, 'strikethrough': 1, 'fontborder': 1},
    needSetChild = {
      'forecolor': 'color',
      'backcolor': 'background-color',
      'fontsize': 'font-size',
      'fontfamily': 'font-family'

    };
  me.setOpt({
    'fontfamily': [
      { name: 'songti', val: '宋体,SimSun'},
      { name: 'yahei', val: '微软雅黑,Microsoft YaHei'},
      { name: 'kaiti', val: '楷体,楷体_GB2312, SimKai'},
      { name: 'heiti', val: '黑体, SimHei'},
      { name: 'lishu', val: '隶书, SimLi'},
      { name: 'andaleMono', val: 'andale mono'},
      { name: 'arial', val: 'arial, helvetica,sans-serif'},
      { name: 'arialBlack', val: 'arial black,avant garde'},
      { name: 'comicSansMs', val: 'comic sans ms'},
      { name: 'impact', val: 'impact,chicago'},
      { name: 'timesNewRoman', val: 'times new roman'}
    ],
    'fontsize': [10,12,14,16,18,20, 22, 24, 26, 28, 30, 34, 38, 42, 50]
  });

  function mergeWithParent(node){
    var parent;
    while(parent = node.parentNode){
      if(parent.tagName == 'SPAN' && domUtils.getChildCount(parent,function(child){
        return !domUtils.isBookmarkNode(child) && !domUtils.isBr(child)
      }) == 1) {
        parent.style.cssText += node.style.cssText;
        domUtils.remove(node,true);
        node = parent;

      }else{
        break;
      }
    }

  }
  function mergeChild(rng,cmdName,value){
    if(needSetChild[cmdName]){
      rng.adjustmentBoundary();
      if(!rng.collapsed && rng.startContainer.nodeType == 1){
        var start = rng.startContainer.childNodes[rng.startOffset];
        if(start && domUtils.isTagNode(start,'span')){
          var bk = rng.createBookmark();
          utils.each(domUtils.getElementsByTagName(start, 'span'), function (span) {
            if (!span.parentNode || domUtils.isBookmarkNode(span))return;
            if(cmdName == 'backcolor' && domUtils.getComputedStyle(span,'background-color').toLowerCase() === value){
              return;
            }
            domUtils.removeStyle(span,needSetChild[cmdName]);
            if(span.style.cssText.replace(/^\s+$/,'').length == 0){
              domUtils.remove(span,true)
            }
          });
          rng.moveToBookmark(bk)
        }
      }
    }

  }
  function mergesibling(rng,cmdName,value) {
    var collapsed = rng.collapsed,
      bk = rng.createBookmark(), common;
    if (collapsed) {
      common = bk.start.parentNode;
      while (dtd.$inline[common.tagName]) {
        common = common.parentNode;
      }
    } else {
      common = domUtils.getCommonAncestor(bk.start, bk.end);
    }
    utils.each(domUtils.getElementsByTagName(common, 'span'), function (span) {
      if (!span.parentNode || domUtils.isBookmarkNode(span))return;
      if (/\s*border\s*:\s*none;?\s*/i.test(span.style.cssText)) {
        if(/^\s*border\s*:\s*none;?\s*$/.test(span.style.cssText)){
          domUtils.remove(span, true);
        }else{
          domUtils.removeStyle(span,'border');
        }
        return
      }
      if (/border/i.test(span.style.cssText) && span.parentNode.tagName == 'SPAN' && /border/i.test(span.parentNode.style.cssText)) {
        span.style.cssText = span.style.cssText.replace(/border[^:]*:[^;]+;?/gi, '');
      }
      if(!(cmdName=='fontborder' && value=='none')){
        var next = span.nextSibling;
        while (next && next.nodeType == 1 && next.tagName == 'SPAN' ) {
          if(domUtils.isBookmarkNode(next) && cmdName == 'fontborder') {
            span.appendChild(next);
            next = span.nextSibling;
            continue;
          }
          if (next.style.cssText == span.style.cssText) {
            domUtils.moveChild(next, span);
            domUtils.remove(next);
          }
          if (span.nextSibling === next)
            break;
          next = span.nextSibling;
        }
      }


      mergeWithParent(span);
      if(browser.ie && browser.version > 8 ){
        //拷贝父亲们的特别的属性,这里只做背景颜色的处理
        var parent = domUtils.findParent(span,function(n){return n.tagName == 'SPAN' && /background-color/.test(n.style.cssText)});
        if(parent && !/background-color/.test(span.style.cssText)){
          span.style.backgroundColor = parent.style.backgroundColor;
        }
      }

    });
    rng.moveToBookmark(bk);
    mergeChild(rng,cmdName,value)
  }

  me.addInputRule(function (root) {
    utils.each(root.getNodesByTagName('u s del font strike'), function (node) {
      if (node.tagName == 'font') {
        var cssStyle = [];
        for (var p in node.attrs) {
          switch (p) {
            case 'size':
              cssStyle.push('font-size:' +
                ({
                  /*0.8,0.9,1.0,1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0*/
                  '1':'0.8',
                  '2':'0.9',
                  '3':'1.0',
                  '4':'1.1',
                  '5':'1.2',
                  '6':'1.3',
                  '7':'1.4',
                  '8':'1.5',
                  '9':'1.6',
                  '10':'1.7',
                  '11':'1.8',
                  '12':'1.9',
                  '13':'2.0',
                  '14':'2.2',
                  '15':'2.4',
                  '16':'2.6',
                  '17':'2.8',
                  '18':'3.0',
                  '19':'5.0',
                  '20':'8.0',
                  '21':'10.0',
                  '22':'15.0',
                  '23':'20.0',
                  '24':'30.0'
                }[node.attrs[p]] || node.attrs[p]));
              break;
            case 'color':
              cssStyle.push('color:' + node.attrs[p]);
              break;
            case 'face':
              cssStyle.push('font-family:' + node.attrs[p]);
              break;
            case 'style':
              cssStyle.push(node.attrs[p]);
          }
        }
        node.attrs = {
          'style': cssStyle.join(';')
        };
      } else {
        var val = node.tagName == 'u' ? 'underline' : 'line-through';
        node.attrs = {
          'style': (node.getAttr('style') || '') + 'text-decoration:' + val + ';'
        }
      }
      node.tagName = 'span';
    });
//        utils.each(root.getNodesByTagName('span'), function (node) {
//            var val;
//            if(val = node.getAttr('class')){
//                if(/fontstrikethrough/.test(val)){
//                    node.setStyle('text-decoration','line-through');
//                    if(node.attrs['class']){
//                        node.attrs['class'] = node.attrs['class'].replace(/fontstrikethrough/,'');
//                    }else{
//                        node.setAttr('class')
//                    }
//                }
//                if(/fontborder/.test(val)){
//                    node.setStyle('border','1px solid #000');
//                    if(node.attrs['class']){
//                        node.attrs['class'] = node.attrs['class'].replace(/fontborder/,'');
//                    }else{
//                        node.setAttr('class')
//                    }
//                }
//            }
//        });
  });
//    me.addOutputRule(function(root){
//        utils.each(root.getNodesByTagName('span'), function (node) {
//            var val;
//            if(val = node.getStyle('text-decoration')){
//                if(/line-through/.test(val)){
//                    if(node.attrs['class']){
//                        node.attrs['class'] += ' fontstrikethrough';
//                    }else{
//                        node.setAttr('class','fontstrikethrough')
//                    }
//                }
//
//                node.setStyle('text-decoration')
//            }
//            if(val = node.getStyle('border')){
//                if(/1px/.test(val) && /solid/.test(val)){
//                    if(node.attrs['class']){
//                        node.attrs['class'] += ' fontborder';
//
//                    }else{
//                        node.setAttr('class','fontborder')
//                    }
//                }
//                node.setStyle('border')
//
//            }
//        });
//    });
  for (var p in fonts) {
    (function (cmd, style) {
      UE.commands[cmd] = {
        execCommand: function (cmdName, value) {
          value = value || (this.queryCommandState(cmdName) ? 'none' : cmdName == 'underline' ? 'underline' :
              cmdName == 'fontborder' ? '1px solid #000' :
            'line-through');
          var me = this,
            range = this.selection.getRange(),
            text;

          if (value == 'default') {

            if (range.collapsed) {
              text = me.document.createTextNode('font');
              range.insertNode(text).select();

            }
            me.execCommand('removeFormat', 'span,a', style);
            if (text) {
              range.setStartBefore(text).collapse(true);
              domUtils.remove(text);
            }
            mergesibling(range,cmdName,value);
            range.select()
          } else {
            if (!range.collapsed) {
              if (needCmd[cmd] && me.queryCommandValue(cmd)) {
                me.execCommand('removeFormat', 'span,a', style);
              }
              range = me.selection.getRange();

              range.applyInlineStyle('span', {'style': style + ':' + value});
              mergesibling(range, cmdName,value);
              range.select();
            } else {

              var span = domUtils.findParentByTagName(range.startContainer, 'span', true);
              text = me.document.createTextNode('font');
              if (span && !span.children.length && !span[browser.ie ? 'innerText' : 'textContent'].replace(fillCharReg, '').length) {
                //for ie hack when enter
                range.insertNode(text);
                if (needCmd[cmd]) {
                  range.selectNode(text).select();
                  me.execCommand('removeFormat', 'span,a', style, null);

                  span = domUtils.findParentByTagName(text, 'span', true);
                  range.setStartBefore(text);

                }
                span && (span.style.cssText += ';' + style + ':' + value);
                range.collapse(true).select();


              } else {
                range.insertNode(text);
                range.selectNode(text).select();
                span = range.document.createElement('span');

                if (needCmd[cmd]) {
                  //a标签内的不处理跳过
                  if (domUtils.findParentByTagName(text, 'a', true)) {
                    range.setStartBefore(text).setCursor();
                    domUtils.remove(text);
                    return;
                  }
                  me.execCommand('removeFormat', 'span,a', style);
                }

                span.style.cssText = style + ':' + value;


                text.parentNode.insertBefore(span, text);
                //修复，span套span 但样式不继承的问题
                if (!browser.ie || browser.ie && browser.version == 9) {
                  var spanParent = span.parentNode;
                  while (!domUtils.isBlockElm(spanParent)) {
                    if (spanParent.tagName == 'SPAN') {
                      //opera合并style不会加入";"
                      span.style.cssText = spanParent.style.cssText + ";" + span.style.cssText;
                    }
                    spanParent = spanParent.parentNode;
                  }
                }


                if (opera) {
                  setTimeout(function () {
                    range.setStart(span, 0).collapse(true);
                    mergesibling(range, cmdName,value);
                    range.select();
                  });
                } else {
                  range.setStart(span, 0).collapse(true);
                  mergesibling(range,cmdName,value);
                  range.select();
                }

                //trace:981
                //domUtils.mergeToParent(span)
              }
              domUtils.remove(text);
            }


          }
          return true;
        },
        queryCommandValue: function (cmdName) {
          var startNode = this.selection.getStart();
          //trace:946
          if (cmdName == 'fontborder') {
            var tmp = startNode, val;
            while (tmp && dtd.$inline[tmp.tagName]) {
              if (val = domUtils.getComputedStyle(tmp, 'border')) {

                if (/1px/.test(val) && /solid/.test(val)) {
                  if (cmdName == 'underline' || cmdName == 'strikethrough') {
                    var tmpNode = startNode, value;
                    while (tmpNode && !domUtils.isBlockElm(tmpNode) && !domUtils.isBody(tmpNode)) {
                      if (tmpNode.nodeType == 1) {
                        value = domUtils.getComputedStyle(tmpNode, style);
                        if (value != 'none') {
                          return value;
                        }
                      }

                      tmpNode = tmpNode.parentNode;
                    }
                    return 'none';
                  }
                  return val;
                }
              }
              tmp = tmp.parentNode;
            }
            return ''
          }
          // edited
          if( cmdName == 'FontSize' || cmdName == 'fontsize' ) {
            var styleVal = domUtils.getComputedStyle(startNode, style),
              tmp = /^([\d\.]+)(\w+)$/.exec( styleVal );
            //if( tmp && tmp[2] !=='em') {
              //return (parseFloat( tmp[1]).toFixed(1)/12).toFixed(1) + 'em';
            if (tmp){
              return (parseFloat(tmp[1]) + tmp[2]);
            }

            return styleVal;

          }
          if(cmdName == 'forecolor'){
            return $(startNode).css(style);
          }
          if (cmdName == 'backcolor'){
            return $(startNode).css('background-color');
          }

          return  domUtils.getComputedStyle(startNode, style);
        },
        queryCommandState: function (cmdName) {
          if (!needCmd[cmdName])
            return 0;
          var val = this.queryCommandValue(cmdName);
          if (cmdName == 'fontborder') {
            return /1px/.test(val) && /solid/.test(val)
          } else {
            return  cmdName == 'underline' ? /underline/.test(val) : /line\-through/.test(val);

          }

        }
      };
    })(p, fonts[p]);
  }
};
