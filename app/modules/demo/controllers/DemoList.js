'use strict';
/**
 * @description 模块功能说明
 * @class DemoList
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoList', [], function(require, exports, module){
  var DemoList, template;

  template = `
    <div class="DemoList-wrap" bb-bbaseuitab="{viewId: 'uilisttab2', cur: curListType,theme:'tab-ul-btn', path: 'moduleId', items: ListTypeitems, onChange: handleTabChange}">

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
        curListType: 'DemoList01',
        ListTypeitems: [
          {text: '类型一', moduleId: 'DemoList01', oneRender: false}
        ]
      }
    },
    handleTabChange: function(){

    }
  });

  module.exports = DemoList;
});