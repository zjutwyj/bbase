'use strict';
/**
 * @description 模块功能说明
 * @class BbaseColorPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseColorPanel', [], function(require, exports, module){
  var BbaseColorPanel, template;

  template = `
    <div class="BbaseColorPanel-wrap">
      BbaseColorPanel
    </div>
  `;

  BbaseColorPanel = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = BbaseColorPanel;
});