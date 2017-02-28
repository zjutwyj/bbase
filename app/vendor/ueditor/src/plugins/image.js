// plugins/image.js
/**
 * 图片插入、排版插件
 * @file
 * @since 1.2.6.1
 */

/**
 * 图片对齐方式
 * @command imagefloat
 * @method execCommand
 * @remind 值center为独占一行居中
 * @param { String } cmd 命令字符串
 * @param { String } align 对齐方式，可传left、right、none、center
 * @remaind center表示图片独占一行
 * @example
 * ```javascript
 * editor.execCommand( 'imagefloat', 'center' );
 * ```
 */

/**
 * 如果选区所在位置是图片区域
 * @command imagefloat
 * @method queryCommandValue
 * @param { String } cmd 命令字符串
 * @return { String } 返回图片对齐方式
 * @example
 * ```javascript
 * editor.queryCommandValue( 'imagefloat' );
 * ```
 */

UE.commands['imagefloat'] = {
  execCommand:function (cmd, align) {
    var me = this,
      range = me.selection.getRange();
    if (!range.collapsed) {
      var img = range.getClosedNode();
      if (img && img.tagName == 'IMG') {
        switch (align) {
          case 'left':
          case 'right':
          case 'none':
            var pN = img.parentNode, tmpNode, pre, next;
            while (dtd.$inline[pN.tagName] || pN.tagName == 'A') {
              pN = pN.parentNode;
            }
            tmpNode = pN;
            if (tmpNode.tagName == 'P' && domUtils.getStyle(tmpNode, 'text-align') == 'center') {
              if (!domUtils.isBody(tmpNode) && domUtils.getChildCount(tmpNode, function (node) {
                return !domUtils.isBr(node) && !domUtils.isWhitespace(node);
              }) == 1) {
                pre = tmpNode.previousSibling;
                next = tmpNode.nextSibling;
                if (pre && next && pre.nodeType == 1 && next.nodeType == 1 && pre.tagName == next.tagName && domUtils.isBlockElm(pre)) {
                  pre.appendChild(tmpNode.firstChild);
                  while (next.firstChild) {
                    pre.appendChild(next.firstChild);
                  }
                  domUtils.remove(tmpNode);
                  domUtils.remove(next);
                } else {
                  domUtils.setStyle(tmpNode, 'text-align', '');
                }


              }

              range.selectNode(img).select();
            }
            domUtils.setStyle(img, 'float', align == 'none' ? '' : align);
            if(align == 'none'){
              domUtils.removeAttributes(img,'align');
            }

            break;
          case 'center':
            if (me.queryCommandValue('imagefloat') != 'center') {
              pN = img.parentNode;
              domUtils.setStyle(img, 'float', '');
              domUtils.removeAttributes(img,'align');
              tmpNode = img;
              while (pN && domUtils.getChildCount(pN, function (node) {
                return !domUtils.isBr(node) && !domUtils.isWhitespace(node);
              }) == 1
                && (dtd.$inline[pN.tagName] || pN.tagName == 'A')) {
                tmpNode = pN;
                pN = pN.parentNode;
              }
              range.setStartBefore(tmpNode).setCursor(false);
              pN = me.document.createElement('div');
              pN.appendChild(tmpNode);
              domUtils.setStyle(tmpNode, 'float', '');

              me.execCommand('insertHtml', '<p id="_img_parent_tmp" style="text-align:center">' + pN.innerHTML + '</p>');

              tmpNode = me.document.getElementById('_img_parent_tmp');
              tmpNode.removeAttribute('id');
              tmpNode = tmpNode.firstChild;
              range.selectNode(tmpNode).select();
              //去掉后边多余的元素
              next = tmpNode.parentNode.nextSibling;
              if (next && domUtils.isEmptyNode(next)) {
                domUtils.remove(next);
              }

            }

            break;
        }

      }
    }
  },
  queryCommandValue:function () {
    var range = this.selection.getRange(),
      startNode, floatStyle;
    if (range.collapsed) {
      return 'none';
    }
    startNode = range.getClosedNode();
    if (startNode && startNode.nodeType == 1 && startNode.tagName == 'IMG') {
      floatStyle = domUtils.getComputedStyle(startNode, 'float') || startNode.getAttribute('align');

      if (floatStyle == 'none') {
        floatStyle = domUtils.getComputedStyle(startNode.parentNode, 'text-align') == 'center' ? 'center' : floatStyle;
      }
      return {
        left:1,
        right:1,
        center:1
      }[floatStyle] ? floatStyle : 'none';
    }
    return 'none';


  },
  queryCommandState:function () {
    var range = this.selection.getRange(),
      startNode;

    if (range.collapsed)  return -1;

    startNode = range.getClosedNode();
    if (startNode && startNode.nodeType == 1 && startNode.tagName == 'IMG') {
      return 0;
    }
    return -1;
  }
};
