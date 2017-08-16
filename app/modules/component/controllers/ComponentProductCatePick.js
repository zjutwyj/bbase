'use strict';
/**
 * @description 模块功能说明
 * @class ComponentProductCatePick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentProductCatePick', [], function(require, exports, module){
  var ComponentProductCatePick, template;

  template = `
    <div class="ComponentProductCatePick-wrap" style="padding:20px;">

<div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbasecomponentproductcatepick="{viewId: 'productcatepick', cur: cur, listApi: '/product/cate/list'"</span>
            </div>
          </div>
          <div class="main">
          <div  class="demo-item clearfix"><a href="javascript:;" bb-bbasecomponentproductcatepick="{viewId: 'componentproductcate1', items: items, cur: cur, onChange: handleChnage}">选择产品分类</a></div>
          </div>
          <div class="footer">
          <div class="item-type-title clearfix left nowrap" bb-watch="cur:html,size:html">输出结果：{{cur}}; 列表长度: {{size}}</div>
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
                  <td class="argName"><span>items</span></td>
                  <td class="argDesc"><span>静态产品分类列表</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(value, items)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>listApi</span></td>
                  <td class="argDesc"><span>列表API</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>/product/list</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>domain</span></td>
                  <td class="argDesc"><span>图片前缀, 前面不要带http://</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>size</span></td>
                  <td class="argDesc"><span>图片大小</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>5</span></td>
                </tr>




              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  var items = [];

  for (var i = 0; i < 100; i++) {
    if (0 <= i && i < 10) {
      items.push({
        id: i,
        parentId: null,
        name: 'name' + i,
        type: 'type' + i,
        sort: i
      });
    } else if (10 <= i && i < 80) {
      items.push({
        id: i,
        parentId: i % 10,
        name: 'name' + i,
        type: 'type' + i,
        sort: i
      });
    } else if (80 <= i && i < 100) {
      items.push({
        id: i,
        parentId: 2 * 10 + i % 10,
        name: 'name' + i,
        type: 'type' + i,
        sort: i
      });
    }
  }

  ComponentProductCatePick = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function(){
      return {
        cur: '1',
        size: 0,
        items: items   // 测试数据， 真实需请求api
      }
    },
    handleChnage: function(value, items){
      this._set('size', items.length);
    }
  });

  module.exports = ComponentProductCatePick;
});