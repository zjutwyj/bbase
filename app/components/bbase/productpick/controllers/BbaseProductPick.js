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
      this._super({
        template: `
          <div class="BbaseProductPick-wrap bbase-component-poductpick">
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
          fields: ['productId', 'name', 'picPath']
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
                  <img bb-src="{{PIC picPath 5}}">
                  <span class="pro-title"><a bb-watch="productId:href,name:html" href="http://www.jihui88.com/member/index.html#/product/{{id2 productId}}" target="_blank">{{name}}&nbsp;&nbsp;[型号：{{prodtype}}]</a></span>
                </div>
                <div class="pro-2"><span bb-watch="addTime:html">{{dateFormat addTime 'yyyy-MM-dd hh:mm:ss'}}</span></div>
                <div class="pro-2" style="text-align: right;"><span><input type="button" value="选择" bb-click="add" bb-watch="checked:class" class="{{#if checked}}checked{{/if}}"></span></div>
              </div>
          `,
          initData() {
            return {

            }
          },
          afterShow() {
            if (BbaseEst.indexOf(curList, this._get('productId')) > -1) {
              this._set('checked', true);
              if (BbaseEst.findIndex(productList, { productId: this._get('productId') }) === -1) {
                productList.push(this.model.toJSON(true));
              }
            } else {
              this._set('checked', false);
            }
          },
          add() {
            if (this._get('checked')) {
              this._set('checked', false);
              curList.splice(BbaseEst.indexOf(curList, this._get('productId')), 1);
              productList.splice(BbaseEst.findIndex(productList, { productId: this._get('productId') }), 1);
            } else {
              this._set('checked', true);
              if (BbaseEst.indexOf(curList, this._get('productId')) === -1) {
                curList.push(this._get('productId'));
                productList.push(this.model.toJSON(true));
              }
            }
          }
        }),
        render: '.plugin-product-list',
        pageSize: 5,
        diff: true,
        pagination: '#product-pagination'

      });
    },
    initData() {
      return {
        cur: '',
        name: '',
        productList: []
      }
    },
    beforeRender() {
      // 保存副本供搜索用
      tempList = BbaseEst.cloneDeep(this._options.items);
      if (BbaseEst.isEmpty(this._get('cur'))) {
        productList = this._get('productList');
        curList = BbaseEst.pluck(productList, 'productId');
      } else {
        curList = this._get('cur').split(',');
      }
    },
    search() {
      this._setPage(1);
      this._setParam('name', this._get('name'));
      if (this._options.items && this._options.items.length > 0){
        this._options.items = BbaseEst.filter(tempList, (item)=>{
          return item.name.indexOf(this._get('name'))> -1;
        });
      }
      this._reload();

    },
    save() {
      if (this._options.onChange) {
        this._options.onChange.call(this, curList.join(','), productList);
      }
      this._close();
    }

  });

  module.exports = BbaseProductPick;
});
