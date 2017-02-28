'use strict';
/**
 * @description 模块功能说明
 * @class TeachCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('TeachCenter', [], function(require, exports, module){
  var TeachCenter, template;

  template = `
    <div class="TeachCenter-wrap">
      TeachCenter
    </div>
  `;

  TeachCenter = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = TeachCenter;
});