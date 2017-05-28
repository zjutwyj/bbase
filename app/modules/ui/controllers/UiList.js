'use strict';
/**
 * @description 模块功能说明
 * @class UiList
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiList', [], function(require, exports, module){
  var UiList, template;

  template = `
     <div class="UiList-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiScrollNavTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  UiList = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        curNav: 'UiListExpand',
        navitems: [
          { text: '展开收起', moduleId: 'UiListExpand',oneRender: false }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = UiList;
});