'use strict';
/**
 * @description 模块功能说明
 * @class UiCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiCenter', [], function (require, exports, module) {
  var UiCenter, template;

  template = `
    <div class="UiCenter-wrap" >
      <div class="UiCenter-tag bbase-center" bb-bbaseuitab="{viewId: 'uicentertab', cur: cur,tpl:tpl, theme:'tab-ul-line', path:'moduleId', items: items, onChange: handleTabChange}" ></div>
    </div>
  `;

  UiCenter = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'UiForm',
        items: [
          { text: '表单', moduleId: 'UiForm', oneRender: false },
          { text: '拖动滚动', moduleId: 'UiScroll', oneRender: false },
          { text: '列表', moduleId: 'UiList', oneRender: false }
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

  module.exports = UiCenter;
});
