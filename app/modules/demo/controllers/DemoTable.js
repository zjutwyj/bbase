'use strict';
/**
 * @description 模块功能说明
 * @class DemoTable
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoTable', [], function(require, exports, module){
  var DemoTable, template;

  template = `
    <div id="ui-nav" class="DemoTable-wrap" bb-bbaseuitab="{viewId: 'uilisttab2', cur: curListType,theme:'tab-ul-line', path: 'moduleId',  direction: 'v',items: ListTypeitems,tpl: tpl, onChange: handleTabChange}">

    </div>
  `;

  DemoTable = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function(){
      return {
        curListType: 'DemoTableDynamic',
        ListTypeitems: [
          {text: '动态表格列', moduleId: 'DemoTableDynamic', oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function(){

    }
  });

  module.exports = DemoTable;
});