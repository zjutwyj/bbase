'use strict';
/**
 * @description 模块功能说明
 * @class BbaseAlubmPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseAlubmPick', [], function(require, exports, module){
  var BbaseAlubmPick;

  var manageHref = null;

  BbaseAlubmPick = BbaseList.extend({
    initialize: function(){
      var size = typeof this.options.size === 'undefined' ? 120 : this.options.size;
      var domain = typeof this.options.domain === 'undefined' ? '' : ('domain="'+ this.options.domain+'"');
      var height = typeof this.options.height === 'undefined' ? 582 : this.options.height;
      this._super({
        template: `
          <div class="BbaseAlubmPick-wrap bbase-component-albumpick">
            <div id="popupWindowClose_8484" class="closeBtn bbasefont bbase-x" bb-click="_close" style="top: 16px; right: 16px;"></div>
            <ul class="materialLeftPanel ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist" style="height:${height}px">
              <li id="materialCookie" class="ui-state-default ui-corner-top" style="display:none;">
                <a id="material_select" href="javascript:;" class="ui-tabs-anchor">我的相册</a>
              </li>
              <li id="myPhotoCookie" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active">
                <a id="myPhoto_select" href="javascript:;" class="ui-tabs-anchor">我的相册</a>
              </li>
              <li class="uploadPhoto" style="display:none;">
                <span id="uploadButton" class="uploadify" style="cursor: pointer;">相册管理
                  <a id="file_upload_1-button" target="_blank" href="{{manageHref}}" class="uploadify-button"></a>
                  </span>
              </li>
            </ul>
            <div id="photo-main">
              <div class="photo-tool">
              <a href="{{manageHref}}" bb-click="_close" class="album-add" target="_blank">新增相册</a>&nbsp;&nbsp;&nbsp;(提示：图片标题、图片描述、链接设置请点击编辑按钮进行设置)
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
          className: 'i-template',
          template: `
             <div class="bg bor3 mod-album js-album-item js-album-transition">
              <div class="album-bd js-album-item-imgBox" bb-watch="mainPic:style" style="background-image:url({{PIC mainPic ${size} ${domain} }})">
                <a href="javascript:;" class="album-cover js-album-cover" >
                <span class="pic-num-wrap"><span class="pic-num" bb-watch="attCount:html">{{attCount}}</span></span>    <span class="album-status js-album-new"></span>   </a>
                 <div class="i-templateLayer">
              <div class="i-templateBtnContainer">
                <a href="javascript:;" bb-click="editAlbum" hidefocus="true" target="_blank" class="i-templateBtn i-lookTemplateBtn">
                  <span class="i-icon bbasefont bbase-edit"></span>
                  <span class="i-text">编辑</span>
                </a>
                <a href="javascript:;" hidefocus="true" bb-click="selectItem" class="i-templateBtn i-copyTemplateBtn">
                  <span class="i-icon bbasefont bbase-correct"></span>
                  <span class="i-text">选择</span>
                </a>
              </div>
            </div>
            <div class="i-templateCover">&nbsp;</div>
              </div>
              <div class="album-ft">
                <div class="album-desc ">
                  <div class="album-tit"><a href="javascript:;" class="c-tx2 js-album-desc-a" bb-watch="name:html" title="{{name}}" data-hottag="list.albumtitle">{{name}}</a></div>
                </div>
              </div>
            </div>
          `,
          initData(){
            return {
              manageHref: manageHref
            }
          },
          editAlbum(){
            var href = this._get('manageHref') + "?albumId=" + this._get('albumId');
            this._dialog({
              title: '编辑相册',
              content: `<div class="dialog-iframe"><iframe src="${href}" style="width:1280px;height:800px;"></iframe></div>`,
              width: 1280,
              height: 800,
              cover: true,
              quickClose: true
            })
          },
          selectItem(e){
            this._super('view').selectItem(this.model.toJSON(true));
          }
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
      manageHref = this._options.manageHref;
      return {
        manageHref: manageHref
      }
    },
    selectItem(model){
      if (this._options.onChange){
        this._options.onChange.call(this, model);
      }
      this._close();
    }
  });

  module.exports = BbaseAlubmPick;
});