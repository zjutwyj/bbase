'use strict';
/**
 * @description 模块功能说明
 * @class ComponentListPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentListPick', [], function(require, exports, module){
  var ComponentListPick, template;

  template = `
    <div class="ComponentListPick-wrap" style="padding:20px;">
<div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">指令用法：bbasecomponentlistpick="{viewId:'bbasecomponentlistpick', cur: cur, items: items}"</span>
            </div>
          </div>
          <div class="main">
          <div class="demo-item clearfix"><a href="javascript:;" class="demo-item clearfix" bb-bbasecomponentlistpick="{viewId: 'componentListPick', title: '部件列表',items: items, cur:cur}">选择部件</a></div>
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
                  <td class="argName"><span>cur</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>关联模型类字段</span></td>
                  <td class="argType"><span>any</span></td>
                  <td class="argDefault"><span>-</span></td>
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

  var items = [];
  for(var i = 0; i< 20; i++){
    items.push({id: '' + i, name:'图片' + i, display: '01'});
  }

  ComponentListPick = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function(){
      return {
        cur: '0',
        items: items   // 测试数据， 真实需请求api
      }
    }
  });

  module.exports = ComponentListPick;
});