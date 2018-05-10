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
        curNav: 'UiFormDatePicker',
        navitems: [
          { text: '单选', moduleId: 'UiFormRadio' ,oneRender: false},
          { text: '多选', moduleId: 'UiFormCheckbox' ,oneRender: false},
          { text: '下拉菜单', moduleId: 'UiFormSelect' ,oneRender: false},
          { text: '滑动条', moduleId: 'UiFormSlider' ,oneRender: false},
          { text: '下拉框', moduleId: 'UiFormDropDown' ,oneRender: false},
          { text: '组合切换', moduleId: 'UiFormGroup' ,oneRender: false},
          { text: '选项卡', moduleId: 'UiFormTab' ,oneRender: false},
          { text: '对话框', moduleId: 'UiFormDialog',oneRender: false},
          { text: '提示框', moduleId: 'UiFormTip',oneRender: false},
          { text: '复制', moduleId: 'UiFormCopy',oneRender: false},
          { text: '编辑器', moduleId: 'UiFormTextEditor',oneRender: false },
          { text: '日期选择器', moduleId: 'UiFormDatePicker',oneRender: false },
          { text: '时间选择器', moduleId: 'UiFormTimePicker',oneRender: false }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = UiForm;
});
