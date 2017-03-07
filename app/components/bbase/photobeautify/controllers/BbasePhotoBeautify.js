'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoBeautify
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoBeautify', ['Xiuxiu'], function (require, exports, module) {
  var BbasePhotoBeautify, template, Xiuxiu;

  Xiuxiu = require('Xiuxiu');

  template = `
    <div class="BbasePhotoBeautify-wrap bbase-component-photobeaufity">
    </div>
  `;

  BbasePhotoBeautify = BbaseView.extend({
    initialize: function () {
      this._super({
        template: template
      });
    },
    afterRender: function () {
      var xiuxiuId = BbaseEst.nextUid('xiuxiu');
      var upload_options = {
        upload_url: CONST.API + (this.options.uploadApi || '/upload/todo'),
        post_params: {
          "username": CONST.USER.username, // 用户名
          "id": 'all', // 相册ID
          "replace": false, // 是否替换操作
          "attId": '', // 图片ID
          "width": this.options.width || 640
        }
      };
      xiuxiu.setLaunchVars('nav', 'edit');
      //xiuxiu.setLaunchVars("file_type", "auto");//file_type的值为jpg \ png \ auto(根据打开图片格式判断)

      xiuxiu.embedSWF(xiuxiuId, 3, "1000px", "600px", 'xiuxiuEditor');


      $('#xiuxiuEditor').css({
        'z-index': '2500',
        'position': 'fixed',
        'visibility': 'visible',
        'top': ($(window).height() - ($('#xiuxiuEditor').height() || 350)) / 2,
        'left': ($(window).width() - ($('#xiuxiuEditor').width() || 500)) / 2
      });
      xiuxiu.setUploadType(2);

      xiuxiu.setUploadURL(upload_options.upload_url); //修改为您自己的上传接收图片程序

      xiuxiu.onBeforeUpload = function (data, id) {
        if (data.size > 1024 * 1024 * 3) {
          alert("上传图片不能超过3M");
          return false;
        }
        this.options.onBeforeUpload && this.options.onBeforeUpload.call(this, upload_options.post_params, id);
        xiuxiu.setUploadArgs(BbaseEst.extend({
          filetype: data.type,
          type: "image",
          filename: data.name,
          fileSize: data.size
        }, upload_options.post_params));
      }
      xiuxiu.onInit = function () {
        xiuxiu.loadPhoto(CONST.PIC_URL + '/' + (this.options.cur || CONST.PIC_NONE)); //修改为要处理的图片url
      }
      xiuxiu.onUploadResponse = function (data) {
        var result = $.parseJSON(data.replace(/\/\//g, '/'));
        if (!result.success && result.msg === '请先登陆') {
          $('.leaflet-login').click();
          return false;
        }
        if (!result.success) {
          alert(result.msg);
          return false;
        }
        this.options.onUploadResponse && this.options.onUploadResponse.call(this, result);
        $('.xiuxiu-wrap').remove();
        $("#xiuxiuEditor").remove();
      }
      xiuxiu.onClose = function () {
        $('.xiuxiu-wrap').remove();
        $("#xiuxiuEditor").remove();
      }
      $('.xiuxiu-wrap, .close-xiuxiu-dialog').on('click', function () {
        $('.xiuxiu-wrap').remove();
        $("#xiuxiuEditor").remove();
        return false;
      });
    }
  });

  module.exports = BbasePhotoBeautify;
});
