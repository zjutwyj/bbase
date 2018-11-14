/**
 * radio标签
 *
 * @method [表单] - radio
 * @author wyj 15.1.7
 * @example
 *        {{{radio name='isBest' value=isBest option='{"是": "01", "否": "00"}' }}}
 */
BbaseHandlebars.registerHelper('radio', function(options) {
  var result = [],
    list = $.parseJSON ? $.parseJSON(options.hash.option) : JSON.parse(options.hash.options);
  Est.each(list, function(val, key, list, index) {
    var checked = options.hash.value === val ? 'checked' : '';
    result.push('<label><input id="model' + index + '-' + options.hash.name + '" type="radio" name="' + options.hash.name +
      '" value="' + val + '" ' + checked + '>&nbsp;' + key + '</label>&nbsp;&nbsp;');
  });
  return result.join('');
});

/**
 * checkbox标签
 *
 * @method [表单] - checkbox
 * @author wyj 15.6.19
 * @example
 *      {{{checkbox label='默认' name='isChecked' value=isChecked trueVal='01' falseVal='00' }}}
 */
BbaseHandlebars.registerHelper('checkbox', function(options) {
  var id = options.hash.id ? options.hash.id : (Est.nextUid('model- ') + options.hash.name);
  var random = Est.nextUid('checkbox'); // 随机数
  var icon_style = "font-size: 32px;"; // 图标大小
  var value = Est.isEmpty(options.hash.value) ? options.hash.falseVal : options.hash.value; // 取值
  var isChecked = Est.typeOf(value) === 'boolean' ? value : value === options.hash.trueVal ? true : false; // 是否选中状态
  var defaultClass = isChecked ? 'icon-checkbox' : 'icon-checkboxno';
  var args = ("'" + random + "'"); // 参数

  var result = '<label for="' + id + '"> ' +
    '<input type="checkbox" name="' + options.hash.name + '" id="' + id + '" value="' +
    value + '" ' + (isChecked ? 'checked' : '') + ' true-value="' + options.hash.trueVal +
    '" false-value="' + options.hash.falseVal + '"  class="rc-hidden ' + (options.hash.className || '') + '"> ' +
    options.hash.label +
    '</label>';
  return result;
});

/**
 * select标签
 *
 * @method [表单] - select
 * @author wyj 15.6.22
 * @example
 *      {{{select name='paymentConfit' value=curConfitPanment key='paymentId' text='name' list=paymentConfigList  style="height: 40px;"}}}
 *
 */
BbaseHandlebars.registerHelper('select', function(options) {
  var id = options.hash.id ? options.hash.id : ('model-' + options.hash.name);
  var str = '<select name="' + options.hash.name + '" id="' + id + '"  class="' + (options.hash.className || '') + '" style="' + (options.hash.style || '') + '"> ';
  Est.each(options.hash.list, function(item) {
    var selected = options.hash.value === item[options.hash.key] ? 'selected' : '';
    str += '<option value="' + item[options.hash.key] + '" ' + selected + '>' + item[options.hash.text] + '</option>';
  });
  return str + '</select>';
});

/**
 * 返回background-image: url();
 *
 * @method [样式] - BackgroundImage
 * @param  {string} name       图片地址
 * @param  {int} number     压缩尺寸
 * @param  {object} options
 * @return {string}     => background-image: url(http://img.xxx.com/upload/u/u2/.......png);
 */
BbaseHandlebars.registerHelper('BackgroundImage', function(name, number, options) {
  return ('background-image: url(' + BbaseHandlebars.helpers['PIC'].apply(this, Array.prototype.slice.call(arguments)) + ');');
});

/**
 * 表单元素不可编辑
 * @method [表单] - disabled
 * @author wyj 15.2.1
 * @example
 *      <input type="text" {{disabled 'this.isDisabled'}} />
 */
BbaseHandlebars.registerHelper('disabled', function(expression, options) {
  return BbaseHandlebars.helpers['x'].apply(this, [expression, options]) ? ' disabled=disabled ' : '';
});
