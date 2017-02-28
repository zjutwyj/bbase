'use strict';
/**
 * @description 模块功能说明
 * @class UiForm
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('UiForm', [], function(require, exports, module){
  var UiForm, template;

  template = `
    <div class="UiForm-wrap">
      UiForm
    </div>
  `;

  UiForm = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = UiForm;
});