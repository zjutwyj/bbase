'use strict';
/**
 * @description 模块功能说明
 * @class ThemeTree
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeTree', [], function (require, exports, module) {
  var ThemeTree, template;

  template = `
    <div class="ThemeTree-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'themeTreeTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  ThemeTree = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curNav: 'ThemeTree01',
        navitems: [
          { text: '主题样式1', moduleId: 'ThemeTree01' ,oneRender:false}

        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ThemeTree;
});
