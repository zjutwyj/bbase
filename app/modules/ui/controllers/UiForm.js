'use strict';
/**
 * @description 模块功能说明
 * @class UiForm
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiForm', [], function (require, exports, module) {
  var UiForm, template;

  template = `
    <div class="UiForm-wrap">
      <style>
        .demo-item{padding:5px;}
      </style>
      <div class="demo-item result clearfix" >您的选择：<br>text: <span bb-watch="curText:html">{{curText}}</span>, <br>value:<span bb-watch="curValue:html">{{curValue}}</span></div>
      <br>
      <br>
      <div class="demo-item item-type-title clearfix">样式一：</div>
      <div class="demo-item clearfix" bb-bbaseuiradio="{viewId:'bbaseuiradio',cur:curRidao,items:items, onChange: handleChange }"></div>
      <div class="demo-item item-directive">指令：bb- bbaseuiradio="{viewId:'bbaseuiradio',cur:cur,items:items, onChange: handleChange }"</div>
      <br>
      <br>
      <div class="demo-item item-type-title clearfix">样式二：</div>
      <div class="demo-item clearfix" bb-bbaseuicheckbox="{viewId:'bbaseuicheckbox',cur:curCheckbox,items:items, onChange: handleCheckboxChange }"></div>
      <div class="demo-item item-directive">指令：bb- bbaseuicheckbox="{viewId:'bbaseuicheckbox',cur:cur,items:items, onChange: handleCheckboxChange }"</div>
    </div>
  `;
  var items = [
    { text: '全部', value: 'all' },
    { text: '已完成', value: 'complete' },
    { text: '未完成', value: 'undo' },
    { text: '部分完成', value: 'part' }
  ];

  UiForm = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curRidao: 'all',
        curCheckbox: 'all',
        curText: '',
        curValue: '',
        items: items
      }
    },
    handleChange: function (item, init) {
      if (!init) {
        this._set({
          curText: item.text,
          curValue: item.value
        });
      }
    },
    handleCheckboxChange: function (item, init, events, val) {
      if (!init) {
        this._set({
          curText: item.text,
          curValue: val
        });
      }
    }
  });

  module.exports = UiForm;
});
