'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoPanel', [], function (require, exports, module) {
  var BbasePhotoPanel;

  var pics = [
    'http://img.leshai.cc/wcd/upload/029/2017/07/26/c2f0fe48-4061-4713-a4cd-c2dc6abf3866.jpg?v=3783305377',
    'http://img.leshai.cc/wcd/upload/029/2017/07/25/a78f0f86-0327-443a-a6cb-4ef8d26ee4ab.jpg?v=3744100224',
    'http://img.leshai.cc/wcd/upload/029/2017/07/15/08af373a-8e2c-41ec-9103-d8abbf3e536c.png?v=116420884',
    'http://img.leshai.cc/wcd/upload/029/2017/07/13/7adea40c-820a-4336-b833-995cdff61123.png?v=3706144612',
    'http://img.leshai.cc/wcd/upload/029/2017/07/12/7463464c-cd1e-4489-8a08-47835afb07a0.png?v=3706144612',
    'http://img.leshai.cc/wcd/upload/029/2017/07/11/1f6b6da0-b633-4cf7-b8dc-b73a9886b06f.png?v=3706144612',
    'http://img.leshai.cc/wcd/upload/029/2017/07/11/da830860-c7f1-4a7a-9718-34561f162447.png?v=3706144612',
    'http://img.leshai.cc/wcd/upload/029/2017/07/01/dc2a3332-3415-40e6-9384-49afa427273b.jpg?v=3738521475',
    'http://img.leshai.cc/wcd/upload/029/2017/06/24/636cf652-4dc1-4990-8c40-61d3ad5c2783.png?v=4058835084'
    ];

  for (var j = 0; j < 10; j++) {
      pics = pics.concat(pics);
  }
  var items = [];
  for(var i = 0; i< 200; i++){
    items.push({filename:'图片名称' + i, serverPath: pics[i] + i});
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
      <button class="p9c-primary cc-x-height" data-hook="replace-menu" bb-bbasecomponentphotopick="{viewId: 'photoPanelPick', cur: cur, items: items, listApi: listApi, onChange: handlePickChange,showSystem: showSystem,systemAlbumApi:systemAlbumApi}"><span class="cc-x-height font-t2 photo-panel-replace-btn" >替换</span></button>
      <!---->
      <button bb-show="showCropBtn" class="p9c-primary -icon-only" bb-click="handleCrop" data-hook="crop-menu" style="width:auto;padding: 0px 10px;line-height:14px;"><i cc-tooltip-position="top" cc-tooltip="crop" class="cc-icon-circle cc-icon-crop tooltipstered bbasefont bbase-crop"></i><span class="font-t2" style="font-size:14px;vertical-align:middle;">裁剪</span></button>
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
        showSystem: this.options.showSystem,
        listApi: this._options.listApi,
        systemAlbumApi: this._options.systemAlbumApi,
        cur: this._options.cur || 'upload/j/j2/jihui88/picture/2017/04/28/8e7867ee-3a84-4c5f-a97b-14cf455161c7.jpg!120?v=115305748',
        items: this._options.listApi ? null : items // 测试数据， 真实需请求api
      }
    },
    handlePickChange: function (items, init) {
      if (!init) {
        this._set('cur', items[0].serverPath);
        if (this._options.onChange) {
          this._options.onChange.call(this, items[0].serverPath, init, items[0]);
        }
      }
    },
    handleCrop: function () {
      if (this._options.onCrop){
        this._options.onCrop.call(this, this._get('cur'));
      }
    },
    setValue: function (val) {
      this._set('cur', val);
    }
  });

  module.exports = BbasePhotoPanel;
});
