'use strict';
/**
 * @description 模块功能说明
 * @class BbaseIconPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseIconPanel', [], function(require, exports, module) {
  var BbaseIconPanel;

  BbaseIconPanel = BbaseView.extend({
    initialize: function() {
      var size = typeof this.options.size === 'undefined' ? 30 : this.options.size;
      var picSize = typeof this.options.picSize === 'undefined' ? 640 : this.options.picSize;
      var width = typeof this.options.width === 'undefined' ? 240 : this.options.width;
      var lineHeight = width * 0.6;
      this._super({
        template: `
          <div class="BbaseIconPanel-wrap bbase-component-iconpanel" style="width: ${width}px;">
            <div class="c4-preview-wrapper" data-hook="preview-content" style="width:100%" aria-hidden="false">
              <i bb-show="type==='icon'" bb-watch="font:class,cur:class,cur:html,iconColorState:style,iconColor:style" class="{{font}} {{cur}}" style="position: absolute; left: 0; top: 0;line-height: ${lineHeight}px; width: 100%; text-align: center;font-size:${size}px; {{#If iconColorState==='d'}}{{else}}color: {{iconColor}};{{/If}}">{{#If cur==='iconDefault'}}默认{{/If}}</i>
              <img bb-show="type==='pic'" alt="" class="preview is-image" data-hook="single-image-thumb" title="" bb-src="{{PIC cur ${picSize}}}">
              <!---->
              <div class="c4-overlay preview" aria-hidden="true" style="">
                <div class="c4-overlay-default-buttons">
                  <!---->
                  <button class="p9c-primary cc-x-height" data-hook="replace-menu" bb-bbasecomponenticonpick="{viewId:'bbasecomponenticonpickpanel',cur:cur, font: font,iconColor: iconColor,iconColorState: iconColorState,iconType: iconType,iconTypeItems: iconTypeItems,items: items, showTypeSelect: showTypeSelect,onChange: handleIconPickChange, showSearch: showSearch}"><span class="cc-x-height font-t2 photo-panel-replace-btn" bb-watch="iconTxt:html">{{iconTxt}}</span></button>
                  <!---->
                  <!---->
                  <button class="p9c-primary cc-x-height" data-hook="replace-menu" bb-bbasecomponentphotopick="{viewId: 'photoPanelPick', cur: cur, items: picItems, listApi: picListApi, onChange: handlePickChange,showSystem: showSystem,systemAlbumApi:systemAlbumApi}"><span class="cc-x-height font-t2 photo-panel-replace-btn" bb-watch="picTxt:html">{{picTxt}}</span></button>
                  <!---->
                </div>
              </div>
            </div>
          </div>
            `
      });
    },
    initData: function() {
      return {
        cur: this._options.icon || 'iconDefault',
        font: this._options.font || 'bbasefont',
        iconColor: this._options.iconColor || '#ffffff',
        iconColorState: this._options.iconColorState || 'd',
        iconType: this._options.iconType,
        iconTypeItems: this._options.iconTypeItems,
        showTypeSelect: this._options.showTypeSelect,
        items: this._options.items,
        showSearch: this._options.showSearch,
        type: this._options.type || 'icon', // icon / pic
        showSettingBtn: BbaseEst.typeOf(this.options.showSettingBtn) === 'boolean' ? this.options.showSettingBtn : false,
        showCropBtn: BbaseEst.typeOf(this.options.showCropBtn) === 'boolean' ? this.options.showCropBtn : false,
        showSystem: this.options.showSystem,
        picListApi: this._options.picListApi,
        systemAlbumApi: this._options.systemAlbumApi,
        picItems: this._options.picListApi ? null : this._options.picItems, // 测试数据， 真实需请求api
        iconTxt: '图标库',
        picTxt: '上传图片'
      }
    },
    beforeRender() {
      this.handleBtnTxt();
    },
    handleIconPickChange: function(item) {
      this._set('type', 'icon');
      var result = {
        icon: item.icon,
        font: item.font,
        iconColor: item.iconColor,
        iconColorState: item.iconColorState,
        iconType: item.iconType,
        content: item.content,
        type: this._get('type')
      }
      this._set(result);
      this._options.onChange && this._options.onChange(result);
    },
    handlePickChange: function(items, init) {
      if (!init) {
        this._set('cur', items[0].serverPath);
        this._set('type', 'pic');
        if (this._options.onChange) {
          var result = {
            icon: items[0].serverPath,
            font: this._get('font'),
            iconColor: this._get('iconColor'),
            iconColorState: this._get('iconColorState'),
            iconType: this._get('iconType'),
            content: this._get('content'),
            type: this._get('type'),
            width: items[0].width,
            height: items[0].height
          }
          this._options.onChange.call(this, result);
        }
      }
    },
    change(path) {
      if (path === 'cur') {
        this.handleBtnTxt();
      }
    },
    handleBtnTxt() {
      this._set({
        'iconTxt': '图标库',
        'picTxt': '上传图片'
      });
      if (this._get('type') === 'pic' && this._get('cur') && this._get('cur').indexOf('upload') > -1) {
        this._set('picTxt', '替换图片');
      } else if (this._get('type') === 'icon' && this._get('cur') && this._get('cur').indexOf('upload') === -1) {
        this._set('iconTxt', '替换图标');
      }
    },
    handleCrop: function() {
      if (this._options.onCrop) {
        this._options.onCrop.call(this, this._get('cur'));
      }
    },
    setValue: function(val) {
      this._set('cur', val);
    }
  });

  module.exports = BbaseIconPanel;
});