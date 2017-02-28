'use strict';
/**
 * @description 模块功能说明
 * @class UiDropDown
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiDropDown', [], function(require, exports, module){
  var UiDropDown, template;

  template = `
    <div class="UiDropDown-wrap">
      UiDropDown
    </div>
  `;

  UiDropDown = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = UiDropDown;
});