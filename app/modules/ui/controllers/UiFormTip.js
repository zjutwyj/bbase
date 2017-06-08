'use strict';
/**
 * @description 模块功能说明
 * @class UiFormTip
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormTip', [], function(require, exports, module){
  var UiFormTip, template;

  template = `
    <div class="UiFormTip-wrap module-wrap">
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
             <div class="tipitem left tool-tip" data-title="提示内容" data-align="top">上边提示</div>
             <div class="tipitem left tool-tip" data-title="提示内容" data-align="right">右边提示</div>
             <div class="tipitem left tool-tip" data-title="提示内容" data-align="bottom">下边提示</div>
             <div class="tipitem left tool-tip" data-title="提示内容" data-align="left">左边提示</div>
          </div>
          <div class="footer">

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
                  <td class="argName"><span>tool-tip</span><span class="red">&nbsp;(必填)</span></td>
                  <td class="argDesc"><span>class 选择符</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>tool-tip</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>data-title</span></td>
                  <td class="argDesc"><span>提示内容</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>-</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>data-align</span></td>
                  <td class="argDesc"><span>显示方向(top,right,buttom,left)</span></td>
                  <td class="argType"><span>string</span></td>
                  <td class="argDefault"><span>up</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>data-offset</span></td>
                  <td class="argDesc"><span>边距</span></td>
                  <td class="argType"><span>number</span></td>
                  <td class="argDefault"><span>1</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiFormTip = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template,
        toolTip: true
      });
    },
    initData: function () {
      return {
      }
    }
  });

  module.exports = UiFormTip;
});