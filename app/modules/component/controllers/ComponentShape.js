'use strict';
/**
 * @description 模块功能说明
 * @class ComponentShape
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentShape', [], function (require, exports, module) {
  var ComponentShape, template;

  template = `
    <div class="ComponentShape-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentShapeTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentShape = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentShapePick',
        items: [
          { text: '形状选择(弹)', moduleId: 'ComponentShapePick',oneRender: false },
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentShape;
});