'use strict';
/**
 * @description 模块功能说明
 * @class ModuleName
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoPick', ['BbaseItemCheck', 'FileUpload'], function (require, exports, module) {
  var BbasePhotoPick, template, BbaseItemCheck, FileUpload;

  BbaseItemCheck = require('BbaseItemCheck');
  FileUpload = require('FileUpload');
  template = `
    <div class="theme-black bbase-component-photopick">
      <div id="popupWindowClose_8484" class="closeBtn bbasefont bbase-x" bb-click="_close" style="top: 16px; right: 16px;"></div>
      <ul class="materialLeftPanel ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
        <li id="materialCookie" class="ui-state-default ui-corner-top" style="display:none;">
          <a id="material_select" href="javascript:;" class="ui-tabs-anchor">系统图片</a>
        </li>
        <li id="myPhotoCookie" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active">
          <a id="myPhoto_select" href="javascript:;" class="ui-tabs-anchor">我的图片</a>
        </li>
        <li class="uploadPhoto">
          <span id="uploadButton" class="uploadify" style="cursor: pointer;">上传图片
        <a id="file_upload_1-button" href="javascript:void(0)" class="uploadify-button"></a>
        </span>
        </li>
      </ul>
      <div id="photo-main">
        <div class="photo-tool">
        </div>
        <ul class="photo-list">
        </ul>
      </div>
      <div id="photo-pagination">
      </div>
      <div id="photo-btns">
        <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover" />
        <input type="button" bb-click="onChange" value="确定" class="submit abutton faiButton faiButton-hover" />
      </div>
    </div>
  `;

  BbasePhotoPick = BbaseList.extend({
    initialize: function () {
      var size = typeof this.options.size === 'undefined' ?  120 : this.options.size;
      this._super({
        model: BbaseModel.extend({
          defaults: BbaseEst.extend({}, BbaseModel.prototype.defaults),
          baseId: 'attId',
          baseUrl: CONST.API +  (this.options.detailApi || '/att/detail')
        }),
        collection: BbaseCollection.extend({
          url: CONST.API + (this.options.listApi || '/att/list')
        }),
        item: BbaseItem.extend({
          events: {
            'click .clickToUse': 'clickToUse',
            'click .delBtn': '_del'
          },
          tagName: 'li',
          className: 'photo-item',
          template: `
            <div class="pictureFrame {{#if checked}}selected{{/if}}">
            <div class="picture-img" bb-watch="serverPath:style" style=" background-image: url({{PIC serverPath ${size}}});">
              <div class="hoverBg">
                <div class="clickToUse">点击使用</div>
              </div>
              <div class="operationBar">
                <a href="javascript:;" id="" class="delBtn bbasefont bbase-delete" title="删除"></a>
              </div>
              <div class="selectBtn">
              </div>
            </div>
            <div class="picTitle" style=""><span bb-watch="filename:html">{{filename}}</span></div>
          </div>
          `,
          clickToUse: function (e) {
            e.stopImmediatePropagation();
            BbaseApp.getView(this._options.viewId).onChange(this.model.toJSON());
          },
          afterRender: function () {
            BbaseApp.addRegion('ck' + this.model.get('id'), BbaseItemCheck, {
              el: this.$('.selectBtn'),
              path: 'value',
              theme: 'ui-item-check-checkbox',
              cur: this.model.get('checked') ? '01' : '00',
              checkAppend: true,
              checkToggle: true,
              items: [
                { text: '', value: '01' }
              ],
              onChange: this._bind(function (item, init) {
                if (init) return;
                this._check();
              })
            });
          }
        }),
        render: '.photo-list',
        template: template,
        pagination: '#photo-pagination',
        pageSize: 15,
        diff: true,
        checkAppend: true,
        checkToggle: true
      });
    },
    onWatch: function () {
    },
    afterRender: function () {
      this.initFileUpload({
        target: this.$('#file_upload_1-button'),
        data: this._options.data,
        success: this._bind(function (options) {
          this._reload({
            pageSize: 15,
            page: 1
          });
        })
      });
    },
    onChange: function (model) {
      var list = this._getCheckedItems();
      if (this._options.onChange) {
        this._options.onChange.call(this, list.length > 1 ? BbaseEst.map(list, 'attributes') : [model]);
      }
      this._close();
    },
    initFileUpload: function (options) {
      options = options || {};

      var viewId = BbaseEst.nextUid('fileupload');
      $(options.target).css({ 'position': 'absolute', 'overflow': 'hidden' });
      $(options.target).each(function () {
        $(this).append('<input id="' + viewId + '" style="height:' + ($(this).height() + parseFloat($(this).css('padding-top')) + parseFloat($(this).css('padding-bottom'))) +
          'px;" class="file-upload" type="file" name="Filedata" value="从我的电脑里选择上传" multiple>');
      });

      $('#' + viewId, options.target).fileupload({
        url: CONST.API + (this.options.uploadApi || '/upload/todo'),
        dataType: 'json',
        formData: BbaseEst.extend(options.data || {}, {
          "username": CONST.USER && CONST.USER.username, // 用户名
          "id": 'all', // 相册ID
          "replace": false, // 是否替换操作
          "attId": '', // 图片ID
          "width": options.width || 640
        }),
        submit: function (e, data) {
          if (options.submit) options.submit.call(this, data);
        },
        start: function (e) {
          if (!window.$uploading) {
            window.$uploading = $('<div class="uploading"></div>');
            $('body').append(window.$uploading);
          }
          window.$uploading.html('0%');
          window.$uploading.show();
        },
        progressall: function (e, data) {
          var per = parseInt(data.loaded / data.total * 100, 10) + '%';
          if (per === '100%') {
            per = per + ',正在加载图片...';
          }
          window.$uploading.html(per);
        },
        done: function (e, data) {
          var response = data.result;
          window.$uploading.hide();
          if (!response.success && response.msg === '请先登陆') {
            $('.leaflet-login').click();
            return false;
          }
          if (!response.success) {
            alert(response.msg);
            return false;
          }
          if (response.success) {
            options.success.call(this, {
              serverPath: response.attributes.data,
              width: response.attributes.width,
              height: response.attributes.height,
              fileName: response.attributes.fileName,
              msg: response.msg
            });
          }
        },
        error: function (e) {
          BaseUtils.tip('上传失败');
          window.$uploading.hide();
        }
      });
    }
  });

  module.exports = BbasePhotoPick;
});
