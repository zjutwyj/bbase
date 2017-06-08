'use strict';
/**
 * @description 模块功能说明
 * @class ThemeFormButton01
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeFormButton01', [], function(require, exports, module){
  var ThemeFormButton01;

  ThemeFormButton01 = BbaseDetail.extend({
    initialize: function(){
      var theme = BbaseEst.nextUid('AdminLayoutDetail');
      this._super({
        template: `
          <div class="${theme}-wrap" style="width: 400px;height: 300px;">
            <style>
              .${theme}-wrap{}
              .${theme}-wrap .mobiSettingBtns {text-align: center; position: absolute; width: 94%; bottom: 1px; background: #fff; height: 44px; line-height: 44px; z-index: 1999; }
              .${theme}-wrap .faiButton {display: inline-block; font-family: 微软雅黑, "microsoft yahei", 宋体, 新宋体, sans-serif; cursor: pointer; text-align: center; font-size: 12px; height: 24px; line-height: 22px; color: rgb(102, 102, 102); border-radius: 2px; outline: 0px; text-decoration: none; margin: 0px 2px 0px 0px; border-width: 1px; border-style: solid; border-color: rgb(143, 143, 143); border-image: initial; background: rgb(245, 245, 245); padding: 0px 10px !important; }
              .${theme}-wrap .mobiSettingBtns .abutton {margin: 0 10px; height: 25px; padding: 0 3px; cursor: pointer; }
              .${theme}-wrap input.saveButton {border: 1px solid ${CONST.MAIN_COLOR}; background: ${CONST.MAIN_COLOR}; color: #fff; }
              .${theme}-wrap input.saveButton:hover {background-color: ${CONST.LIGHT_COLOR}; }
              .${theme}-wrap .faiButton:hover {background: #fff; }

            </style>

             <div class="mobiSettingBtns">
              <input id="submit" type="button" value="确定" class="faiButton saveButton sh">
              <input bb-click="_close" type="button" value="取消" class="faiButton cancelButton faiButton-hover">
            </div>
          </div>
        `,
        model: BbaseModel.extend({

        })
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = ThemeFormButton01;
});