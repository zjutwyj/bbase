'use strict';
/**
 * @description 模块功能说明
 * @class BbaseIconPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseIconPick', [], function (require, exports, module) {
  var BbaseIconPick, template;

  template = `
    <div class="BbaseIconPick-wrap bbase-component-iconpick">
      <div class="theme-black form">
        <div class="addSystemIconDiv" id="showSystemIconNew">
          <div bb-bbaseuiitemcheck="{viewId: 'iconcheck',cur: icon, items: items,tpl: iconchecktpl, onChange: handleIconcheckChange}" id="showSystemIconDiv" class="showSystemIconDiv">
          </div>
          <div class="colorChoiceDiv">
            <div id="iconThumbnail-wrap" bb-watch="icon:html,iconColor:html">
              <div class="iconThumbnail {{font}} {{icon}} faisco-icons-album2" style="color: {{iconColor}}">{{curIconText}}</div>
            </div>
            <div class="colorChoicePanel">
              <div class="setTitle">颜色：</div>
              <div bb-bbaseuiradio="{viewId: 'radio', cur: iconColorState,items: radioItems, onChange: handleRadioChange}" class="setCtrl marginT_7">
              </div>
              <div id="color-picker-wrap" style="display:inline-block;line-height: normal;">
                <div class="color-picker iconColorPicker" bb-watch="iconColorState:style,iconColor:style" style="{{#compare iconColorState '===' 'c'}}display:block;{{else}}display:none;{{/compare}}background-color: {{iconColor}};" bb-bbasecomponentcolorpick="{viewId: 'colorpick', cur: iconColor, onChange: handleFontColorChange}"></div>
              </div>
            </div>
          </div>
        </div>
         <div id="icon-btns">
          <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover">
          <input type="button" bb-click="save" value="确定" class="submit abutton faiButton faiButton-hover">
        </div>
      </div>
    </div>
  `;

  BbaseIconPick = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    initData: function () {
      var font = this._options.font || 'iconfont';
      return {
        font: font,
        icon: this._options.icon || 'iconDefault',
        iconColor: this._options.iconColor || '#ffffff',
        iconColorState: this._options.iconColorState || 'd',
        curIconText: this._options.icon === 'iconDefault' ? '默认' : '',
        iconchecktpl: `
          <div class="iconBlockSet"><div class="${font} {{value}}">{{text}}</div></div>
        `,
        items: this._options.items || [],
        radioItems: [
          { text: '默认', value: 'd' },
          { text: '自定义 ', value: 'c' }
        ]
      }
    },
    handleIconcheckChange: function (item, init) {
      this._set({
        curItemText: item.text,
        icon: item.value,
        content: item.content
      });
    },
    handleFontColorChange: function (color, init) {
      this._set('iconColor', color);
    },
    handleRadioChange: function (item, init) {
      this._set('iconColorState', item.value);
    },
    save: function () {
      if (this._options.onChange) this._options.onChange.call(this, BbaseEst.cloneDeep(this.model.toJSON()));
      if (BbaseApp.getDialog(this._options.viewId)) BbaseApp.getDialog(this._options.viewId).close().remove();
    },
    cancel: function () {
      if (BbaseApp.getDialog(this._options.viewId)) BbaseApp.getDialog(this._options.viewId).close().remove();
    }
  });

  module.exports = BbaseIconPick;
});
