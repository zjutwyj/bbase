'use strict';
/**
 * @description 模块功能说明
 * @class TestGetObject
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('TestGetObject', [], function(require, exports, module){
 var TestGetObject, template;

  template = `
     <div class="ComponentCenter-wrap bbase-center" >
      testGetObject
    </div>
  `;

  TestGetObject = BbaseView.extend({
    initialize: function(){
      this._super({
        template: template
      });
    },
    init: function () {
      return {
      }
    },
    afterRender: function () {
      var string = "{name: 'Banner切换效果', field: 'bannerType', type: 'select',items: [{text: '请选择切换效果', value: ''},{text: '切换效果1', value: '01'},{text: '切换效果2', value:'02'}],callbackFn:'handleSelectChange'}";
      console.log(this._getObject(string));
    }
  });

  module.exports = TestGetObject;
});