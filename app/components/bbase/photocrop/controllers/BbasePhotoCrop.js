'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoCrop
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 * 后期推荐用  http://www.jq22.com/yanshi7428 这个插件
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
      var picWidth = _this.model.get('picWidth');
      var picHeight = _this.model.get('picHeight');

      var x = parseInt(_this.x, 10);
      var y = parseInt(_this.y, 10);
      var x2 = parseInt(_this.x2, 10);
      var y2 = parseInt(_this.y2, 10);
      var w = parseInt(_this.w, 10);
      var h = parseInt(_this.h, 10);

      return {
        image: _this.model.get('image'),
        picWidth: _this.model.get('picWidth'),
        picHeight: _this.model.get('picHeight'),
        cropWidth: _this.model.get('cropWidth'),
        cropHeight: _this.model.get('cropHeight'),
        prefix: _this.model.get('prefix'),
        cropImage: _this.cropImage,
        x: x, // x轴坐标(相对于原图)
        y: y, // y轴坐标(相对于原图)
        x2: x2, // x轴结束坐标(相对于原图)
        y2: y2, // y轴结束坐标(相对于原图)
        w: w, // 截取的宽度(相对于原图)
        h: h // 截取的高度(相对于原图)
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

      _this.x = 0; // x轴坐标(相对于原图)
      _this.y = 0; // y轴坐标(相对于原图)
      _this.x2 = _this.cropWidth; // x轴结束坐标(相对于原图)
      _this.y2 = _this.cropHeight; // y轴结束坐标(相对于原图)
      _this.w = _this.x2; // 截取的宽度(相对于原图)
      _this.h = _this.y2; // 截取的高度(相对于原图)

      _this.pos = _this.model.get('pos');

      if (!BbaseEst.isEmpty(_this.pos)) {
        var pos = JSON.parse(_this.pos);
        _this.cropImage = pos.cropImage;
        // 修复从上一个图片位置坐标太大会出现选择框消失的问题
        if (pos.x > _this.picWidth || pos.y > _this.picHeight) {} else {
          _this.x = pos.x;
          _this.y = pos.y;
          _this.x2 = pos.x2;
          _this.y2 = pos.y2;
          _this.w = _this.x2 - _this.x;
          _this.h = _this.y2 - _this.y;
        }
      }
      _this.radio = _this.cropWidth / _this.cropHeight;
      try {
        var loadImage = new Image();
        loadImage.onload = function() {
          setTimeout(function() {
            _this.init = true;
            _this.createCrop();
          }, 100)
        }
        loadImage.src = CONST.PIC_URL + '/' + _this._get('image');
      } catch (e) {
        console.log(e);
      }
    },
    createCrop: function() {
      var _this = this;
      var scale = _this.picWidth / _this.boxWidth;
      console.log('初始参数x:' + parseInt(_this.x) + ",y:" + parseInt(_this.y) + ",x2:" + parseInt(_this.x2) + ",y2:" + parseInt(_this.y2) + ",w:" + parseInt(_this.w) + ",h:" + parseInt(_this.h));
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
          if (!_this.init) {

            _this.x = result.x;
            _this.y = result.y;
            _this.x2 = result.x2;
            _this.y2 = result.y2;
            _this.w = result.w;
            _this.h = result.h;

            console.log('剪切参数x:' + parseInt(_this.x) + ",y:" + parseInt(_this.y) + ",x2:" + parseInt(_this.x2) + ",y2:" + parseInt(_this.y2) + ",w:" + parseInt(_this.w) + ",h:" + parseInt(_this.h));
          }

        }
      }, function() {
        _this.jcrop = this;
        _this.init = false;
      });
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
      console.log("上传参数x:" + cropArgs.x + ",y:" + cropArgs.y + ",x2:" + cropArgs.x2 + ",y2:" + cropArgs.y2 + ",w:" + cropArgs.w + ",h:" + cropArgs.h + ",picWidth:" + cropArgs.picWidth + ",picHeight:" + cropArgs.picHeight);
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
              x: cropArgs.x,
              y: cropArgs.y,
              x2: cropArgs.x2,
              y2: cropArgs.y2,
              picWidth: cropArgs.picWidth,
              picHeight: cropArgs.picHeight,
              image: cropArgs.image,
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