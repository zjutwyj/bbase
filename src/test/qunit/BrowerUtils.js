/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【BrowerUtils】");

QUnit.test("msie -> 1ms*1", function(assert) {
  var result = BbaseEst.msie();
  assert.equal(result, false, "passed!");
});
QUnit.test("getUrlParam -> 1ms*1", function(assert) {
  var url = "http://www.zket.net?name=zjut";
  var name = BbaseEst.getUrlParam('name', url);
  var result = 'zjut';
  assert.equal(name, result, "passed!");
});
QUnit.test("urlResolve -> 1ms*1", function(assert) {
  var obj = BbaseEst.urlResolve(window.location.href);
  assert.deepEqual(obj, {
  "hash": "",
  "host": "www.bbase.com",
  "hostname": "www.bbase.com",
  "href": "http://www.bbase.com/test/Est_qunit.html",
  "pathname": "/test/Est_qunit.html",
  "port": "",
  "protocol": "http",
  "search": ""
}, "passed!");
});
QUnit.test('cookie', function(assert) {
  BbaseEst.cookie('cookie_test', 'aaa');
  assert.equal(BbaseEst.cookie('cookie_test'), 'aaa', 'passed');
});

/*QUnit.test('BbaseEst.keyRoute', function(assert) {
  var piece = {
    "route1": function(data) {
      return "route1" + data;
    },
    "route2": function(data) {
      return "route2" + data;
    }
  }
  var result = BbaseEst.keyRoute(piece, "route2", "route");
  assert.equal(result, 'route2route', 'passed');
});*/
QUnit.test('cookie -> 4ms*1', function(assert) {
  BbaseEst.cookie('name', 'value');
  assert.equal(BbaseEst.cookie('name'), 'value', 'passed');
});

QUnit.test('setUrlParam -> 1ms*3', function(assert) {
  var url = "http://www.xxx.com/wcd/html/78.html";
  url = BbaseEst.setUrlParam('belongId', '008', url);
  assert.equal(url, 'http://www.xxx.com/wcd/html/78.html?belongId=008', 'passed');

  url = BbaseEst.setUrlParam('code', 'DFEWFGEWFWEF', url);
  assert.equal(url, 'http://www.xxx.com/wcd/html/78.html?belongId=008&code=DFEWFGEWFWEF', 'passed');

  url = BbaseEst.setUrlParam('belongId', '009', url);
  assert.equal(url, 'http://www.xxx.com/wcd/html/78.html?belongId=009&code=DFEWFGEWFWEF', 'passed');

});
