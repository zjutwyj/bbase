'use strict';
/**
 * @description 模块功能说明
 * @class BbasePhotoCrop
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbasePhotoCrop', ['Jcrop'], function (require, exports, module) {
  var BbasePhotoCrop, template,Jcrop;

  Jcrop = require('Jcrop');

  template = `
    <div class="BbasePhotoCrop-wrap bbase-component-photocrop">
     <link rel="stylesheet" href="components/bbase/photocrop/vendor/Jcrop/css/jquery.Jcrop.css" type="text/css" />
<div class="jcrop-content">
  <img src="{{PIC image}}"  id="jcrop-target" alt=""/>
</div>
<div id="photo-btns">
    <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover">
    <input type="button" bb-click="cropImageUpload" value="确定" class="submit abutton faiButton faiButton-hover">
  </div>
    </div>
  `;

  BbasePhotoCrop = BbaseView.extend({
    initialize: function () {
      this._initialize({
        template: template
      });
    },
    getOption: function () {
      return {
        image: this.model.get('image'),
        width: this.model.get('width') || 640,
        height: this.model.get('height') || 640,
        x: parseInt(this.x, 10),
        x2: parseInt(this.x2, 10),
        y: parseInt(this.y, 10),
        y2: parseInt(this.y2, 10),
        w: parseInt(this.w, 10),
        w2: parseInt(this.x2 - this.x, 10),
        h: parseInt(this.h, 10),
        h2: parseInt(this.y2 - this.y, 10)
      }
    },
    afterRender: function () {
      this.jcrop = null;
      this.x = 0;
      this.x2 = 0;
      this.y2 = 0;
      this.y = 0;
      this.w = 320;
      this.h = 320;
      try {
        this.$('#jcrop-target').Jcrop({
          bgFade: false,
          boxWidth: 380,
          boxHeight: 380,
          aspectRatio: this.model.get('ratio') || 1,
          allowSelect: false,
          bgOpacity: .6,
          setSelect: [0, 0, 320, 320],
          onSelect: BbaseEst.proxy(function (result) {
            this.x = result.x;
            this.x2 = result.x2;
            this.y = result.y;
            this.y2 = result.y2;
            this.w = result.w;
            this.h = result.h;
          }, this),
          onRelease: function () {

          }
        }, BbaseEst.proxy(function () {
          this.jcrop = this;
        }, this));
      } catch (e) {
        console.log(e);
      }
    },
    cropImageUpload: function () {
      var ctx = this;
      $.ajax({
        type: 'post',
        url: CONST.API + (this._get('cutApi') || '/upload/toCut'),
        async: false,
        data: this.getOption(),
        success: function (result) {
          if (!result.success) {
            BbaseUtils.tip(result.msg);
            return;
          }
          ctx._options.onChange && ctx._options.onChange.call(this, decodeURIComponent(result.attributes.picpath) + '?v=' + new Date().getTime(), result.attributes.width, result.attributes.height);
          BbaseApp.getCurrentDialog().close();
        }
      });
    }
  });

  module.exports = BbasePhotoCrop;
});
