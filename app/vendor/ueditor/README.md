##文件目录
- 初始化html样式 /src/editor.js


## 插件开发
- 添加样式： #lmc .edui-default .edui-toolbar .edui-for-insertdesigntitle .edui-icon{width: 85px !important; background: url(img/ueditor/insertdesigntitle.png) no-repeat scroll 0 0 transparent !important; }
- 添加按钮：在ueditor.all.js中搜索“var btnCmds”即可找到
- 添加JS： OrganizeModule = TextModule.extend({
              initToolBars: function () {
                window.UEDITOR_CONFIG.toolbars = [CONST.UEDITOR_ORGANIZE.concat(["|", "insertdesigntitle", "insertdesignmobile", "insertdesignname"])];
              },
              initReady: function (editor) {
                // 添加监控
                UE.getEditor(editorId).addListener('fontplus', function () {
                          UE.getEditor(editorId).execCommand('insertHtml', "fontplus");
                        });
              }
            });
            // ueditor.custom.js
            UE.commands['insertdesigntitle'] = {
              execCommand: function () {
                this.fireEvent("insertdesigntitle");
              }
            };



##编辑器背景透明
- #design-center .edui-default .edui-editor{background-color: transparent;}
  #design-center .CodeMirror-wrap .CodeMirror-scroll{background-color: #fff;}




##不过滤style或script
  首先在ueditor.all.js文件内搜索allowDivTransToP,找到如下的代码，将true设置为false
  me.setOpt('allowDivTransToP',false);
  找到
  switch (node.tagName) {
  case 'style':
  case 'script':
  node.setAttr({
  cdata_tag: node.tagName,
  cdata_data: (node.innerHTML() || ''),
  '_ue_custom_node_':'true'
  });
  node.tagName = 'div';
  node.innerHTML('');
  break;
  case 'a':
  if (val = node.getAttr('href')) {
  node.setAttr('_href', val)
  }
  break;
  删除里面的case 'style':或case 'script':即可

##不在li里添加p标签
  找到如下代码
  //进入编辑器的li要套p标签
  去掉以下一段
  utils.each(root.getNodesByTagName('li'),function(li){
  var tmpP = UE.uNode.createElement('p');
  for(var i= 0,ci;ci=li.children[i];){
  if(ci.type == 'text' || dtd.p[ci.tagName]){
  tmpP.appendChild(ci);
  }else{
  if(tmpP.firstChild()){
  li.insertBefore(tmpP,ci);
  tmpP = UE.uNode.createElement('p');
  i = i + 2;
  }else{
  i++;
  }
  }
  }
  if(tmpP.firstChild() && !tmpP.parentNode || !li.firstChild()){
  li.appendChild(tmpP);
  }
  //trace:3357
  //p不能为空
  if (!tmpP.firstChild()) {
  tmpP.innerHTML(browser.ie ? '&nbsp;' : '<br/>')
  }
  //去掉末尾的空白
  var p = li.firstChild();
  var lastChild = p.lastChild();
  if(lastChild && lastChild.type == 'text' && /^\s*$/.test(lastChild.data)){
  p.removeChild(lastChild)
  }
  });

##ul加list-paddingleft-2类
  找到 function adjustListStyle(doc,ignore){
  // 下点狠手，将里面的内容全部去掉
  }

