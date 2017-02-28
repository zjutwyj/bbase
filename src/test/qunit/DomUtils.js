/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module( "【DomUtils】" );

/*QUnit.test("Est.clearAllNode", function(assert){
    Est.clearAllNode(document.getElementById("clearAllNodeDiv"));
    var size = $("#clearAllNodeDiv span").size();
    assert.equal(size,  0, 'passed!');
});*/

QUnit.test("center -> 2ms*2", function(assert){
	var result = Est.center(1000, 800, 100, 50);
	var result2 = Est.center('1000.8', '800', '100', '50');
	assert.deepEqual(result, {left:450, top:375}, 'passed!');
	assert.deepEqual(result2, {left:450, top:375}, 'passed!');
});
