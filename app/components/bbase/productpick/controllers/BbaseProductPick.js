'use strict';
/**
 * @description 模块功能说明
 * @class BbaseProductPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseProductPick', [], function (require, exports, module) {
  var BbaseProductPick;

  var curList = [];
  var productList = [];
  var tempList = [];

  BbaseProductPick = BbaseList.extend({
    initialize() {
      var productIdPath = this.productIdPath = this.options.productIdPath || 'productId';
      var picPathPath = this.picPathPath = this.options.picPathPath || 'picPath';
      var namePath = this.namePath = this.options.namePath || 'name';
      var prodtypePath = this.prodtypePath = this.options.prodtypePath || 'prodtype';
      var addTimePath = this.addTimePath = this.options.addTimePath || 'addTime';
      var domain = this.domain = this.options.domain? (" domain='"+this.options.domain+"'") : '';
      var size = this.size = this.options.size || '5';
      this._super({
        template: `
          <div class="BbaseProductPick-wrap bbase-component-poductpick">
            <div class="cate-nav"><a target="_blank" href="http://www.jihui88.com/member/index.html#/product">&gt;&gt;&nbsp;前往后台管理产品</a></div>
            <div class="plugin-product-header">
            <div class="pro-6"><span class="header-pic">产品图片</span><span>产品名称[型号]</span></div>
              <div class="pro-2"><span>创建时间</span></div>
              <div class="pro-2"><span><input type="text" class="plugin-product-search" placeholder="搜索" bb-model="name" >
              <input type="button" class="search-btn" value="搜索" style="" bb-click="search">
              </span></div>
            </div>
            <div class="plugin-product-list">
                <!---->

              <!---->
            </div>
            <div id="product-pagination"> </div>
            <div id="icon-btns">
              <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover">
              <input type="button" bb-click="save" value="确定" class="submit abutton faiButton faiButton-hover">
            </div>

          </div>
        `,
        model: BbaseModel.extend({
          baseId: 'productId',
          baseUrl: CONST.API + '/product/detail',
          fields: [productIdPath, namePath, picPathPath]
        }),
        collection: BbaseCollection.extend({
          url: this.options.listApi ?
            this.options.listApi.indexOf('http') > -1 ? this.options.listApi : CONST.API + this.options.listApi : CONST.API + '/product/list'
        }),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'product-li',
          template: `
              <div class="plugin-pro-item bui-grid-row-even _item_el_PluginProductList_217882" style="visibility: visible;">
                <div class="pro-6">
                <div class="img-wrap"><img bb-src="{{PIC ${picPathPath} ${size} ${domain} }}"/>&nbsp;</div>
                  <span class="pro-title"><a bb-watch="${productIdPath}:href,${namePath}:html" href="http://www.jihui88.com/member/index.html#/product/{{id2 ${productIdPath}}}" target="_blank">{{${namePath}}}&nbsp;&nbsp;[型号：{{${prodtypePath}}}]</a></span>
                </div>
                <div class="pro-2"><span bb-watch="${addTimePath}:html">{{dateFormat ${addTimePath} 'yyyy-MM-dd hh:mm:ss'}}</span></div>
                <div class="pro-2" style="text-align: right;"><span><input type="button" value="选择" bb-click="add" bb-watch="checked:class" class="{{#if checked}}checked{{/if}}"></span></div>
              </div>
          `,
          initData() {
            return {

            }
          },
          afterShow() {
            var _this = this;
            if (BbaseEst.indexOf(curList, _this._get(productIdPath)) > -1) {
              _this._set('checked', true);
              var dx = BbaseEst.findIndex(productList, function(item){
                return item[productIdPath] === _this._get(productIdPath);
              });
              if (dx === -1) {
                productList.push(_this.model.toJSON(true));
              }
            } else {
              _this._set('checked', false);
            }
          },
          add() {
            var _this = this;
            if (_this._get('checked')) {
              _this._set('checked', false);
              curList.splice(BbaseEst.indexOf(curList, _this._get(productIdPath)), 1);
               var dx = BbaseEst.findIndex(productList, function(item){
                return item[productIdPath] === _this._get(productIdPath);
              });
              productList.splice(dx, 1);
            } else {
              _this._set('checked', true);
              if (BbaseEst.indexOf(curList, _this._get(productIdPath)) === -1) {
                curList.push(_this._get(productIdPath));
                productList.push(_this.model.toJSON(true));
              }
            }
          }
        }),
        render: '.plugin-product-list',
        pageSize: 5,
        diff: true,
        enter: '.search-btn',
        pagination: '#product-pagination'

      });
    },
    initData() {
      this._setDefault(this.namePath, '')
      return {
        cur: '',
        productList: []
      }
    },
    beforeRender() {
      // 保存副本供搜索用
      tempList = BbaseEst.cloneDeep(this._options.items);
      if (BbaseEst.isEmpty(this._get('cur'))) {
        productList = this._get('productList');
        curList = BbaseEst.pluck(productList, this.productIdPath);
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
        this._options.onChange.call(this, curList.join(',').replace(/,,/img, '').replace(/^,/img, ''), productList);
      }
      this._close();
    }

  });

  module.exports = BbaseProductPick;
});
