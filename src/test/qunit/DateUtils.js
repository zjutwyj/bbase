/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module("【DateUtils】");


QUnit.test("dateFormat -> 4ms*5", function(assert) {

  var format = Est.dateFormat('Thu Jun 19 2014 19:47:52 GMT+0800', 'yyyy-MM-dd');
  var result = '2014-06-19';
  assert.equal(format, result, '1.passed!');


  var format = Est.dateFormat('2015-01-19 19:29:29', 'yyyy-MM-dd');
  var result = '2015-01-19';
  assert.equal(format, result, '2.passed!');

  var format = Est.dateFormat('2015-01-19 19:29:29', 'yyyy-MM-dd hh:mm:ss');
  var result = '2015-01-19 19:29:29';
  assert.equal(format, result, '4.passed!');

  var format = Est.dateFormat('2015/01/19', 'yyyy-MM-dd');
  var result = '2015-01-19';
  assert.equal(format, result, '5.passed!');

  var format2 = Est.dateFormat('1422582859827', 'yyyy-MM-dd');
  assert.equal(format2, '2015-01-30', '3.passed');

});
/*QUnit.test("Est.getDays", function (assert) {
  var days = Est.getDays('2014', '9');
  assert.equal(days, 31, 'passed');
});*/
