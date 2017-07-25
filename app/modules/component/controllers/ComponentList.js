'use strict';
/**
 * @description 模块功能说明
 * @class ComponentList
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentList', [], function (require, exports, module) {
  var ComponentList, template;

  template = `
    <div class="ComponentList-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentNavTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentList = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentListPick',
        items: [
          { text: '部件选择(弹)', moduleId: 'ComponentListPick' ,oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentList;
});