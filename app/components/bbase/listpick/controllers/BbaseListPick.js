'use strict';
/**
 * @description 模块功能说明
 * @class BbaseListPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseListPick', [], function(require, exports, module){
  var BbaseListPick;

  BbaseListPick = BbaseList.extend({
    initialize: function(){
      this._super({
        template: `
          <div class="BbaseListPick-wrap bbase-component-listpick">
            <div class="el-bd-main" id="el-bd-main">
                <ul class="el-bd-ul">
                </ul>
            </div>
          </div>
        `,
        model: BbaseModel.extend({

        }),
        collection: BbaseCollection.extend({

        }),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'el-bd-li',
          template: `
            <div class="eye icon bbasefont bbase-correct"></div>
            <div class="checkBox "></div>
            <div class="name">
                <div class="nameVal">
                    <p class="ng-binding" bb-watch="name:html">{{name}}</p>
                    <input bb-model="name" type="text"  maxlength="255" placeholder="请输入名称" class="ng-pristine ng-untouched ng-valid ng-valid-maxlength">
                    <div class="el-bd-btn">
                      <div class="icon icon-reName bbasefont bbase-edit" title="重命名"></div>
                    </div>
                </div>
            </div>
          `
        }),
        render: '.el-bd-ul'
      });
    },
    initData: function(){
      return {
      }
    }
  });

  module.exports = BbaseListPick;
});