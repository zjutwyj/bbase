'use strict';
/**
 * @description 模块功能说明
 * @class ComponentCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentCenter', [], function(require, exports, module){
  var ComponentCenter, template;

  template = `
     <div class="ComponentCenter-wrap bbase-center" >
      <div class="ComponentCenter-tag" bb-bbaseuitab="{viewId: 'uicentertab', cur: cur,tpl:tpl, theme:'tab-ul-line', path:'moduleId', items: items, onChange: handleTabChange}" ></div>
    </div>
  `;

  ComponentCenter = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentPhoto',
        items: [
          { text: '图片', moduleId: 'ComponentPhoto' ,oneRender: false},
          { text: '颜色', moduleId: 'ComponentColor' ,oneRender: false},
          { text: '音乐', moduleId: 'ComponentMusic' ,oneRender: false}
        ],
        tpl:  `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTab{{moduleId}} tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    },
    handleTabChange: function (item, init, a, b) {
      console.log(item);
    },
    afterRender: function () {

    }
  });

  module.exports = ComponentCenter;
});