'use strict';
/**
 * @description 模块功能说明
 * @class ThemeForm
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeForm', [], function (require, exports, module) {
  var ThemeForm, template;

  template = `
    <div class="ThemeForm-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'themeListTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  ThemeForm = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curNav: 'ThemeFormButton01',
        navitems: [
          { text: '按钮样式1', moduleId: 'ThemeFormButton01' },
          { text: '文本域样式1', moduleId: 'ThemeFormInput01' }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ThemeForm;
});
