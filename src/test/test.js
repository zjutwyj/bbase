var model = {
  "AwardPlugin": "modules/website/plugin/lottery/controllers/AwardPlugin.js",
  "LotteryPlugin": "modules/website/plugin/lottery/controllers/LotteryPlugin.js",
  "LotteryPluginEdit": "modules/website/plugin/lottery/controllers/LotteryPluginEdit.js",
  "SelectPlugin": "modules/website/plugin/form/controllers/SelectPlugin.js",
  "SelectPluginEdit": "modules/website/plugin/form/controllers/SelectPluginEdit.js",
  "DateTimePlugin": "modules/website/plugin/form/controllers/DateTimePlugin.js",
  "DateTimePluginEdit": "modules/website/plugin/form/controllers/DateTimePluginEdit.js",
  "OneSelectPlugin": "modules/website/plugin/form/controllers/OneSelectPlugin.js",
  "OneSelectPluginEdit": "modules/website/plugin/form/controllers/OneSelectPluginEdit.js",
  "MultiSelectPlugin": "modules/website/plugin/form/controllers/MultiSelectPlugin.js",
  "MultiSelectPluginEdit": "modules/website/plugin/form/controllers/MultiSelectPluginEdit.js",
  "MapPlugin": "modules/website/plugin/map/controllers/MapPlugin.js",
  "MessageListPlugin": "modules/website/plugin/message_list/controllers/MessageListPlugin.js",
  "ButtonMessagePlugin": "modules/website/plugin/message_list/controllers/ButtonMessagePlugin.js",
  "InnerLinkPlugin": "modules/website/plugin/link/controllers/InnerLinkPlugin.js",
  "PayProductPlugin": "modules/website/plugin/pay/controllers/PayProductPlugin.js",
  "SoundEffectPlugin": "modules/website/plugin/music/controllers/SoundEffectPlugin.js",
  "LotteryResultPlugin": "modules/website/plugin/lottery/controllers/LotteryResultPlugin.js",
  "WcdReplacePlugin": "modules/website/plugin/wcd/controllers/WcdReplacePlugin.js",
  "WcdCopy": "modules/website/plugin/copy/controllers/WcdCopy.js",
  "TextSlider": "vendor/textSlider/textSlider.js",
  "Bbass": "vendor/bbass/bbass.min.js"
}
'use strict';
/**
 * @description 模块功能说明
 * @class ModuleName
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ModuleName', [], function(require, exports, module){
  var ModuleName, template;

  template = `
    <div class="ModuleName-wrap">
      content
    </div>
  `;

  ModuleName = BaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    }
  });

  module.exports = ModuleName;
});