'use strict';
/**
 * @description 模块功能说明
 * @class ComponentIcon
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentIcon', [], function (require, exports, module) {
  var ComponentIcon, template;

  template = `
    <div class="ComponentIcon-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentIconTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentIcon = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentIconPanel',
        items: [
          { text: '图标选择(弹)', moduleId: 'ComponentIconPick' ,oneRender: false},
          { text: '图标面板', moduleId: 'ComponentIconPanel' ,oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentIcon;
});