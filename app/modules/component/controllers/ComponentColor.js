'use strict';
/**
 * @description 模块功能说明
 * @class ComponentColor
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentColor', [], function (require, exports, module) {
  var ComponentColor, template;

  template = `
    <div class="ComponentColor-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentColorTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentColor = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentColorPick',
        items: [
          { text: '颜色选择', moduleId: 'ComponentColorPick' }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentColor;
});