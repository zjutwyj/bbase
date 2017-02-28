'use strict';
/**
 * @description 模块功能说明
 * @class UiDirective
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiDirective', [], function(require, exports, module){
  var UiDirective, template;

  template = `
    <div class="UiDirective-wrap">
      UiDirective
    </div>
  `;

  UiDirective = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = UiDirective;
});