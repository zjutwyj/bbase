Bbase.MODULE['BbasePhotoBeautify'] = 'components/bbase/photobeautify/controllers/BbasePhotoBeautify.js';
Bbase.MODULE['Xiuxiu'] = 'components/bbase/photobeautify/vendor/xiuxiu.js';

Bbase.DIRECTIVE['bbasecomponentphotobeautify'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
     var viewId = object.viewId || BbaseEst.nextUid('bbasecomponentmusicpick');
    $(selector).click(this._bind(function (e) {
      this._dialog({
        moduleId: 'BbasePhotoBeautify',
        viewId: viewId,
        width: object.width || 876,
        cover: true,
        height: object.height || 542,
        quickClose: true,
        cur: this._get(object.cur) || object.default || object.cur,
        onChange: this._bind(function (result) {
          this._set(object.cur, result[0].serverPath);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
