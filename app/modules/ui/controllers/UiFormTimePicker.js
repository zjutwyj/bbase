'use strict';
/**
 * @description 模块功能说明
 * @class UiFormTimePicker
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiFormTimePicker', [], function(require, exports, module){
  var UiFormTimePicker, template;

  template = `
    <div class="UiFormTimePicker-wrap module-wrap">
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
            <input type="text" class="input" value="{{time}}" bb-bbaseuitimepicker="{viewId: 'timepicker',theme:'01',mainColor: '#f52905'}" bb-model="time" placeholder="请选择时间" />
          </div>
          <div class="footer">
          时间：<span bb-watch="time:html">{{time}}</span>
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
          <div class="main" style="padding: 20px;height:300px;">
            <input class="time" type="text" bb-bbaseuitimepicker="{viewId: 'timepicker02',theme:'02',mainColor: '#f52905'}" value="{{time}}" bb-model="time"/>

          </div>
          <div class="footer">
          时间：<span bb-watch="time:html">{{time}}</span>
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
                  <td class="argDefault"><span>bbaseuitimepicker</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>theme</span></td>
                  <td class="argDesc"><span>样式：01/02</span></td>
                  <td class="argType"><span>String</span></td>
                  <td class="argDefault"><span>01</span></td>
                </tr>
                <tr>
                  <td class="argName"><span>mainColor</span></td>
                  <td class="argDesc"><span>主题颜色</span></td>
                  <td class="argType"><span>String</span></td>
                  <td class="argDefault"><span>#0797FF</span></td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `;

  UiFormTimePicker = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template,
        toolTip: true
      });
    },
    initData: function () {
      return {
        time: '12:00'
      }
    },
    viewCode(selector, evt){
      window.viewCode.call(this, selector, JSON.stringify(this.model.toJSON()), evt);
    }
  });

  module.exports = UiFormTimePicker;
});