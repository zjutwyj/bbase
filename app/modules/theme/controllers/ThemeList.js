'use strict';
/**
 * @description 模块功能说明
 * @class ThemeList
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeList', [], function (require, exports, module) {
  var ThemeList, template;

  template = `
    <div class="ThemeList-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiFormNavTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  ThemeList = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curNav: 'ThemeListRadio',
        navitems: [
          { text: '单选', moduleId: 'ThemeListRadio' },
          { text: '多选', moduleId: 'ThemeListCheckbox' },
          { text: '下拉菜单', moduleId: 'ThemeListSelect' },
          { text: '滑动条', moduleId: 'ThemeListSlider' },
          { text: '下拉框', moduleId: 'ThemeListDropDown' },
          { text: '组合切换', moduleId: 'ThemeListGroup' },
          { text: '选项卡', moduleId: 'ThemeListTab' ,oneRender: false},
          { text: '对话框', moduleId: 'ThemeListDialog'},
          { text: '编辑器', moduleId: 'ThemeListTextEditor' }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ThemeList;
});
