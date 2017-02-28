// bb-disabled="models.length"
BbaseApp.addDirective('disabled', {

  bind: function (value, selector) {
    // 为某个字段绑定监听
    this._watch([this._getField(value)], selector + ':disabled');
    // 设置是否失效
    this.$(selector).prop('disabled', this._getBoolean(value));
    // 返回一个编译模板
    // 当没有返回compile时， 系统自动会加上以这个指令的表达式为字符串的模板引擎
    return {
      compile: BbaseEst.compile('{{' + value + '}}')
    }
  },

  // 绑定的字段变化时回调
  update: function (name, node, selector, result) {
    node.prop('disabled', this._getBoolean(result));
  }

});

// bb-src="{{PIC pic_path 120}}"  或 bb-src="pic_path"
BbaseApp.addDirective('src', {

  bind: function (value, selector) {
    var isHbs = false,
      result = '';

    // 判断是否是handlebar模板
    if (value.indexOf('{{') > -1) {
      isHbs = true;
      result = BbaseHandlebars.compile(value)(this.model.attributes);
    } else {
      result = BbaseEst.compile('{{' + value + '}}', this.model.attributes);
    }
    // 替换handlebars编译后的$amp;转译内容
    result = result.replace(/&amp;/img, '&').replace(/\\/img, '/');
    var $node = this.$('[bb-src="' + result + '"]').eq(0);
    if ($node.size() === 0) {
      $node = this.$('[bb-src="' + value + '"]').eq(0);
    }
    $node.attr('src', result);
    $node.attr('bb-src', value);
    $node.addClass('directive_' + BbaseEst.hash('[bb-src="' + value + '"]'));

    // 注意，watch中的选择符必需跟实际dom中的选择符一致
    this._watch([this._getField(value)], '[bb-src="' + value + '"]' + ':src');
  },

  update: function (name, node, selector, result) {
    node.attr('src', result);
  }
});

// bb-sortable="{handle: '.todo', draggable: '.todo'}"
BbaseApp.addDirective('sortable', {
  bind: function (value, selector) {
    var object = this._getObject(value);
    this._require(['BbaseSortable'], function (Sortable) {
      this.sortable = Sortable.create(this.$(selector).get(0), {
        animation: 150,
        handle: object.handle,
        draggable: object.draggable,
        onStart: function ( /**Event*/ evt) {},
        onEnd: this._bind(function ( /**Event*/ evt) {
          if (this._insertOrder) this._insertOrder(evt.oldIndex, evt.newIndex, function () {});
        })
      });
    });
  },
  unbind: function () {
    if (this.sortable & this.sortable.destory) {
      this.sortable.destory();
      this.sortable = null;
    }
  }
});
//bb-uiselect="{viewId: 'getViewId',cur: args.sortType, items: items,target: '#model-value',onChange: handleChange}"
BbaseApp.addDirective('uiselect', {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');
    this._require(['BbaseSelect'], function (Select) {
      var viewId = object.viewId;
      this._region(viewId, Select, {
        el: this.$(selector),
        target: object.target,
        postData: object.postData,
        cur: this._getDefault(object.cur, object.default || ''),
        items: object.items,
        onChange: this._bind(function (item, init, b, c) {
          if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur) && !init) {
            this._set(object.cur, item.value);
          }
          if (object.onChange) {
            return object.onChange.apply(this, [item, init, b, c]);
          }
        })
      });
      if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
        this._watch([object.cur], '', function () {
          this._view(viewId).setValue(this._get(object.cur));
        });
      }
    });
  }
});


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

//bb-uiradio="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
BbaseApp.addDirective('uiradio', {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'radio']);
  }
});

//bb-uicheckbox="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
BbaseApp.addDirective('uicheckbox', {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'checkbox']);
  }
});

//bb-uiitemcheck="{viewId:'radio-form',cur:getCurValue(formId),items:items, onChange: handleChange}"
BbaseApp.addDirective('uiitemcheck', {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'normal']);
  }
});

//bb-uiitemtab="{viewId:'ui-item-tab',cur:getCurValue(formId),items:items, onChange: handleChange}"
BbaseApp.addDirective('uiitemtab', {
  bind: function (value, selector) {
    itemCheck.apply(this, [value, selector, 'tab']);
  }
});

if (typeof Bbase !== 'undefined') {
  BbaseEst.each(Bbase.DIRECTIVE, function (val, key) {
    BbaseApp.addDirective(key, val);
  });
}
