'use strict';
/**
 * @description 模块功能说明
 * @class UiScroll
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiScroll', [], function(require, exports, module){
  var UiScroll, template;

  template = `
     <div class="UiScroll-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiScrollNavTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  UiScroll = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        curNav: 'UiScrollbar',
        navitems: [
          { text: '滚动条', moduleId: 'UiScrollbar',oneRender: false },
          { text: '拖动排序', moduleId: 'UiSortable' ,oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = UiScroll;
});