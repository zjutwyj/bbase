'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoPanel', [], function (require, exports, module) {
  var BbasePhotoPanel;

  var items = [];
  for (var i = 0; i < 200; i++) {
    items.push({ filename: '图片名称' + i, serverPath: CONST.PIC_NONE + '?' + i });
  }

  BbasePhotoPanel = BbaseView.extend({
    initialize: function () {
      var size = typeof this.options.size === 'undefined' ? 120 : this.options.size;
      var width = typeof this.options.width === 'undefined' ? 240 : this.options.width;
      this._super({
        template: `
    <div class="BbasePhotoPanel-wrap bbase-component-photopanel" style="width: ${width}px;">
      <div class="c4-preview-wrapper" data-hook="preview-content" style="width:100%" aria-hidden="false">
      <img alt="" class="preview is-image" data-hook="single-image-thumb" title="" bb-src="{{PIC cur ${size}}}"><!---->
    <div class="c4-overlay preview"  aria-hidden="true" style="">
      <div class="c4-overlay-default-buttons" >
      <!---->
      <button class="p9c-primary cc-x-height" data-hook="replace-menu" bb-bbasecomponentphotopick="{viewId: 'photoPanelPick', cur: cur, items: items, listApi: listApi, onChange: handlePickChange}"><span class="cc-x-height font-t2" >替换</span></button>
      <!---->
      <button bb-show="showCropBtn" class="p9c-primary -icon-only" data-hook="crop-menu" ><i cc-tooltip-position="top" cc-tooltip="crop" class="cc-icon-circle cc-icon-crop tooltipstered bbasefont bbase-crop"></i></button>
      <!---->
      <button bb-show="showSettingBtn" class="p9c-primary -icon-only" data-hook="info-menu" ><i cc-tooltip-position="top" cc-tooltip="settings" class="cc-icon-circle cc-icon-settings tooltipstered bbasefont bbase-setting"></i></button></div>

    </div>
  </div>
    </div>
  `
      });
    },
    initData: function () {
      return {
        showSettingBtn: BbaseEst.typeOf(this.options.showSettingBtn) === 'boolean' ? this.options.showSettingBtn : false,
        showCropBtn: BbaseEst.typeOf(this.options.showCropBtn) === 'boolean' ? this.options.showCropBtn : false,
        listApi: this._options.listApi,
        cur: this._options.cur || 'upload/j/j2/jihui88/picture/2017/04/28/8e7867ee-3a84-4c5f-a97b-14cf455161c7.jpg!120?v=115305748',
        items: this._options.listApi ? null : items // 测试数据， 真实需请求api
      }
    },
    handlePickChange: function (items, init) {
      if (!init) {
        this._set('cur', items[0].serverPath);
        if (this._options.onChange) {
          this._options.onChange.call(this, items[0].serverPath, init);
        }
      }
    }
  });

  module.exports = BbasePhotoPanel;
});
