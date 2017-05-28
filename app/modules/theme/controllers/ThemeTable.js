'use strict';
/**
 * @description 模块功能说明
 * @class ThemeTable
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeTable', [], function (require, exports, module) {
  var ThemeTable, template;

  template = `
    <div class="ThemeTable-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'themeTableTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  ThemeTable = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curNav: 'ThemeTable01',
        navitems: [
          { text: '主题样式1', moduleId: 'ThemeTable01' ,oneRender: false},
          { text: '主题样式2', moduleId: 'ThemeTable02' , oneRender: false}

        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ThemeTable;
});
