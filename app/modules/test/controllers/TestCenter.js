'use strict';
/**
 * @description 模块功能说明
 * @class TestCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('TestCenter', [], function(require, exports, module){
 var TestCenter, template;

  template = `
     <div class="ComponentCenter-wrap bbase-center" >
      <div class="ComponentCenter-tag" bb-bbaseuitab="{viewId: 'uicentertab', cur: cur,tpl:tpl, theme:'tab-ul-line', path:'moduleId', items: items, onChange: handleTabChange}" ></div>
    </div>
  `;

  TestCenter = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'TestUnit1',
        items: [
          { text: 'TestUnit1', moduleId: 'TestUnit1' ,oneRender: false}
        ],
        tpl:  `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabPlus dataTab{{moduleId}} tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function (item, init, a, b) {
      console.log(item);
    },
    afterRender: function () {

    }
  });

  module.exports = TestCenter;
});