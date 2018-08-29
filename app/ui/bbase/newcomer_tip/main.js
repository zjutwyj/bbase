Bbase.MODULE['NewcomerTip'] = 'ui/bbase/newcomer_tip/controllers/NewcomerTip.js';

var doNewcomerTip = function(object, selector) {
  var _this = this;
  _this._require(['NewcomerTip'], function(NewcomerTip) {
    var viewId = object.viewId;


     if (object.beforeTip){
      var result = object.beforeTip.call(_this);
      if (BbaseEst.typeOf(result) === 'boolean' && !result){
        return;
      }
     }

    // 可选, 视图形式
    _this._region(viewId, NewcomerTip, {
      el: _this.$(selector),
      cur: _this._get(object.cur) || object.default || object.cur,
      items: _this._get(object.items) || [],
      onChange: _this._bind(function(item, init, event, values) {
        // 回调
        if (object.onChange) {
          return object.onChange.apply(_this, [item, init, event, values]);
        }
      })
    });
  });
}

Bbase.DIRECTIVE['bbaseuinewcomertip'] = {
  bind: function(value, selector) {
    // 引用上下文
    var _this = this;

    // 获取表达式对象, 第二个参数表示忽略取值，多个以数组形式表示
    var object = _this._getObject(value, ['cur', 'items']);
    object.id = object.id || BbaseEst.nextUid('bbaseUid');
    object.viewId = object.viewId || BbaseEst.nextUid('BbaseViewUid');

    // 判断是否已提示过
    var hasTip = false;
    var hasTip = BbaseApp.getSession('_NewcomerTip_', false, true);
    BbaseApp.addSession('_NewcomerTip_', true);
    _this._set(object.cur, false);


    // 可选
    if (typeof _this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
      _this._watch([object.cur], '', function() {
        var showTip = _this._getBoolean(object.cur);
        if (showTip) {
          _this._set(object.cur, false);
          doNewcomerTip.call(_this, object, selector);
        }
      });
    }
    if (BbaseEst.isEmpty(hasTip) || !hasTip) {
      doNewcomerTip.call(_this, object, selector);
    }
  },
  show: function(object, value, selector) {
    // 视图显示后执行
  },
  update: function(name, node, selector, result) {
    // 更新操作
  },
  unbind: function(object) {
    // object里的参数为bind方法里返回的数据
  }
}