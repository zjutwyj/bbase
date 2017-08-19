'use strict';
/**
 * @description 模块功能说明
 * @class ComponentNews
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentNews', [], function (require, exports, module) {
  var ComponentNews, template;

  template = `
    <div class="ComponentNews-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentNavTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentNews = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentNewsPick',
        items: [
          { text: '新闻选择(弹)', moduleId: 'ComponentNewsPick',oneRender: false },
          { text: '新闻分类(弹)', moduleId: 'ComponentNewsCatePick',oneRender: false }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentNews;
});