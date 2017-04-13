'use strict';
/**
 * @description 模块功能说明
 * @class UiForm
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiForm', [], function (require, exports, module) {
  var UiForm, template;

  template = `
    <div class="UiForm-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiFormNavTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  UiForm = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curNav: 'UiFormRadio',
        navitems: [
          { text: '单选', moduleId: 'UiFormRadio' },
          { text: '多选', moduleId: 'UiFormCheckbox' },
          { text: '下拉菜单', moduleId: 'UiFormSelect' },
          { text: '滑动条', moduleId: 'UiFormSlider' },
          { text: '下拉框', moduleId: 'UiFormDropDown' },
          { text: '组合切换', moduleId: 'UiFormGroup' },
          { text: '选项卡', moduleId: 'UiFormTab' ,oneRender: false},
          { text: '编辑器', moduleId: 'UiFormTextEditor' }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = UiForm;
});
