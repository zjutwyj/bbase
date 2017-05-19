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
        quickClose: true,
        width: 350,
        height: 508,
        data: {
          width: object.width,
          height:object.height,
          cutApi: object.cutApi,
          image: this._get(object.cur) || object.default || object.cur
        },
        onChange: this._bind(function (result, width, height) {
          this._set(object.cur, result[0].serverPath);
          if (object.onChange) object.onChange.call(this, result, width, height);
        })
      });
      return false;
    }));
  }
}
