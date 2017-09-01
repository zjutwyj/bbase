'use strict';
/**
 * @description 模块功能说明
 * @class UiListExpand
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiListExpand', [], function(require, exports, module){
  var UiListExpand, template;

  template = `
     <div class="UiListExpand-wrap module-wrap">
    <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">bbaseuilistexpand="{viewId: 'viewId', cur: cur, items: listitems, max: 4,onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
            <div class="demo-item clearfix" bb-bbaseuilistexpand="{viewId:'bbaseuilistexpand',cur:cur,height:180,items:listitems, max: 4,onChange: handleListChange}"></div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'ddd', cur:cur,items: selectitems}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
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
                  <td class="argDesc"><span>显示项数组列表</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>listApi</span></td>
                  <td class="argDesc"><span>调用服务端API (默认字段为 name, id)</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>max</span></td>
                  <td class="argDesc"><span>初始显示个数</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>all</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>height</span></td>
                  <td class="argDesc"><span>高度</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>200</span></td>
                </tr>
                 <tr>
                  <td class="argName"><span>path</span></td>
                  <td class="argDesc"><span>字段作用域</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>id</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>cache</span></td>
                  <td class="argDesc"><span>是否缓存到内容中</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>flase</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>session</span></td>
                  <td class="argDesc"><span>是否缓存到localStorage中</span></td>
                  <td class="argType"><span>boolean</span></td>
                  <td class="argDefault"><span>false</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiListExpand = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    initData: function(){
      return {
        cur: '1',
        selectitems: [
          { text: '1', value: '1' },
          { text: '2', value: '2' },
          { text: '3', value: '3' },
          { text: '4', value: '4' }
        ],
        listitems: [
          {name: '顶部导航', id: '1'},
          {name: '底部导航', id: '2'},
          {name: '魔方导航', id: '3'},
          {name: '图片轮播', id: '4'},
          {name: '图文展示', id: '5'},
          {name: '产品分类', id: '6'},
        ]
      }
    },
    handleListChange: function(model){
      console.log(model);
      this._set('cur', model.id);
    }
  });

  module.exports = UiListExpand;
});