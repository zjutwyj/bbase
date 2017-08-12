'use strict';
/**
 * @description 模块功能说明
 * @class UiFormCopy
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormCopy', [], function(require, exports, module){
  var UiFormCopy, template;

  template = `
    <div class="UiFormCopy-wrap module-wrap">
        <style>
          .tipitem{padding: 0px;margin: 30px;cursor:pointer;}
        </style>
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name"></span>
            </div>
          </div>
          <div class="main">
             <div class="tipitem left" bb-bbaseuicopy="{viewId: 'copy', cur: cur,success: success, error:error}">点我复制</div>

          </div>
          <div class="footer">
          <input type="text" bb-model="cur" /> <span bb-watch="cur:html">当前值：{{cur}}</span><span bb-watch="text:html">已复制：{{text}}</span>
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
                  <td class="argDesc"><span>视图ID</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>bbaseuicopy</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>id</span></td>
                  <td class="argDesc"><span>对象引用</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>cur</span></td>
                  <td class="argDesc"><span>复制的内容</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>success</span></td>
                  <td class="argDesc"><span>复制成功回调</span></td>
                  <td class="argType"><span>function(e)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>error</span></td>
                  <td class="argDesc"><span>复制失败回调</span></td>
                  <td class="argType"><span>function(e)</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiFormCopy = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template,
        toolTip: true
      });
    },
    initData: function () {
      return {
        cur: 'abcdefg',
        text: ''
      }
    },
    success(e){
      this._set('text', e.text);
    },
    error(e){
      this._set('text', e.text);
    }
  });

  module.exports = UiFormCopy;
});