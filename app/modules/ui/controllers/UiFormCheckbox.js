'use strict';
/**
 * @description 模块功能说明
 * @class UiFormCheckbox
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormCheckbox', [], function(require, exports, module){
  var UiFormCheckbox, template;

  template = `
    <div class="UiFormCheckbox-wrap module-wrap">
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name">bbaseuicheckbox="{viewId: 'viewId', cur: cur, items: items, onChange: handleChange}"</span>
            </div>
          </div>
          <div class="main">
             <div class="demo-item clearfix" bb-bbaseuicheckbox="{viewId:'bbaseuicheckbox',cur:cur,items:items}"></div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left" bb-bbaseuiselect="{viewId: 'ddd', cur:cur,items: items}"></div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
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
                  <td class="argName"><span>items</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>显示项数组列表</span></td>
                  <td class="argType"><span>array</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(item, init)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>tpl</span></td>
                  <td class="argDesc"><span>自定义模板</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiFormCheckbox = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'all,complete',
        items: [
          { text: '全部', value: 'all' },
          { text: '已完成', value: 'complete' },
          { text: '未完成', value: 'undo' },
          { text: '部分完成', value: 'part' }
        ]
      }
    }
  });

  module.exports = UiFormCheckbox;
});