'use strict';
/**
 * @description 模块功能说明
 * @class ComponentMusic
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentMusic', [], function (require, exports, module) {
  var ComponentMusic, template;

  template = `
    <div class="ComponentMusic-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentNavTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentMusic = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentMusicPick',
        items: [
          { text: '音乐选择(弹)', moduleId: 'ComponentMusicPick' ,oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentMusic;
});