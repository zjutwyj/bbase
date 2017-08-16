'use strict';
/**
 * @description 模块功能说明
 * @class BbaseProductCatePick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseProductCatePick', [], function(require, exports, module) {
  var BbaseProductCatePick;

  BbaseProductCatePick = BbaseList.extend({
    initialize: function() {
      var productIdPath = this.productIdPath = this.options.productIdPath || 'productId';
      var picPathPath = this.picPathPath = this.options.picPathPath || 'picPath';
      var namePath = this.namePath = this.options.namePath || 'name';
      var prodtypePath = this.prodtypePath = this.options.prodtypePath || 'prodtype';
      var addTimePath = this.addTimePath = this.options.addTimePath || 'addTime';
      var domain = this.domain = this.options.domain? (" domain='"+this.options.domain+"'") : '';
      var size = this.size = this.options.size || '5';
      var height = this.options.height ? (this.options.height - 67) : 455;
      this._super({
        template: `
          <div class="BbaseProductCatePick-wrap bbase-component-product-cate-pick">
            <div class="theme-black" style="height: ${height}px;overflow:auto;">
              <div class="form" style="background-color: #fff;padding: 10px;">
                <div id="category-widget" class="jhw-product-category jhw-category-product">
                  <ul class="tree-list-ul category-ul">
                  </ul>
                </div>
              </div>
            </div>
            <div id="icon-btns">
              <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover">
              <input type="button" bb-click="save" value="确定" class="submit abutton faiButton faiButton-hover">
            </div>
          </div>
        `,
        model: BbaseModel.extend({}),
        collection: BbaseCollection.extend({}),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'cate-grid-row clearfix',
          template: `
            <div class="grid-td-tree">
              <!---->
              <div class="cate-grid gird-{{level}} ">
                <div class="cate-grid-cell-inner">
                  {{#compare isroot '===' '01'}}
                  <div class="x-grid-caret">
                    <span class="x-caret x-caret-middle x-caret-left x-caret-left-middle pointer node-collapse {{#compare children.length '===' 0}}x-caret-left-gray{{/compare}}"></span>
                  </div>
                  {{/compare}}
                </div>
              </div>
              <!---->
              <!---->
              <div class="cate-grid grid-td-cate-name jhw-category category-div-{{level}}">
                <div class="cate-grid-cell-inner">
                  {{#compare isroot '!==' '01'}} {{#compare children.length '!==' 0}}&nbsp;
                  <div class="tree-arrow"><span class="x-caret x-caret-middle x-caret-left x-caret-left-middle pointer node-collapse"></span></div>
                  {{/compare}} {{/compare}} {{#compare isroot '!==' '01'}} {{#compare ../children.length '===' 0}}
                  <span class="bbasefont bbase-arrowleft x-caret x-caret-middle x-caret-sub cate-{{grade}} x-caret-left-middle pointer node-collapse "></span> {{/compare}} {{/compare}}
                  <span class="input-middle pro-cate-name">{{name}}</span>
                </div>
              </div>
              <!---->
            </div>

            <!-- 以下是自定义内容-->
            <div class="cate-grid">
               <div class="cate-grid-cell-inner">
                  <input type="button" value="选择" bb-click="add" bb-watch="checked:class" class="{{#if checked}}checked{{/if}}"></span>
               </div>
            </div>
            <!---->

            <ul class="cate-{{grade}}-ul  node-tree" style="clear:both;"></ul>
          `,
          init: function() {
            return {}
          },
          handleChange: function() {
            console.log(this._get('cur'));
          }
        }),
        render: '.tree-list-ul',
        subRender: '.node-tree',
        collapse: '.node-collapse',
        parentId: 'parentId',
        categoryId: 'id',
        rootId: 'parentId', // 一级分类字段名称
        rootValue: null, // 一级分类字段值
        extend: false
      });
    },
    initData: function() {
      return {}
    }
  });

  module.exports = BbaseProductCatePick;
});