/**
 * @description main
 * @class main
 * @author yongjin<zjut_wyj@163.com> 2015/4/8
 */
Bbase.MODULE['BbaseItemCheck'] = 'ui/bbase/item_check/controllers/BbaseItemCheck.js';

function itemCheck(value, selector, type) {
  var object = this._getObject(value, 'cur');
  this._require(['BbaseItemCheck'], function (ItemCheck) {
    var viewId = object.viewId;
    var checkAppend = false;
    var checkToggle = false;
    if (type === 'checkbox') {
      checkAppend = true;
      checkToggle = true;
    }
    this._region(viewId, ItemCheck, {
      el: this.$(selector),
      tpl: object.tpl || '<span>{{text}}</span>',
      theme: 'ui-item-check-' + (object.theme || type),
      target: object.target || '',
      path: object.path || 'value',
      cur: this._getDefault(object.cur, object.default || ''),
      checkAppend: BbaseEst.typeOf(object.append) === 'boolean' ? object.append : checkAppend,
      checkToggle: BbaseEst.typeOf(object.toggle) === 'boolean' ? object.toggle : checkToggle,
      items: object.items || [],
      onChange: this._bind(function (item, init, event, values) {
        if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur) && !init) {
          this._set(object.cur, item.value);
        }
        if (object.onChange) {
          return object.onChange.apply(this, [item, init, event, values]);
        }
      })
    });
    if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
      this._watch([object.cur], '', function () {
        this._view(viewId).setValue(this._get(object.cur));
      });
    }
  });
};

//bb-bbaseuiradio="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
Bbase.DIRECTIVE['bbaseuiradio'] = {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'radio']);
  }
}

//bb-bbaseuicheckbox="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
Bbase.DIRECTIVE['bbaseuicheckbox'] = {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'checkbox']);
  }
}

//bb-bbaseuiitemcheck="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
Bbase.DIRECTIVE['bbaseuiitemcheck'] = {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'normal']);
  }
}

//bb-bbaseuiitemtab="{viewId:'ui-item-tab',cur:getCurValue(formId),items:items, onChange: handleChange}"
Bbase.DIRECTIVE['bbaseuiitemtab'] = {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'tab']);
  }
}