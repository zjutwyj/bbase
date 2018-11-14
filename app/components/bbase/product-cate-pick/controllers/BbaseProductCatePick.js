'use strict';
/**
 * @description 模块功能说明
 * @class BbaseProductCatePick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseProductCatePick', [], function(require, exports, module) {
  var BbaseProductCatePick;

  var curList = [];
  var categoryList = [];
  var tempList = [];

  BbaseProductCatePick = BbaseList.extend({
    initialize: function() {
      var categoryIdPath = this.categoryIdPath = this.options.categoryIdPath || 'id';
      var imagePath = this.imagePath = this.options.imagePath || 'image';
      var namePath = this.namePath = this.options.namePath || 'name';
      var parentIdPath = this.parentIdPath = this.options.parentIdPath || 'parentId';
      var domain = this.domain = this.options.domain? (" domain='"+this.options.domain+"'") : '';
      var size = this.size = this.options.size || '5';
      var height = this.options.height ? (this.options.height - 87) : 455;
      var adminUrl = CONST.ADMIN_URL;
      this._super({
        template: `
          <div class="BbaseProductCatePick-wrap bbase-component-product-cate-pick">
            <div class="cate-nav" style="text-align:right;padding-right:18px;"><a target="_blank" href="${adminUrl}/manage_v4/index.html#/category/product">&gt;&gt;&nbsp;前往后台管理分类</a></div>
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
        model: BbaseModel.extend({
          baseId: categoryIdPath,
          baseUrl: CONST.API + '/product/detail',
          fields: [categoryIdPath, namePath, imagePath]
        }),
        collection: BbaseCollection.extend({
          url: this.options.listApi ?
            this.options.listApi.indexOf('http') > -1 ? this.options.listApi : CONST.API + this.options.listApi : CONST.API + '/category/product/list'
        }),
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
                  <span class="input-middle pro-cate-name">{{${namePath}}}</span>
                </div>
              </div>
              <!---->
            </div>

            <!-- 以下是自定义内容-->
            <div class="cate-grid" style="float:right;padding-right:5px;">
               <div class="cate-grid-cell-inner">
                  <input type="button" value="选择" bb-click="add" bb-watch="checked:class" class="{{#if checked}}checked{{/if}}"></span>
               </div>
            </div>
            <!---->

            <ul class="cate-{{grade}}-ul  node-tree" style="clear:both;"></ul>
          `,
          init: function() {
            return {}
          },afterShow() {
            var _this = this;
            if (BbaseEst.indexOf(curList, _this._get(categoryIdPath) +'') > -1) {
              _this._set('checked', true);
              var dx = BbaseEst.findIndex(categoryList, function(item){
                return (item[categoryIdPath] + '')=== (_this._get(categoryIdPath) + '');
              });
              if (dx === -1) {
                categoryList.push(_this.model.toJSON(true));
              }
            } else {
              _this._set('checked', false);
            }
          },
          add() {
            var _this = this;
            if (_this._get('checked')) {
              _this._set('checked', false);
              curList.splice(BbaseEst.indexOf(curList, _this._get(categoryIdPath)), 1);
               var dx = BbaseEst.findIndex(categoryList, function(item){
                return item[categoryIdPath] === _this._get(categoryIdPath);
              });
              categoryList.splice(dx, 1);
            } else {
              _this._set('checked', true);
              if (BbaseEst.indexOf(curList, _this._get(categoryIdPath)) === -1) {
                curList.push(_this._get(categoryIdPath));
                categoryList.push(_this.model.toJSON(true));
              }
            }
          },
          handleChange: function() {
            console.log(this._get('cur'));
          }
        }),
        render: '.tree-list-ul',
        subRender: '.node-tree',
        collapse: '.node-collapse',
        parentId: this.parentIdPath,
        categoryId: this.categoryIdPath,
        rootId: this.parentIdPath, // 一级分类字段名称
        rootValue: null, // 一级分类字段值
        extend: false
      });
    },
    initData() {
      this._setDefault(this.namePath, '')
      return {
        cur: '',
        categoryList: []
      }
    },
    beforeRender() {
      // 保存副本供搜索用
      tempList = BbaseEst.cloneDeep(this._options.items);
      if (BbaseEst.isEmpty(this._get('cur'))) {
        categoryList = this._get('categoryList');
        curList = BbaseEst.pluck(categoryList, this.categoryIdPath);
      } else {
        curList = this._get('cur').split(',');
      }
    },
    search() {
      this._setPage(1);
      this._setParam(this.namePath, this._get(this.namePath));
      if (this._options.items && this._options.items.length > 0){
        this._options.items = BbaseEst.filter(tempList, (item)=>{
          return item[this.namePath].indexOf(this._get(this.namePath))> -1;
        });
      }
      this._reload();

    },
    save() {
      if (this._options.onChange) {
        this._options.onChange.call(this, curList.join(',').replace(/,,/img, '').replace(/^,/img, ''), categoryList);
      }
      this._close();
    }
  });

  module.exports = BbaseProductCatePick;
});