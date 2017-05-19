'use strict';
/**
 * @description 模块功能说明
 * @class ThemeFormInput01
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeFormInput01', [], function(require, exports, module){
  var ThemeFormInput01;

  ThemeFormInput01 = BbaseView.extend({
    initialize: function(){
      var theme = BbaseEst.nextUid('ThemeFormInput01');
      this._super({
        template: `
          <div class="${theme}-wrap">
            <style>
              .${theme}-wrap{padding: 20px;}
              .${theme}-wrap .group-form{padding: 5px 0px;}
              .${theme}-wrap .group-label{font-size:14px;display: inline-block; width: 80px; height: 24px; line-height: 24px;}
              .${theme}-wrap .group-controls{display: inline-block; width:auto; height: 24px; line-height: 24px; }
              .${theme}-wrap .group-controls input.group-input,.${theme}-wrap .group-controls input.group-textarea{border: 1px solid #dfdfdf; height: 24px; line-height: 24px;text-indent: 5px;}
              .${theme}-wrap .group-controls input.group-input:focus,.${theme}-wrap .group-controls input.group-textarea:focus{border: 1px solid #FF5241;}
              .${theme}-wrap .group-controls textarea.group-textarea{height: auto;}
            </style>

            <!---->
              <div class="group-form">
                <label for="" class="group-label">分类名称:</label>
                <div class="group-controls">
                    <input type="text" class="group-input"/>
                </div>
              </div>
            <!---->
          </div>
        `
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = ThemeFormInput01;
});