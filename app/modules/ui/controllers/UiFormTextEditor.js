'use strict';
/**
 * @description 模块功能说明
 * @class UiFormTextEditor
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormTextEditor', [], function (require, exports, module) {
  var UiFormTextEditor, template;

  template = `
    <div class="UiFormTextEditor-wrap module-wrap">
      <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main">
            <div class="demo-item clearfix" bb-bbaseuitexteditor="{viewId: 'viewId', onChange: handleChange}"></div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">输出结果：{{cur}}; 动态赋值：</div><div class="left"><input type="text" class="text" bb-model="cur:keyup" value="{{cur}}" /></div>
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
                  <td class="argName"><span>onChange</span></td>
                  <td class="argDesc"><span>回调函数</span></td>
                  <td class="argType"><span>function(text)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  `;


  UiFormTextEditor = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        cur: 'all',
         items: [
          { text: '全部', value: 'all' },
          { text: '已完成', value: 'complete' },
          { text: '未完成', value: 'undo' },
          { text: '部分完成', value: 'part' }
        ]
      }
    },
    handleChange: function(text){
      this._set('cur', text);
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = UiFormTextEditor;
});
