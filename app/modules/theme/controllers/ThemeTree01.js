'use strict';
/**
 * @description 模块功能说明
 * @class ThemeTree01
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('ThemeTree01', [], function (require, exports, module) {
  var ThemeTree01;

  var items = [];

  for (var i = 0; i < 100; i++) {
    if (0 <= i && i < 10) {
      items.push({
        id: i,
        parentId: null,
        name: 'name' + i,
        type: 'type' + i,
        sort: i
      });
    } else if (10 <= i && i < 80) {
      items.push({
        id: i,
        parentId: i % 10,
        name: 'name' + i,
        type: 'type' + i,
        sort: i
      });
    } else if (80 <= i && i < 100) {
      items.push({
        id: i,
        parentId: 2 * 10 + i % 10,
        name: 'name' + i,
        type: 'type' + i,
        sort: i
      });
    }
  }

  ThemeTree01 = BbaseList.extend({
    initialize: function () {
      var theme = BbaseEst.nextUid('ThemeTree01');
      this._super({
        template: `
          <div class="${theme}-wrap">
            <style>
               .${theme}-wrap .tree-list-ul,.${theme}-wrap .tree-list-ul li {list-style:none;}
               .${theme}-wrap .tree-list-ul .bui-grid-row-even {background-color: #FAFAFA; }
               .${theme}-wrap .tree-list-ul .cate-grid {float: left; }
               .${theme}-wrap .tree-list-ul .gird-checkbox {width: 32px; }
               .${theme}-wrap .tree-list-ul .grid-td-tree {width: 270px; float: left; padding-left:5px;}
               .${theme}-wrap .tree-list-ul .cate-grid-cell-inner {padding: 10px 0px; position: relative; overflow: hidden; height: 28px; line-height: 28px; }
               .${theme}-wrap .tree-list-ul .bui-grid-checkBox-container {text-align: center; }
               .${theme}-wrap .tree-list-ul .x-grid-checkbox {width: 13px; height: 20px; display: inline-block; }
               .${theme}-wrap .tree-list-ul input[type=checkbox] {box-sizing: border-box; padding: 0; vertical-align: middle; }
               .${theme}-wrap .tree-list-ul .gird-1 {width: 30px; }
               .${theme}-wrap .tree-list-ul .x-grid-caret {vertical-align: middle; }
               .${theme}-wrap .tree-list-ul .x-caret, .${theme}-wrap .tree-list-ul .x-caret-middle {display: inline-block; height: 0; width: 0; line-height: 0; }
               .${theme}-wrap .tree-list-ul .x-caret-middle {border: 6px solid transparent; }
               .${theme}-wrap .tree-list-ul .x-caret-left-middle {border-left: 6px solid #000; border-right: 0; }
               .${theme}-wrap .tree-list-ul .x-caret-left-gray {border-left-color: #CBCBCB; }
               .${theme}-wrap .tree-list-ul .grid-td-cate-name {width: 200px; } input[type=password], input[type=text], select, textarea {display: inline-block; height: 20px; line-height: 20px; padding: 4px 12px; border: 1px solid #ddd; border-radius: 4px; vertical-align: middle; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; } .${theme}-wrap .tree-list-ul .category-div-1 input.input-middle.pro-cate-name {width: 172px; }
               .${theme}-wrap .tree-list-ul .gird-2 {width: 32px; height: 28px; }
               .${theme}-wrap .tree-list-ul .tree-arrow {width: 20px; margin-left: -5px; display: inline-block; }
               .${theme}-wrap .tree-list-ul .gird-3 {width: 60px; }
               .${theme}-wrap .tree-list-ul .node-tree .category-div-3 {width: auto; }
               .${theme}-wrap .tree-list-ul .node-tree .category-div-3 input.input-middle.pro-cate-name {width: 122px; float: right; }
               .${theme}-wrap .tree-list-ul .x-caret-sub {    border: none; width: 24px; height: 40px; background: url(img/cate-sub.jpg)-1px -6px no-repeat; transform: rotate(-46deg); text-indent: 0px; font-size: 30px; color: #d1cece; padding-top: 10px;}
               .${theme}-wrap .tree-list-ul .x-caret-sub:hover{text-decoration: none;}
               .${theme}-wrap .tree-list-ul .pro-cate-name {float: right; }
            </style>
            <div class="theme-black">
              <div class="form" style="background-color: #fff;padding: 20px;">
                <div id="category-widget" class="jhw-product-category jhw-category-product">
                  <ul class="tree-list-ul category-ul">
                  </ul>
                </div>
              </div>
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
                  <input name="name" value="{{name}}" disabled=""  type="text" class="input-middle pro-cate-name">
                </div>
              </div>
              <!---->
            </div>

            <!-- 以下是自定义内容-->
            <div class="cate-grid">
               <div class="cate-grid-cell-inner">
                 <input type="text" class="text" value="{{type}}" disabled="" />
                 <input type="text" class="text input-short" value="{{sort}}" disabled="" />
               </div>
            </div>
            <!---->

            <ul class="cate-{{grade}}-ul  node-tree" style="clear:both;"></ul>
          `,
          init: function () {
            return {}
          },
          handleChange: function () {
            console.log(this._get('cur'));
          }
        }),
        items: items,
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
    init: function () {
      return {}
    }
  });

  module.exports = ThemeTree01;
});
