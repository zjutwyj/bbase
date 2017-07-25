'use strict';
/**
 * @description 模块功能说明
 * @class ThemeCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeCenter', [], function (require, exports, module) {
  var ThemeCenter, template;

  template = `
    <div class="ThemeCenter-wrap" >
      <div class="ThemeCenter-tag bbase-center" bb-bbaseuitab="{viewId: 'uicentertab', cur: cur,tpl:tpl, theme:'tab-ul-line', path:'moduleId', items: items, onChange: handleTabChange}" ></div>
    </div>
  `;

  ThemeCenter = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ThemeTable',
        items: [
          { text: '表格', moduleId: 'ThemeTable', oneRender: false },
          { text: '表单', moduleId: 'ThemeForm', oneRender: false },
          { text: '列表', moduleId: 'ThemeList', oneRender: false },
          { text: '树', moduleId: 'ThemeTree', oneRender: false }

        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabPlus dataTab{{moduleId}} tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function (item, init, a, b) {
      console.log(item);
    },
    afterRender: function () {

    }
  });

  module.exports = ThemeCenter;
});
