'use strict';
/**
 * @description 模块功能说明
 * @class ComponentProductPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentProductPick', [], function(require, exports, module){
  var ComponentProductPick, template;

  template = `
    <div class="ComponentProductPick-wrap" style="padding:20px;">

<div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbasecomponentproductpick="{viewId: 'productpick', cur: cur, listApi: '/product/list'"</span>
            </div>
          </div>
          <div class="main">
          <div  class="demo-item clearfix"><a href="javascript:;" bb-bbasecomponentproductpick="{viewId: 'componentproduct1', items: items, cur: cur, onChange: handleChnage}">选择产品</a></div>
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
                  <td class="argName"><span>productList</span></td>
                  <td class="argDesc"><span>已选中的产品列表</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>[]</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>items</span></td>
                  <td class="argDesc"><span>静态产品列表</span></td>
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
                  <td class="argName"><span>productIdPath</span></td>
                  <td class="argDesc"><span>产品ID字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>productId</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>namePath</span></td>
                  <td class="argDesc"><span>产品名称字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>name</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>picPathPath</span></td>
                  <td class="argDesc"><span>产品图片字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>picPath</span></td>
                </tr>
                  <tr>
                  <td class="argName"><span>prodtypePath</span></td>
                  <td class="argDesc"><span>产品型号字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>prodtypePath</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>addTimePath</span></td>
                  <td class="argDesc"><span>产品添加时间字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>addTimePath</span></td>
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
    items.push({
      productId: '' + i,
      name: '产品名称' + i,
      prodtype: i,
      picPath: CONST.PIC_NONE + '?' + i,
      addTime: new Date()
    });
  }

  ComponentProductPick = BbaseView.extend({
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

  module.exports = ComponentProductPick;
});