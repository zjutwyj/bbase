/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module( "【FormUtils】" );

QUnit.test("validation -> 26ms*6", function(assert){
    var number = '12.8';
    var email = 'aaa@163.com';
    var cellphone = '13583433234';
    var cellphone2 = '15058660033';
    var digits = '39';
    var url = 'http://www.eqil.com';

    var result_n = Est.validation(number, 'number');
    var result_e = Est.validation(email, 'email');
    var result_c = Est.validation(cellphone, 'cellphone');
    var result_c2 = Est.validation(cellphone2, 'cellphone');
    var result_d = Est.validation(digits, 'digits');
    var result_u = Est.validation(url, 'url');

    assert.ok(result_n, 'passed!');
    assert.ok(result_e, 'passed!');
    assert.ok(result_c, 'passed!');
    assert.ok(result_c2, 'passed!');
    assert.ok(result_d, 'passed!');
    assert.ok(result_u, 'passed!');
});