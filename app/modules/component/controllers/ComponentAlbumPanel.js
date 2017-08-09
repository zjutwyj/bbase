'use strict';
/**
 * @description 模块功能说明
 * @class ComponentAlbumPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentAlbumPanel', [], function(require, exports, module){
  var ComponentAlbumPanel, template;

  template = `
    <div class="ComponentAlbumPanel-wrap" style="padding:20px;">

<div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbasecomponentalbumpanel="{viewId: 'bbasecomponentalbumpanel', cur: cur, items: items}"</span>
            </div>
          </div>
          <div class="main">
          <div  class="demo-item clearfix" bb-bbasecomponentalbumpanel="{viewId: 'componentAlbum1', cur: cur, showSettingBtn: true, items: items}"></div>
          </div>
          <div class="footer">
          <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}};</div>
          </div>
        </div>
      </div>
      <div class="formPanel form-api">
        <div class="anything">
          <div class="main">
            <table class="title">
              <tbody>
                <tr>
                  <td>参数</td>
                  <td>说明</td>
                  <td>类型</td>
                  <td>默认值</td>
                </tr>
              </tbody>
            </table>
            <table class="content">
              <tbody class="uilist01-tbody">
                <tr>
                  <td class="argName"><span>viewId</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>视图标识符</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>cur</span></td>
                  <td class="argDesc"><span>当前图片地址</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>listApi</span></td>
                  <td class="argDesc"><span>图片选择API</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>items</span></td>
                  <td class="argDesc"><span>指定图片列表</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>[]</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>width</span></td>
                  <td class="argDesc"><span>指定窗口宽度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>240</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>size</span></td>
                  <td class="argDesc"><span>图片大小</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>120</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>showSettingBtn</span></td>
                  <td class="argDesc"><span>显示设置按钮</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

   var pics = [
    'http://img.leminchou.com/wcd/upload/029/2017/07/26/c2f0fe48-4061-4713-a4cd-c2dc6abf3866.jpg?v=3783305377',
    'http://img.leminchou.com/wcd/upload/029/2017/07/25/a78f0f86-0327-443a-a6cb-4ef8d26ee4ab.jpg?v=3744100224',
    'http://img.leminchou.com/wcd/upload/029/2017/07/15/08af373a-8e2c-41ec-9103-d8abbf3e536c.png?v=116420884',
    'http://img.leminchou.com/wcd/upload/029/2017/07/13/7adea40c-820a-4336-b833-995cdff61123.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/12/7463464c-cd1e-4489-8a08-47835afb07a0.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/11/1f6b6da0-b633-4cf7-b8dc-b73a9886b06f.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/11/da830860-c7f1-4a7a-9718-34561f162447.png?v=3706144612',
    'http://img.leminchou.com/wcd/upload/029/2017/07/01/dc2a3332-3415-40e6-9384-49afa427273b.jpg?v=3738521475',
    'http://img.leminchou.com/wcd/upload/029/2017/06/24/636cf652-4dc1-4990-8c40-61d3ad5c2783.png?v=4058835084'
    ];

  for (var j = 0; j < 10; j++) {
      pics = pics.concat(pics);
  }
  var items = [];
  for(var i = 0; i< 200; i++){
    items.push({albumId: i,name:'相册名称' + i, mainPic: pics[i] + i, attCount: i});
  }
  ComponentAlbumPanel = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function(){
      return {
        cur: '1',
        items: items   // 测试数据， 真实需请求api
      }
    }
  });

  module.exports = ComponentAlbumPanel;
});