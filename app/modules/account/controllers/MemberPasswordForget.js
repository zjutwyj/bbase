'use strict';
/**
 * @description 模块功能说明
 * @class MemberPasswordForget
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('MemberPasswordForget', [], function(require, exports, module){
  var MemberPasswordForget, template;

  template = `
    <div class="MemberPasswordForget-wrap">
      content
    </div>
  `;

  MemberPasswordForget = BaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = MemberPasswordForget;
});