'use strict';
/**
 * @description 模块功能说明
 * @class BbaseNewsPick
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseNewsPick', [], function (require, exports, module) {
  var BbaseNewsPick;

  var curList = [];
  var newsList = [];
  var tempList = [];

  BbaseNewsPick = BbaseList.extend({
    initialize() {
      var newsIdPath = this.newsIdPath = this.options.newsIdPath || 'newsId';
      var picPathPath = this.picPathPath = this.options.picPathPath || 'picPath';
      var titlePath = this.titlePath = this.options.titlePath || 'title';
      var originPath = this.originPath = this.options.originPath || 'origin';
      var addTimePath = this.addTimePath = this.options.addTimePath || 'addTime';
      var domain = this.domain = this.options.domain? (" domain='"+this.options.domain+"'") : '';
      var size = this.size = this.options.size || '5';
      this._super({
        template: `
          <div class="BbaseNewsPick-wrap bbase-component-newspick">
          <div class="cate-nav"><a target="_blank" href="http://www.jihui88.com/member/index.html#/news">&gt;&gt;&nbsp;前往后台管理新闻</a></div>
            <div class="plugin-news-header">
            <div class="pro-6"><span class="header-pic">新闻图片</span><span>新闻标题[来源]</span></div>
              <div class="pro-2"><span>创建时间</span></div>
              <div class="pro-2"><span><input type="text" class="plugin-news-search" placeholder="搜索" bb-model="title" >
              <input type="button" class="search-btn" value="搜索" style="" bb-click="search">
              </span></div>
            </div>
            <div class="plugin-news-list">
                <!---->

              <!---->
            </div>
            <div id="news-pagination"> </div>
            <div id="icon-btns">
              <input type="button" bb-click="_close" value="取消" class="cancel abutton faiButton faiButton-hover">
              <input type="button" bb-click="save" value="确定" class="submit abutton faiButton faiButton-hover">
            </div>

          </div>
        `,
        model: BbaseModel.extend({
          baseId: 'newsId',
          baseUrl: CONST.API + '/news/detail',
          fields: [newsIdPath, titlePath, picPathPath]
        }),
        collection: BbaseCollection.extend({
          url: this.options.listApi ?
            this.options.listApi.indexOf('http') > -1 ? this.options.listApi : CONST.API + this.options.listApi : CONST.API + '/news/list'
        }),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'news-li',
          template: `
              <div class="plugin-news-item bui-grid-row-even _item_el_PluginProductList_217882" style="visibility: visible;">
                <div class="pro-6">
                <div class="img-wrap"><img bb-src="{{PIC ${picPathPath} ${size} ${domain} }}"/>&nbsp;</div>
                  <span class="news-title"><a bb-watch="${newsIdPath}:href,${titlePath}:html" href="http://www.jihui88.com/member/index.html#/news/{{id2 ${newsIdPath}}}" target="_blank">{{${titlePath}}}&nbsp;&nbsp;[来源：{{${originPath}}}]</a></span>
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
            if (BbaseEst.indexOf(curList, _this._get(newsIdPath)) > -1) {
              _this._set('checked', true);
              var dx = BbaseEst.findIndex(newsList, function(item){
                return item[newsIdPath] === _this._get(newsIdPath);
              });
              if (dx === -1) {
                newsList.push(_this.model.toJSON(true));
              }
            } else {
              _this._set('checked', false);
            }
          },
          add() {
            var _this = this;
            if (_this._get('checked')) {
              _this._set('checked', false);
              curList.splice(BbaseEst.indexOf(curList, _this._get(newsIdPath)), 1);
               var dx = BbaseEst.findIndex(newsList, function(item){
                return item[newsIdPath] === _this._get(newsIdPath);
              });
              newsList.splice(dx, 1);
            } else {
              _this._set('checked', true);
              if (BbaseEst.indexOf(curList, _this._get(newsIdPath)) === -1) {
                curList.push(_this._get(newsIdPath));
                newsList.push(_this.model.toJSON(true));
              }
            }
          }
        }),
        render: '.plugin-news-list',
        pageSize: 5,
        diff: true,
        enter: '.search-btn',
        pagination: '#news-pagination'

      });
    },
    initData() {
      this._setDefault(this.titlePath, '')
      return {
        cur: '',
        newsList: []
      }
    },
    beforeRender() {
      // 保存副本供搜索用
      tempList = BbaseEst.cloneDeep(this._options.items);
      if (BbaseEst.isEmpty(this._get('cur'))) {
        newsList = this._get('newsList');
        curList = BbaseEst.pluck(newsList, this.newsIdPath);
      } else {
        curList = this._get('cur').split(',');
      }
    },
    search() {
      this._setPage(1);
      this._setParam(this.titlePath, this._get(this.titlePath));
      if (this._options.items && this._options.items.length > 0){
        this._options.items = BbaseEst.filter(tempList, (item)=>{
          return item[this.titlePath].indexOf(this._get(this.titlePath))> -1;
        });
      }
      this._reload();

    },
    save() {
      if (this._options.onChange) {
        this._options.onChange.call(this, curList.join(',').replace(/,,/img, '').replace(/^,/img, ''), newsList);
      }
      this._close();
    }

  });

  module.exports = BbaseNewsPick;
});
