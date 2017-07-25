'use strict';
/**
 * @description 模块功能说明
 * @class BbaseDatePicker
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseDatePicker', [], function(require, exports, module){
  var BbaseDatePicker;

  BbaseDatePicker = BbaseView.extend({
    initialize: function(){
      this._super({
        template: `
          <div class="BbaseDatePicker-wrap">
            BbaseDatePicker
          </div>
        `
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = BbaseDatePicker;
});