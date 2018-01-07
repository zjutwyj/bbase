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
      var _this = this;
      var scale = _this.picWidth > _this.boxWidth ? _this.picWidth / _this.boxWidth : 1;
      return {
        image: _this.model.get('image'),
        picWidth: _this.model.get('picWidth'),
        picHeight: _this.model.get('picHeight'),
        cropWidth: _this.model.get('cropWidth'),
        cropHeight: _this.model.get('cropHeight'),
        prefix: _this.model.get('prefix'),
        cropImage: _this.cropImage,
        x: parseInt(_this.x * scale), // x轴坐标(相对于原图)
        y: parseInt(_this.y* scale, 10), // y轴坐标(相对于原图)
        x2: parseInt(_this.x2* scale, 10), // x轴结束坐标(相对于原图)
        y2: parseInt(_this.y2* scale, 10), // y轴结束坐标(相对于原图)
        w: parseInt(_this.w* scale, 10), // 截取的宽度(相对于原图)
        h: parseInt(_this.h* scale, 10) // 截取的高度(相对于原图)
      }
    },
    afterRender: function() {
      var _this = this;
      _this.jcrop = null;
      _this.initcrop = true;

      _this.cropWidth = parseInt(_this.model.get('cropWidth')); // 裁剪宽度
      _this.cropHeight = parseInt(_this.model.get('cropHeight')); // 裁剪高度

      _this.boxWidth = parseInt(_this.model.get('boxWidth') || 350); // 展示框宽度
      _this.boxHeight = parseInt(_this.model.get('boxHeight') || 350); // 展示框高度

      _this.picWidth = parseInt(_this.model.get('picWidth')); // 原图片宽度
      _this.picHeight = parseInt(_this.model.get('picHeight')); // 原图片高度

      _this.x = 0; // x轴坐标(相对于对话框)
      _this.y = 0; // y轴坐标(相对于对话框)
      _this.x2 = _this.cropWidth / _this.boxWidth * _this.picWidth; // x轴结束坐标(相对于对话框)
      _this.y2 = _this.cropHeight / _this.boxHeight * _this.picHeight; // y轴结束坐标(相对于对话框)
      _this.w = _this.x2; // 截取的宽度(相对于对话框)
      _this.h = _this.y2; // 截取的高度(相对于对话框)

      _this.pos = _this.model.get('pos');

      if (!BbaseEst.isEmpty(_this.pos)) {
        var pos = JSON.parse(_this.pos);
        _this.x = pos.x;
        _this.y = pos.y;
        _this.x2 = pos.x2;
        _this.y2 = pos.y2;
        _this.w = _this.x2;
        _this.h = _this.y2;
        _this.cropImage = pos.cropImage;
      }

      _this.radio = _this.cropWidth / _this.cropHeight;

      try {
        setTimeout(function() {
          _this.$('#jcrop-target').Jcrop({
            bgFade: false,
            boxWidth: _this.boxWidth,
            boxHeight: _this.boxHeight,
            aspectRatio: _this.radio,
            allowSelect: false,
            bgOpacity: .6,
            setSelect: [_this.x, _this.y, _this.x2, _this.y2],
            onSelect: function(result) {
              var ctx = this;
              _this.x = result.x;
              _this.y = result.y;
              _this.x2 = result.x2;
              _this.y2 = result.y2;
              _this.w = result.w;
              _this.h = result.h;

              console.log('x:' + parseInt(_this.x) + ", y:" + parseInt(_this.y) + ", x2:" + parseInt(_this.x2) + ",y2:" + parseInt(_this.y2) + ",w:" + parseInt(_this.w) + ", h:" + parseInt(_this.h));
            },
            onRelease: function() {

            }
          }, function() {
            _this.jcrop = this;
          });
        }, 100)


      } catch (e) {
        console.log(e);
      }
    },
    closeCrop: function() {
      if (this._options.onCancel) {
        this._options.onCancel.call(this);
      }
      this._close();
    },
    cropImageUpload: function() {
      var ctx = this;
      BbaseUtils.addLoading();
      var cropArgs = this.getOption();
      console.log("裁切参数：x轴坐标：" + cropArgs.x + ", y轴坐标：" + cropArgs.y + ",x距离：" + cropArgs.x2 + ",y距离：" + cropArgs.y2 + ",裁切宽度：" + cropArgs.w + ",裁切高度：" + cropArgs.h + ", 原图片宽度:" + cropArgs.picWidth + ",原图片高度：" + cropArgs.picHeight);
      $.ajax({
        type: 'post',
        url: CONST.API + (this._get('cutApi') || '/upload/toCut'),
        data: cropArgs,
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