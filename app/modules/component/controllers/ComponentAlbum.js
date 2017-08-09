'use strict';
/**
 * @description 模块功能说明
 * @class ComponentAlbum
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentAlbum', [], function (require, exports, module) {
  var ComponentAlbum, template;

  template = `
    <div class="ComponentAlbum-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentAlbumTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentAlbum = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentAlbumPick',
        items: [
          { text: '相册选择(弹)', moduleId: 'ComponentAlbumPick' ,oneRender: false},
          { text: '相册选择', moduleId: 'ComponentAlbumPanel' ,oneRender: false}
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentAlbum;
});