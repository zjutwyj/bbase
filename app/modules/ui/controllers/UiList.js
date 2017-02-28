'use strict';
/**
 * @description 模块功能说明
 * @class UiList
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiList', [], function(require, exports, module){
  var UiList, template;

  template = `
    <div class="UiList-wrap" bb-bbaseuitab="{viewId: 'uilisttab2', cur: curListType,theme:'tab-ul-btn', path: 'moduleId', items: ListTypeitems, onChange: handleTabChange}">

    </div>
  `;

  UiList = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function(){
      return {
        curListType: 'UiList01',
        ListTypeitems: [
          {text: '类型一', moduleId: 'UiList01', oneRender: false}
        ]
      }
    },
    handleTabChange: function(){

    }
  });

  module.exports = UiList;
});