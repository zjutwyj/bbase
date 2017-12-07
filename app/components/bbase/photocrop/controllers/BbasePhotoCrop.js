'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoCrop
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoCrop', ['Jcrop'], function(require, exports, module) {
  var BbasePhotoCrop, template, Jcrop;

  Jcrop = require('Jcrop');

  template = `
    <div class="BbasePhotoCrop-wrap bbase-component-photocrop" style="overflow:hidden;">
     <link rel="stylesheet" href="{{CONST 'HOST'}}/components/bbase/photocrop/vendor/Jcrop/css/jquery.Jcrop.css" type="text/css" />
<div class="jcrop-content">
  <img src="{{PIC image}}"  id="jcrop-target" alt=""/>
</div>
<div id="photo-btns">
    <input type="button" bb-click="closeCrop" value="取消" class="cancel abutton faiButton faiButton-hover">
    <input type="button" bb-click="cropImageUpload" value="确定" class="submit abutton faiButton faiButton-hover">
  </div>
    </div>
  `;

  BbasePhotoCrop = BbaseView.extend({
    initialize: function() {
      this._initialize({
        template: template
      });
    },
    getOption: function() {
      return {
        image: this.model.get('image'),
        picWidth: this.model.get('picWidth'),
        picHeight: this.model.get('picHeight'),
        cropWidth: this.model.get('cropWidth'),
        cropHeight: this.model.get('cropHeight'),
        prefix: this.model.get('prefix'),
        cropImage: this.cropImage,
        x: parseInt(this.x), // x轴坐标(相对于原图)
        y: parseInt(this.y, 10), // y轴坐标(相对于原图)
        x2: parseInt(this.x2, 10), // x轴结束坐标(相对于原图)
        y2: parseInt(this.y2, 10), // y轴结束坐标(相对于原图)
        w: parseInt(this.w, 10), // 截取的宽度(相对于原图)
        h: parseInt(this.h, 10) // 截取的高度(相对于原图)
      }
    },
    afterRender: function() {
      this.jcrop = null;

      this.cropWidth = parseInt(this.model.get('cropWidth')); // 裁剪宽度
      this.cropHeight = parseInt(this.model.get('cropHeight')); // 裁剪高度

      this.boxWidth = parseInt(this.model.get('boxWidth') || 350); // 展示框宽度
      this.boxHeight = parseInt(this.model.get('boxHeight') || 350); // 展示框高度

      this.picWidth = parseInt(this.model.get('picWidth')); // 原图片宽度
      this.picHeight = parseInt(this.model.get('picHeight')); // 原图片高度

      this.x = 0; // x轴坐标(相对于原图)
      this.y = 0; // y轴坐标(相对于原图)
      this.x2 = this.cropWidth / this.boxWidth * this.picWidth; // x轴结束坐标(相对于原图)
      this.y2 = this.cropHeight / this.boxHeight * this.picHeight; // y轴结束坐标(相对于原图)
      this.w = this.x2; // 截取的宽度(相对于原图)
      this.h = this.y2; // 截取的高度(相对于原图)

      this.pos = this.model.get('pos');
      if (!BbaseEst.isEmpty(this.pos)){
        var pos = JSON.parse(this.pos);
        this.x = pos.x;
        this.y = pos.y;
        this.x2 = pos.x2;
        this.y2 = pos.y2;
        this.w = this.x2;
        this.h = this.y2;
        this.cropImage = pos.cropImage;
      }


      this.radio = this.cropWidth / this.cropHeight;
      try {
        this.$('#jcrop-target').Jcrop({
          bgFade: false,
          boxWidth: this.boxWidth,
          boxHeight: this.boxHeight,
          aspectRatio: this.radio,
          allowSelect: false,
          bgOpacity: .6,
          setSelect: [this.x, this.y, this.x2, this.y2],
          onSelect: BbaseEst.proxy(function(result) {
            this.x = result.x;
            this.x2 = result.x2;
            this.y = result.y;
            this.y2 = result.y2;
            this.w = result.w;
            this.h = result.h;
            /*console.log('x:' + parseInt(this.x) + ", y:" + parseInt(this.y) + ", x2:" + parseInt(this.x2) + ",y2:" + parseInt(this.y2) + ",w:" + parseInt(this.w) + ", h:" + parseInt(this.h));*/
          }, this),
          onRelease: function() {

          }
        }, BbaseEst.proxy(function() {
          this.jcrop = this;
        }, this));
      } catch (e) {
        console.log(e);
      }
    },
    closeCrop: function () {
      if (this._options.onCancel){
        this._options.onCancel.call(this);
      }
      this._close();
    },
    cropImageUpload: function() {
      var ctx = this;
      BbaseUtils.addLoading();
      $.ajax({
        type: 'post',
        url: CONST.API + (this._get('cutApi') || '/upload/toCut'),
        data: this.getOption(),
        success: function(result) {
          if (!result.success) {
            BbaseUtils.tip(result.msg);
            BbaseUtils.removeLoading();
            return;
          }
          setTimeout(function() {
            // 记录位置便于下次复用
            var pos = {
              x: ctx.x,
              y: ctx.y,
              x2: ctx.x2,
              y2: ctx.y2,
              picWidth: ctx.picWidth,
              picHeight: ctx.picHeight,
              image: ctx._get('image'),
              cropImage: result.attributes.picpath
            }
            ctx._options.onChange && ctx._options.onChange.call(this, decodeURIComponent(result.attributes.picpath), result.attributes.width, result.attributes.height, JSON.stringify(pos));
            BbaseApp.getCurrentDialog().close().remove();
            BbaseUtils.removeLoading();
          }, 1000);

        }
      });
    }
  });

  module.exports = BbasePhotoCrop;
});