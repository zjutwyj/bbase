/**
 * @description StringUtils
 * @namespace StringUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【StringUtils】");

/*QUnit.test('Est.md5', function(assert){
  var result = Est.md5('aaaa');
  assert.equal(result, '74b87337454200d4d33f80c4663dc5e5', 'passed');
});*/
QUnit.test('hash -> 3ms*2', function(assert) {
  var result = Est.hash('/cmp/proDetail/20');
  assert.equal(result, '707603050', 'passed');
  var result2 = Est.hash('/cmp/proDetail/55');
  assert.equal(result2, '1640990792', 'passed');
});

QUnit.test("nextUid -> 0ms*2", function(assert) {
  var result = Est.nextUid();
  assert.equal(result, '001', 'passed');
  var result2 = Est.nextUid();
  assert.equal(result2, '002', 'passed');
});
QUnit.test("lowercase -> 0ms*3", function(assert) {
  var result = Est.lowercase('LE');
  assert.equal(result, 'le', "passed");
  var result2 = Est.lowercase('');
  assert.equal(result2, '', "passed");
  var result3 = Est.lowercase(null);
  assert.equal(result3, null, "passed");
});

QUnit.test('uppercase -> 0ms*2', function(assert) {
  var result = Est.uppercase('le');
  assert.equal(result, 'LE', 'passed');
  var result2 = Est.uppercase('');
  assert.equal(result2, '', 'passed');
});

/*QUnit.test('Est.repeat("ru by",2) => "ru byru by"', function (assert) {
  var result = Est.repeat("ru by", 2);
  assert.equal(result, 'ru byru by', ' Est.repeat("ru by",2) => ' + Est.repeat("ru by", 2));
});*/

QUnit.test('contains -> 1ms*1', function(assert) {
  var result = Est.contains("aaaaa", "aa");
  assert.equal(result, true, 'passed');
});

QUnit.test("startsWith -> 1ms*5", function(assert) {
  var result = Est.startsWidth('aaa', 'Aa', true);
  assert.equal(result, true, "passed");
  var result2 = Est.startsWidth('aaa', 'Aa', false);
  assert.equal(result2, false, "passed");
  var result3 = Est.startsWidth('aaa', 'Aa', true);
  assert.equal(result3, true, "passed");
  var result4 = Est.startsWidth(null, 'aa', true);
  assert.equal(result4, false, 'passed');
  var result5 = Est.startsWidth(undefined, 'aa', true);
  assert.equal(result5, false, 'passed');
});

QUnit.test("endsWith -> 0ms*1", function(assert) {
  var result = Est.endsWith('aaa', 'aa', true);
  assert.equal(result, true, "passed");
});

QUnit.test("byteLen -> 1ms*1", function(assert) {
  var result = Est.byteLen('sfasf我', 2);
  assert.equal(result, '7', "passed");
});

/*QUnit.test("Est.truncate('aaaaaa', 4, '...'); => a...", function (assert) {
  var result = Est.truncate('aaaaaa', 4, '...');
  assert.equal(result, 'a...', "Est.truncate('aaaaaa', 4, '...'); => " + Est.truncate('aaaaaa', 4, '...'));
});*/

QUnit.test("cutByte -> 1ms*2", function(assert) {
  var result = Est.cutByte('aaaaa', 4, '...');
  assert.equal(result, 'a...', "passed");

  var result = Est.cutByte('abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124 abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124 abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124 abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124 abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124abc一个很长的字符串124',
    30, '...');
  assert.equal(result, 'abc一个很长的字符串124abc一...', 'passed');
});

QUnit.test('stripTagName -> 4ms*2', function(assert) {
  var result = Est.stripTagName(Est.unescapeHTML("&lt;script&gt;a&lt;/script&gt;"), "script", true);
  assert.equal(result, '', 'passed');
  var result2 = Est.stripTagName(Est.unescapeHTML("&lt;script&gt;a&lt;/script&gt;"), "script", false);
  assert.equal(result2, 'a', 'passed');
});

QUnit.test('stripTags -> 1ms*1', function(assert) {
  var result = Est.stripTags("<div>aadivbb</div>");
  assert.equal(result, 'aadivbb', 'passed');
});

QUnit.test("escapeHTML -> 1ms*1", function(assert) {
  var result = Est.escapeHTML('<');
  assert.equal(result, '&lt;', "pased");
});

QUnit.test("unescapeHTML -> 0ms*1", function(assert) {
  var result = Est.unescapeHTML('&lt;');
  assert.equal(result, "<", "passed");
});

QUnit.test("escapeRegExp -> 0ms*1", function(assert) {
  var result = Est.escapeRegExp('aaa/[abc]/');
  assert.equal(result, "aaa\\/\\[abc\\]\\/", "passed");
});

QUnit.test("pad -> 1ms*1", function(assert) {
  var result = Est.pad(5, 10, '0', { prefix: 'prefix' });
  assert.equal(result, 'prefix0005', "passed");
});

