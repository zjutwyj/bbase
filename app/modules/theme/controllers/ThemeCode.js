'use strict';
/**
 * @description 模块功能说明
 * @class ThemeCode
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeCode', [], function(require, exports, module){
  var ThemeCode;

  ThemeCode = BbaseView.extend({
    initialize: function(){
      this._super({
        template: `
          <style>
            .ThemeCode-wrap{padding: 20px;font-size: 14px;}
          </style>
          <div class="ThemeCode-wrap">
          <div>代码：</div>
            <div>
              {{code}}
            </div>

            <div>数据：</div>
            <div>{{data}}</div>
          </div>
        `
      });
    },
    initData: function(){
      return {
        code: ''
      }
    }
  });

  module.exports = ThemeCode;
});