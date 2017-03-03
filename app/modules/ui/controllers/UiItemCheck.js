'use strict';
/**
 * @description 模块功能说明
 * @class UiItemCheck
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiItemCheck', [], function (require, exports, module) {
  var UiItemCheck, template;

  template = `
    <div class="UiItemCheck-wrap" style="padding: 5px; overflow:hidden;">
      <style>
        .demo-item{padding:5px;}
      </style>
      <div class="demo-item result clearfix" bb-watch="curText:html">您的选择：text: {{curText}}, value:{{curValue}}</div>
      <br>
      <br>
      <div class="demo-item item-type-title clearfix">样式一：</div>
      <div class="demo-item clearfix" bb-bbaseuiitemtab="{viewId:'itemcheck',cur:cur,items:items, onChange: handleChange }"></div>
      <div class="demo-item item-directive">指令：bb-bbaseuiitemtab="{viewId:'itemcheck',cur:cur,items:items, onChange: handleChange }"</div>
      <br>
      <br>
      <div class="demo-item item-type-title clearfix">样式二：</div>
      <div class="demo-item clearfix" bb-bbaseuiitembtn="{viewId:'itemchecknormal',cur:curNormal,items:itemsNormal, onChange: handleNormalChange }"></div>
      <div class="demo-item item-directive">指令：bb-bbaseuiitembtn="{viewId:'itemchecknormal',cur:curNormal,items:itemsNormal, onChange: handleNormalChange }"</div>
    </div>
  `;

  var items = [
    { text: '全部', value: 'all' },
    { text: '已完成', value: 'complete' },
    { text: '未完成', value: 'uncomplete' },
    { text: '部分完成', value: 'partcomplete' }
  ];

  UiItemCheck = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curText: '',
        curValue: '',
        cur: 'all',
        items: items,
        curNormal: 'all',
        itemsNormal: items
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
    handleNormalChange: function (item, init) {
      this.handleChange.call(this, item, init);
    }
  });

  module.exports = UiItemCheck;
});
