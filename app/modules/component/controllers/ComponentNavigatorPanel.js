'use strict';
/**
 * @description 模块功能说明
 * @class ComponentNavigatorPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentNavigatorPanel', [], function(require, exports, module) {
  var ComponentNavigatorPanel, template;

  template = `
    <div class="ComponentNavigatorPanel-wrap" style="padding:20px;">

<div class="formPanel form-demo">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="name">bbasecomponentnavigatorpanel="{viewId: 'bbasecomponentnavigatorpanel', cur: cur, items: items,path:'id'}"</span>
            </div>
          </div>
          <div class="main">
          <div  class="demo-item clearfix" style="height: 500px;overflow:auto;" bb-bbasecomponentnavigatorpanel="{viewId: 'bbasecomponentnavigatorpanel', cur: cur, items: items, height:400}"></div>
          </div>
          <div class="footer">
          <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}};</div>
          <div class="left">&nbsp;&nbsp;<a href="javascript:;" bb-click="selectTwo">选中第2项</a></div>
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
                  <td class="argDesc"><span>当前id</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>path</span></td>
                  <td class="argDesc"><span>指定比较字段</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>id</span></td>
                </tr> <tr>
                  <td class="argName"><span>detailModule</span></td>
                  <td class="argDesc"><span>请求详细模块</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>BbaseNavigatorDetail</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>listApi</span></td>
                  <td class="argDesc"><span>图片选择API</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>items</span></td>
                  <td class="argDesc"><span>指定列表</span></td>
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
                  <td class="argName"><span>height</span></td>
                  <td class="argDesc"><span>指定窗口高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>240</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onShow</span></td>
                  <td class="argDesc"><span>组件视图显示后回调</span></td>
                  <td class="argType"><span>function()</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onSortEnd</span></td>
                  <td class="argDesc"><span>排序后回调</span></td>
                  <td class="argType"><span>function()</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  var items = [
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 0, id: "4149", lanId: 1, layoutId: 97, name: "首页", navigatorId: 4149, navigatorId2: null, page: "index", parentId: null, seoDescription: "", seoKeywords: "", seoTitle: "", sort: 1, type: "s", updateTime: "" },
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 0, id: "4150", lanId: 1, layoutId: 97, name: "产品展示", navigatorId: 4150, navigatorId2: null, page: "product", parentId: null, seoDescription: "", seoKeywords: "", seoTitle: "", sort: 2, type: "s", updateTime: "" },
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 0, id: "4151", lanId: 1, layoutId: 97, name: "新闻动态", navigatorId: 4151, navigatorId2: null, page: "news", parentId: null, seoDescription: "", seoKeywords: "", seoTitle: "", sort: 3, type: "s", updateTime: "" },
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 0, id: "4154", lanId: 1, layoutId: 97, name: "在线留言", navigatorId: 4154, navigatorId2: null, page: "message", parentId: null, sort: 6, type: "s", updateTime: "" },
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 1, id: "4160", lanId: 1, layoutId: 97, name: "API测试1", navigatorId: 4160, navigatorId2: 1, page: "col", parentId: '4150', sort: 12, type: "c", updateTime: "" },
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 1, id: "4161", lanId: 1, layoutId: 97, name: "API测试2", navigatorId: 4161, navigatorId2: 1, page: "col", parentId: '4150', sort: 13, type: "c", updateTime: "" },
    { display: "s", enterpriseId: "Enterp_0000000000000000000049090", grade: 1, id: "4162", lanId: 1, layoutId: 97, name: "API测试3", navigatorId: 4162, navigatorId2: 1, page: "col", parentId: '4150', sort: 14, type: "c", updateTime: "" }
  ]

  ComponentNavigatorPanel = BbaseView.extend({
    initialize: function() {
      this._super({
        template: template
      });
    },
    init: function() {
      return {
        cur: '',
        items: items // 测试数据， 真实需请求api
      }
    },
    selectTwo() {
      this._set('cur', '4150');
    }
  });

  module.exports = ComponentNavigatorPanel;
});