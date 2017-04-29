'use strict';
/**
 * @description 模块功能说明
 * @class DemoCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoCenter', [], function (require, exports, module) {
  var DemoCenter, template;

  template = `
    <div class="DemoCenter-wrap bbase-center">
      </style>
      <div class="DemoCenter-tag" bb-bbaseuitab="{viewId: 'uicentertab', cur: cur,tpl:tpl, theme:'tab-ul-line', path:'moduleId', items: items, onChange: handleTabChange}" ></div>
    </div>
  `;

  DemoCenter = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'DemoList',
        items: [
          { text: '列表', moduleId: 'DemoList' ,oneRender: false},
          { text: '表格', moduleId: 'DemoTable' ,oneRender: false}
        ],
        tpl:  `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTab{{moduleId}} tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function (item, init, a, b) {
      console.log(item);
    },
    afterRender: function () {

    }
  });

  module.exports = DemoCenter;
});