QUnit.test("format -> 6ms*2", function(assert) {
  var result = Est.format('Result is #{0}, #{1}', 22, 23);
  assert.equal(result, 'Result is 22, 23', "Est.format('Result is #{0}, #{1}', 22, 23); => " + Est.format('Result is #{0}, #{1}', 22, 23));
  var result = Est.format('#{name} is a #{sex}', { name: 'Jhon', sex: 'man' });
  assert.equal(result, 'Jhon is a man', "Est.format('#{name} is a #{sex}', {name : 'Jhon',sex : 'man'}); => " + Est.format('#{name} is a #{sex}', { name: 'Jhon', sex: 'man' }));
});

QUnit.test("template -> 4ms*7", function(assert) {
  // 字符串
  var result3 = Est.template('hello {{name}}', { name: 'feenan' });
  assert.equal(result3, "hello feenan", "字符串模板 测试通过");

  // 变量嵌套
  var result8 = Est.template('hello {{person.age}}', { person: { age: 50 } });
  assert.equal(result8, "hello 50", "变量嵌套 测试通过");

  // 四则运算
  var result4 = Est.template('(1+2)*age = {{ (1+2)*age}}', { age: 18 });
  assert.equal(result4, "(1+2)*age = 54", "四则运算测试通过");

  // 比较操作符
  var result5 = Est.template('{{1>2}}', {}); // false
  assert.equal(result5, "false", "比较操作符1测试通过");
  var result6 = Est.template('{{age > 18}}', { age: 20 }); // true
  assert.equal(result6, "true", "比较操作符2测试通过");

  // 三元运算符
  var result7 = Est.template('{{ 2 > 1 ? name : ""}}', { name: 'feenan' }); // feenan
  assert.equal(result7, "feenan", "三元运算符测试通过");

  // 综合
  var tmpl1 = '<div id="{{id}}" class="{{(i % 2 == 1 ? " even" : "")}}"> ' +
    '<div class="grid_1 alpha right">' +
    '<img class="righted" src="{{profile_image_url}}"/>' +
    '</div>' +
    '<div class="grid_6 omega contents">' +
    '<p><b><a href="/{{from_user}}">{{from_user}}</a>:</b>{{info.text}}</p>' +
    '</div>' +
    '</div>';
  var result = Est.template(tmpl1, {
    i: 5,
    id: "form_user",
    from_user: "Krasimir Tsonev",
    profile_image_url: "http://www.baidu.com/img/aaa.jpg",
    info: {
      text: "text"
    }
  });
  assert.equal(result, "<div id=\"form_user\" class=\" even\"> " +
    "<div class=\"grid_1 alpha right\">" +
    "<img class=\"righted\" src=\"http://www.baidu.com/img/aaa.jpg\"/>" +
    "</div>" +
    "<div class=\"grid_6 omega contents\">" +
    "<p><b><a href=\"/Krasimir Tsonev\">Krasimir Tsonev</a>:</b>text</p>" +
    "</div>" +
    "</div>", '综合1 测试通过!');

  // 可读性差 放弃
  /*var tmpl2 = '{{ for ( var i = 0; i < users.length; i++ ) { }}' +
   '<li><a href="{{=users[i].url}}">{{=users[i].name}}</a></li>'+
   '{{ } }}';
   var result2 = Est.$template(tmpl2, {
   users : [{ name: "user1", url: "url1" }, { name: "user2", url: "url2" }, { name: "user3", url: "url3" }, { name: "user4", url: "url4" }, { name: "user5", url: "url5" }]
   });
   assert.equal(result2, "<li><a href=\"url1\">user1</a></li>" +
   "<li><a href=\"url2\">user2</a></li>" +
   "<li><a href=\"url3\">user3</a></li>" +
   "<li><a href=\"url4\">user4</a></li>" +
   "<li><a href=\"url5\">user5</a></li>", "for 嵌套测试通过!");*/
});

QUnit.test("trimLeft -> 1ms*1", function(assert) {
  var result = Est.trimLeft('  dd    ');
  assert.equal(result, 'dd    ', "passed");
});

QUnit.test("trimRight -> 1ms*1", function(assert) {
  var result = Est.trimRight('  dd    ');
  assert.equal(result, '  dd', "passed");
});
QUnit.test("trim -> 0ms*2", function(assert) {
  var result = Est.trim('  dd    ');
  assert.equal(result, 'dd', "passed");
  var name;
  var result2 = Est.trim(name);
  assert.equal(result2, null, 'passed');
});
QUnit.test("trimDeep -> 0ms*1", function(assert) {
  var result = Est.trimDeep('a b c');
  assert.equal(result, 'abc', "passed");
});

/*QUnit.test("Est.reverse", function (assert) {
  var result = Est.reverse("abc");
  assert.equal(result, 'cba', 'passed!');
});*/
