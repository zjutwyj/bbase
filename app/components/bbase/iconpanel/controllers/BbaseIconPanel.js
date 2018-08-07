'use strict';
/**
 * @description 模块功能说明
 * @class BbaseIconPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseIconPanel', [], function (require, exports, module) {
  var BbaseIconPanel;

  BbaseIconPanel = BbaseView.extend({
    initialize: function () {
      var size = typeof this.options.size === 'undefined' ? 30 : this.options.size;
      var width = typeof this.options.width === 'undefined' ? 240 : this.options.width;
      var lineHeight = width*0.6;
      this._super({
        template: `
          <div class="BbaseIconPanel-wrap bbase-component-iconpanel" style="width: ${width}px;">
            <div class="c4-preview-wrapper" data-hook="preview-content" style="width:100%" aria-hidden="false">
              <i bb-watch="font:class,cur:class,cur:html,iconColorState:style,iconColor:style" class="{{font}} {{cur}}" style="position: absolute; left: 0; top: 0;line-height: ${lineHeight}px; width: 100%; text-align: center;font-size:${size}px; {{#If iconColorState==='d'}}{{else}}color: {{iconColor}};{{/If}}">{{#If cur==='iconDefault'}}默认{{/If}}</i>
              <!---->
              <div class="c4-overlay preview" aria-hidden="true" style="">
                <div class="c4-overlay-default-buttons">
                  <!---->
                  <button class="p9c-primary cc-x-height" data-hook="replace-menu" bb-bbasecomponenticonpick="{viewId:'bbasecomponenticonpickpanel',cur:cur, font: font,iconColor: iconColor,iconColorState: iconColorState,iconType: iconType,iconTypeItems: iconTypeItems,items: items, showTypeSelect: showTypeSelect,onChange: handleIconPickChange}"><span class="cc-x-height font-t2 photo-panel-replace-btn">替换</span></button>
                  <!---->
                </div>
              </div>
            </div>
          </div>
            `
      });
    },
    initData: function () {
      return {
        cur: this._options.icon || 'iconDefault',
        font: this._options.font || 'bbasefont',
        iconColor: this._options.iconColor || '#ffffff',
        iconColorState: this._options.iconColorState || 'd',
        iconType: this._options.iconType,
        iconTypeItems: this._options.iconTypeItems,
        showTypeSelect: this._options.showTypeSelect,
        items: this._options.items
      }
    },
    handleIconPickChange: function (item) {
      var result = {
        icon: item.icon,
        font: item.font,
        iconColor: item.iconColor,
        iconColorState: item.iconColorState,
        iconType: item.iconType,
        content: item.content
      }
      this._set(result);
      this._options.onChange && this._options.onChange(result);
    },
    setValue: function (val) {
      this._set('cur', val);
    }
  });

  module.exports = BbaseIconPanel;
});
