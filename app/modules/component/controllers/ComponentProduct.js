'use strict';
/**
 * @description 模块功能说明
 * @class ComponentProduct
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentProduct', [], function (require, exports, module) {
  var ComponentProduct, template;

  template = `
    <div class="ComponentProduct-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentNavTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentProduct = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentProductPick',
        items: [
          { text: '产品选择(弹)', moduleId: 'ComponentProductPick',oneRender: false }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentProduct;
});