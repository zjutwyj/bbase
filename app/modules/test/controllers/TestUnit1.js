import Import1 from './Import1';
/**
 * @description 模块功能说明
 * @class TestUnit1
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('TestUnit1', [], function(require, exports, module){
  var TestUnit1;



  debugger

  Import1();

  TestUnit1 = BbaseView.extend({
    initialize: function(){
      this._super({
        template: `
          <div class="TestUnit1-wrap">
            TestUnit1
          </div>
        `
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = TestUnit1;
});