'use strict';
/**
 * @description 模块功能说明
 * @class UiMore
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiMore', [], function(require, exports, module){
  var UiMore, template;

  template = `
     <div class="UiMore-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiScrollNavTab', cur: curNav,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: navitems, direction: 'v'}"></div>
    </div>
  `;

  UiMore = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    initData: function () {
      return {
        curNav: 'UiNewcomerTip',
        navitems: [
          { text: '新手提示', moduleId: 'UiNewcomerTip',oneRender: false }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = UiMore;
});