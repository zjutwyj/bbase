'use strict';
/**
 * @description 模块功能说明
 * @class BbaseAlubmPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseAlubmPick', [], function(require, exports, module){
  var BbaseAlubmPick;

  BbaseAlubmPick = BbaseList.extend({
    initialize: function(){
      this._super({
        template: `
          <div class="BbaseAlubmPick-wrap bbase-component-albumpick">
            <div id="popupWindowClose_8484" class="closeBtn bbasefont bbase-x" bb-click="_close" style="top: 16px; right: 16px;"></div>
            <ul class="materialLeftPanel ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
              <li id="materialCookie" class="ui-state-default ui-corner-top" style="display:none;">
                <a id="material_select" href="javascript:;" class="ui-tabs-anchor">我的相册</a>
              </li>
              <li id="myPhotoCookie" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active">
                <a id="myPhoto_select" href="javascript:;" class="ui-tabs-anchor">我的相册</a>
              </li>
              <li class="uploadPhoto">
                <span id="uploadButton" class="uploadify" style="cursor: pointer;">管理相册
                  <a id="file_upload_1-button" href="javascript:void(0)" class="uploadify-button"></a>
                  </span>
              </li>
            </ul>
            <div id="photo-main">
              <div class="photo-tool">
              </div>
              <ul class="photo-list js-album-list-ul">
              </ul>
            </div>
            <div id="photo-pagination">
            </div>
            <div id="photo-btns">
              <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover" />
              <input type="button" bb-click="onChange" value="确定" class="submit abutton faiButton faiButton-hover" />
            </div>
        </div>
        `,
        model: BbaseModel.extend({
          baseId: 'attId',
          baseUrl: CONST.API + (this.options.detailApi || '/att/detail')
        }),
        collection: BbaseCollection.extend({
          url: this.options.listApi ?
            this.options.listApi.indexOf('http') > -1 ? this.options.listApi : CONST.API + this.options.listApi : '/att/list'
        }),
        item: BbaseItem.extend({
          tagName: 'li',
          template: `
             <div class="bg bor3 mod-album js-album-item js-album-transition" style="width: 122px; top: 0px; left: 0px;">
              <div class="album-bd js-album-item-imgBox" style="height: 110px;">
                <a href="javascript:;" class="album-cover js-album-cover" >
                <img class="js-cover-img" bb-src="{{PIC serverPath}}" style="width: 147.786px; height: 110px; margin-top: 0px; margin-left: -13px;">
                <span class="pic-num-wrap"><span class="pic-num">3</span></span>    <span class="album-status js-album-new"></span>   </a>
              </div>
              <div class="album-ft">
                <div class="album-desc ">
                  <div class="album-tit"><a href="javascript:;" class="c-tx2 js-album-desc-a" title="我的相册1" data-hottag="list.albumtitle">我的相册1</a></div>
                </div>
              </div>
            </div>
          `
        }),
        render: '.photo-list',
        pagination: '#photo-pagination',
        pageSize: 15,
        diff: true,
        checkAppend: true,
        checkToggle: true
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = BbaseAlubmPick;
});