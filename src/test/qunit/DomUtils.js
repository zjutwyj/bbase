/**
 * @description ArrayUtils
 * @namespace ArrayUtils
 * @author yongjin on 2014/6/18
 */
QUnit.module( "【DomUtils】" );

/*QUnit.test("BbaseEst.clearAllNode", function(assert){
    BbaseEst.clearAllNode(document.getElementById("clearAllNodeDiv"));
    var size = $("#clearAllNodeDiv span").size();
    assert.equal(size,  0, 'passed!');
});*/

QUnit.test("center -> 2ms*2", function(assert){
	var result = BbaseEst.center(1000, 800, 100, 50);
	var result2 = BbaseEst.center('1000.8', '800', '100', '50');
	assert.deepEqual(result, {left:450, top:375}, 'passed!');
	assert.deepEqual(result2, {left:450, top:375}, 'passed!');
});
