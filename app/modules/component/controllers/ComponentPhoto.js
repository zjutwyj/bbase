'use strict';
/**
 * @description 模块功能说明
 * @class ComponentPhoto
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ComponentPhoto', [], function (require, exports, module) {
  var ComponentPhoto, template;

  template = `
    <div class="ComponentPhoto-wrap">
      <div id="ui-nav" bb-bbaseuitab="{viewId: 'uiComponentNavTab', cur: cur,theme:'tab-ul-line',path: 'moduleId', tpl: tpl, items: items, direction: 'v'}"></div>
    </div>
  `;

  ComponentPhoto = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    init: function () {
      return {
        cur: 'ComponentPhotoPick',
        items: [
          { text: '图片选择(弹)', moduleId: 'ComponentPhotoPick' },
          { text: '图片裁切(弹)', moduleId: 'ComponentPhotoCrop' }
        ],
        tpl: `
          <a href="javacript:;" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-{{dx}}"><div class="dataTabNav tabImgComm"></div><span>{{text}}</span></a>
        `
      }
    }
  });

  module.exports = ComponentPhoto;
});