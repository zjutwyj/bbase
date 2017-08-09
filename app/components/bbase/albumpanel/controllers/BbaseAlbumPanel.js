'use strict';
/**
 * @description 模块功能说明
 * @class BbaseAlbumPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseAlbumPanel', [], function (require, exports, module) {
  var BbaseAlbumPanel;

  var items = [];
  for (var i = 0; i < 200; i++) {
    items.push({ albumId: i, name: '相册名称' + i, mainPic: CONST.PIC_NONE + '?' + i, attCount: i });
  }

  BbaseAlbumPanel = BbaseView.extend({
    initialize: function () {
      var size = typeof this.options.size === 'undefined' ? 120 : this.options.size;
      var width = typeof this.options.width === 'undefined' ? 240 : this.options.width;
      var domain = typeof this.options.domain === 'undefined' ? '' : ("domain='"+ this.options.domain+"'");
      this._super({
        template: `
    <div class="BbaseAlbumPanel-wrap bbase-component-albumpanel" style="width: ${width}px;">
      <div class="c4-preview-wrapper" data-hook="preview-content" style="width:100%" aria-hidden="false">
      <img alt="" class="preview is-image" data-hook="single-image-thumb" title="" bb-src="{{PIC mainPic ${size} ${domain} }}"><!---->
    <div class="c4-overlay preview"  aria-hidden="true" style="">
      <div class="c4-overlay-default-buttons" >
      <!---->
      <button class="p9c-primary cc-x-height" data-hook="replace-menu" bb-bbasecomponentalbumpick="{viewId: 'photoPanelPick', cur: cur, items: items, listApi: listApi,detailApi:detailApi, manageHref:manageHref,domain: domain,size:size,onChange: handlePickChange}"><span class="cc-x-height font-t2" >选择相册</span></button>
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
        cur: this._options.cur || '',
        mainPic: this.options.mainPic,
        size: this._options.size,
        domain: this._options.domain,
        detailApi: this._options.detailApi,
        manageHref: this._options.manageHref,
        items: this._options.listApi ? null : this._options.items || items // 测试数据， 真实需请求api
      }
    },

    handlePickChange: function (item, init) {
      if (!init) {
        this._set('cur', item.albumId);
        this._set('mainPic', item.mainPic);
        if (this._options.onChange) {
          this._options.onChange.call(this, item, init);
        }
      }
    }
  });

  module.exports = BbaseAlbumPanel;
});
