'use strict';
/**
 * @description 模块功能说明
 * @class UiItemCheck
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiItemCheck', [], function (require, exports, module) {
  var UiItemCheck, template;

  template = `
    <div class="UiItemCheck-wrap">
     <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiFormNavTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  UiItemCheck = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        curNav: 'UiItemCheckTab',
        navitems: [
          { text: '样式一', moduleId: 'UiItemCheckTab' },
          { text: '样式二', moduleId: 'UiItemCheckBtn' }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = UiItemCheck;
});
