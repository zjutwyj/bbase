'use strict';
/**
 * @description 模块功能说明
 * @class ComponentNavigator
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentNavigator', [], function (require, exports, module) {
  var ComponentNavigator, template;

  template = `
    <div class="ComponentNavigator-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentNavTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentNavigator = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentNavigatorPanel',
        items: [
          { text: '导航列表', moduleId: 'ComponentNavigatorPanel' ,oneRender: false},
          { text: '导航筛选', moduleId: 'ComponentNavigatorPick' ,oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentNavigator;
});