(function(BbaseEst, BbaseApp, BbaseHandlebars, undefined){
// bb-disabled="models.length"
BbaseApp.addDirective('disabled', {

  bind: function (value, selector) {
    var _this = this;
    // 为某个字段绑定监听
    _this._watch([_this._getField(value)], selector + ':disabled');
    // 设置是否失效
    _this.$(selector).prop('disabled', _this._getBoolean(value));
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
    var _this = this;
    var isHbs = false,
      result = '';

    // 判断是否是handlebar模板
    if (value.indexOf('{{') > -1) {
      isHbs = true;
      result = BbaseHandlebars.compile(value)(_this.model.attributes);
    } else {
      result = BbaseEst.compile('{{' + value + '}}', _this.model.attributes);
    }
    // 替换handlebars编译后的$amp;转译内容
    result = result.replace(/&amp;/img, '&').replace(/\\/img, '/');
    var $node = _this.$('[bb-src="' + result + '"]').eq(0);
    if ($node.size() === 0) {
      $node = _this.$('[bb-src="' + value + '"]').eq(0);
    }
    $node.attr('src', result);
    $node.attr('bb-src', value);
    $node.addClass('directive_' + BbaseEst.hash('[bb-src="' + value + '"]'));

    // 注意，watch中的选择符必需跟实际dom中的选择符一致
    _this._watch([_this._getField(value)], '[bb-src="' + value + '"]' + ':src');
  },

  update: function (name, node, selector, result) {
    node.attr('src', result);
  }
});
if (typeof Bbase !== 'undefined') {
  BbaseEst.each(Bbase.DIRECTIVE, function (val, key) {
    BbaseApp.addDirective(key, val);
  });
}
})(window.BbaseEst, window.BbaseApp, window.BbaseHandlebars);
