'use strict';
/**
 * @description 模块功能说明
 * @class DemoList
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoList', [], function(require, exports, module){
  var DemoList, template;

  template = `
    <div id="ui-nav" class="DemoList-wrap" bb-bbaseuitab="{viewId: 'uilisttab2', cur: curListType,theme:'tab-ul-line', path: 'moduleId',  direction: 'v',items: ListTypeitems,tpl: tpl, onChange: handleTabChange}">

    </div>
  `;

  DemoList = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function(){
      return {
        curListType: 'DemoListTable',
        ListTypeitems: [
          {text: '表格列表', moduleId: 'DemoListTable', oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function(){

    }
  });

  module.exports = DemoList;
});