'use strict';
/**
 * @description 模块功能说明
 * @class UiFormDatePicker
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormDatePicker', [], function(require, exports, module) {
  var UiFormDatePicker, template;

  template = `
    <div class="UiFormDatePicker-wrap module-wrap">
        <style>
          .tipitem{padding: 0px;margin: 30px;cursor:pointer;}
        </style>
        <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name pointer" id="viewCode01" bb-click="viewCode('viewCode01')">点击查看代码</span>
            </div>
          </div>
          <div class="main" style="padding: 20px;height:200px;">
              <input type="text" class="input" value="{{date}}" data-default-date="{{date}}" bb-bbaseuidatepicker="{viewId: 'datepicker', cur: date, theme:'01'}" placeholder="请选择日期"/>
          </div>
          <div class="footer">
          日期：<span bb-watch="date:html">{{date}}</span>
          </div>
        </div>
      </div>
      <div class="formPanel form-demo">
        <div class="anything">
          <div class="header">
            <div class="formIdArea">
              <span class="name pointer" id="viewCode02" bb-click="viewCode('viewCode02')">点击查看代码</span>
            </div>
          </div>
          <div class="main" style="padding: 20px;height:200px;">
            <input type="text" class="input" bb-bbaseuidatepicker="{viewId: 'datepicker02', cur: date, theme:'02'}" data-large-default="true" data-large-mode="true" data-translate-mode="true" data-auto-lang="true" data-default-date="{{date}}" readonly="" placeholder="请选择日期"  data-lang="zh" data-format="Y-m-d" data-max-year="2030">
          </div>
          <div class="footer">
          日期：<span bb-watch="date:html">{{date}}</span>
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
                  <td class="argDefault"><span>bbaseuidatepicker</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>theme</span></td>
                  <td class="argDesc"><span>样式：01/02</span></td>
                  <td class="argType"><span>String</span></td>
                  <td class="argDefault"><span>01</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiFormDatePicker = BbaseView.extend({
    initialize: function() {
      this._super({
        template: template,
        toolTip: true
      });
    },
    initData: function() {
      return {
        date: '2018-02-11'
      }
    },
    handleDateChange(value) {
      this._set('date', value);
    },
    handleTimeChange(value) {
      this._set('time', value);
    },
    viewCode(selector, evt) {
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = UiFormDatePicker;
});