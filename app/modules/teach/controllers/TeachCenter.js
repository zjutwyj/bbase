'use strict';
/**
 * @description 模块功能说明
 * @class TeachCenter
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('TeachCenter', ['template/readme'], function (require, exports, module) {
  var TeachCenter, template;

  template = require('template/readme');

  TeachCenter = BbaseView.extend({
    initialize: function () {
      this._super({
        template: `
<div class="formPanel form-demo bbase-center">
        <div class="anything" style="display: block;">
          <div class="header">
            <div id="formIdArea" class="formIdArea">
              <span class="dataType"></span><span class="name">README.md</span>
            </div>
          </div>
          <div class="main">
            <div class="readme-inner markdown" style="padding: 20px;"></div>
          </div>
          <div class="footer">
            <div class="item-type-title clearfix left" bb-watch="cur:html">end</div>
          </div>
        </div>
      </div>
        `
      });
    },
    afterRender: function () {
      this.$('.readme-inner').html($(template));
      this.$('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
      });
    }
  });

  module.exports = TeachCenter;
});
