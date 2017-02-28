'use strict';
/**
 * @description 模块功能说明
 * @class ApiCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ApiCenter', [], function(require, exports, module){
  var ApiCenter, template;

  template = `
    <div class="ApiCenter-wrap">
      ApiCenter
    </div>
  `;

  ApiCenter = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = ApiCenter;
});