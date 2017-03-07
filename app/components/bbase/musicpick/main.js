Bbase.MODULE['BbaseMusicPick'] = 'components/bbase/musicpick/controllers/BbaseMusicPick.js';
Bbase.DIRECTIVE['bbasecomponentmusicpick'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    $(selector).click(this._bind(function (e) {
      this._dialog({
        moduleId: 'BbaseMusicPick',
        width: object.width || 876,
        cover: true,
        height: object.height || 542,
        items: object.items,
        listApi: object.listApi,
        detailApi: object.detailApi,
        cache: object.cache,
        session: object.session,
        quickClose: true,
        onChange: this._bind(function (result) {
          this._set(object.cur, result[0].serverPath);
          if (object.onChange) object.onChange.call(this, result);
        })
      });
      return false;
    }));
  }
}
