Bbase.MODULE['Jcrop'] = 'components/bbase/photocrop/vendor/Jcrop/js/jquery.Jcrop.js';
Bbase.MODULE['BbasePhotoCrop'] = 'components/bbase/photocrop/controllers/BbasePhotoCrop.js';
Bbase.DIRECTIVE['bbasecomponentphotocrop'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentmusicpick');

    this.$(selector).eq(0).click(this._bind(function (e) {
      e.stopImmediatePropagation();
      this._dialog({
        viewId: viewId,
        moduleId: 'BbasePhotoCrop',
        cover: true,
        quickClose: false,
        width: object.width || 350,
        height: (object.height || 350 + 75),
        data: {
          boxWidth: object.width || 350,
          boxHeight: object.height || 350,
          picWidth: object.picWidth,   // 图片实际宽度
          picHeight:object.picHeight,  // 图片实际高度
          cropWidth: object.cropWidth, // 裁切图片宽度
          cropHeight: object.cropHeight, // 裁切图片高度
          pos: object.pos,              //记录上次的记录,包括原图片长宽，剪裁图片地址
          prefix: object.prefix,        // 用于解决同一张图片不同裁切的重复性问题， 此参数传递到后端
          cutApi: object.cutApi,
          image: this._get(object.cur) || object.default || object.cur  // 原图片地址
        },
        onChange: this._bind(function (result, width, height,pos) {
          this._set(object.cur, result[0].serverPath);
          if (object.onChange) object.onChange.call(this, result, width, height, pos);
        }),
        onCancel: this._bind(function(){
          if (object.onCancel){
            object.onCancel.call(this);
          }
        })
      });
      return false;
    }));
  }
}
