'use strict';
/**
 * @description 模块功能说明
 * @class DemoTableDynamic
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoTableDynamic', [], function (require, exports, module) {
  var DemoTableDynamic, template;

  var items = [];
  for (var i = 0; i < 100; i++) {
    items.push({
      content: (i > 9 && i < 21) ? [{ "field": "name", "value": "李四" + i, "label": "姓 名", "type": "text", "wxNick": "匿名", "wxHeadImg": null },{ "field": "mobile", "value": "13588506961", "label": "手 机", "type": "text", "wxNick": "匿名", "wxHeadImg": null }] : [{ "field": "name", "value": "张三" + i, "label": "姓 名", "type": "text", "wxNick": "匿名", "wxHeadImg": null }, { "field": "mobile", "value": "13588506961", "label": "手 机", "type": "text", "wxNick": "匿名", "wxHeadImg": null }, { "field": "address", "value": "浙江绍兴", "label": "地 址", "type": "text", "wxNick": "匿名", "wxHeadImg": null }, { "field": "note", "value": "我要预约", "label": "美食预约", "type": "text", "wxNick": "匿名", "wxHeadImg": null }],
      addTime: new Date().getTime()
    });
  }
  var theme = BbaseEst.nextUid('ThemeTable01');
  template = `
    <div class="DemoTableDynamic-wrap" style="padding:10px; width: 994px;">
      <style>
         /* checkbox */
        .${theme}-wrap .checkboxAll{display: inline-block; height: 42px; padding-top: 8px; line-height: 50px; vertical-align: middle; }
        .${theme}-wrap .td-checkbox .bbase-ui-itemcheck.ui-item-check-checkbox{margin-top: -15px; text-align: center; padding-left: 2px;}
        .${theme}-wrap tr.item-active{background-color: #f4f5f9;}
      </style>
      <div class="formPanel form-demo">
          <div class="anything" style="display: block;">
            <div class="header">
              <div class="formIdArea">
                <span class="checkboxAll" bb-bbaseuicheckbox="{viewId: 'checkAll', cur: checked_all,items: allItems}" bb-click="handleAllChange"></span>
                <span class="name">点到第2页的时候，列数将改变</span>
              </div>
              <div class="excelBtn">
                <span class="formExcelClick"></span>
              </div>
            </div>
            <div class="main">
              <table class="title">
                <tbody>
                  <tr class="header-tr">

                  </tr>
                </tbody>
              </table>
              <table class="content">
                <tbody class="uilist01-tbody">
                </tbody>
              </table>
            </div>
            <div class="footer">
              <div class="pageInfo" >共<span bb-watch="totalPage:html">{{totalPage}}</span>页，<span bb-watch="totalCount:html">{{totalCount}}</span>条记录</div>
              <div class="pageOperate">
                <span bb-watch="page:class" class="prevPage {{#If page===1}}disablePage{{/If}}" bb-click="prevPage" ></span>
                <span class="currentPage"><span bb-watch="page:html">{{page}}</span>/<span bb-watch="totalPage:html">{{totalPage}}</span></span>
                <span bb-watch="page:class" class="nextPage {{#If page===totalPage}}disablePage{{/If}}" bb-click="nextPage"></span>
              </div>
            </div>
          </div>
        </div>
    </div>
  `;

  DemoTableDynamic = BbaseList.extend({
    initialize: function () {
      this._super({
        template: template,
        model: BbaseModel.extend({}),
        collection: BbaseCollection.extend({
          url: CONST.API + '/message/list'
        }),
        item: BbaseItem.extend({
          tagName: 'tr',
          template: `
          <td class="td-checkbox" width="22" bb-bbaseuicheckbox="{viewId: viewId,cur: checked, items: items}"></td>
          <td><span bb-watch="paymentSn:html">{{paymentSn}}</span></td>
          <td><span bb-watch="amount:html">{{amount}}</span></td>
          <td><span bb-watch="nickname:html">{{nickname}}</span></td>
          <td><span bb-watch="addTime:html">{{dateFormat addTime 'yyyy-MM-dd hh:mm'}}</span></td>
          `,
          initData: function(){
            return {
             viewId: 'checkbox' + this.cid,
              items: [{ text: '', value: true }]
            }
          },
          change: function (path) {
            if (path === 'checked') {
              if (BbaseEst.isEmpty(this._get('checked'))) {
                this._set('checked', false);
              }
              if (!this._super('view').stopItemCheck) {
                this._check(this._get('checked'));
              }
            }
          }
        }),
        pagination: true,
        checkAppend: true,
        pageSize: 10,
        diff: true,
        items: items,
        render: '.uilist01-tbody'
      });
    },
    initData: function () {
      return {
         page: 1,
        pageSize: 10,
        totalPage: 0,
        totalCount: 0,
        allItems: [{ text: '全选', value: true }]
      }
    },
    afterLoad: function () {
      this.handleTable();
      this._set({
        'page': this._getPage(),
        'pageSize': this._getPageSize(),
        'totalPage': this._getTotalPage(),
        'totalCount': this._getCount()
      });
    },

    handleTable: function () {
      var max = 0;
      var maxModel = null;
      var models = null;
      var header = '';
      var template = '';

      // 查询最多字段项,并缓存当前列表
      this.collection.each(this._bind(function (model) {
        var content = model._get('content');
        if (content.length > max) {
          max = content.length;
          maxModel = model;
        }
        model._set('content', content);
        BbaseEst.each(content, function (item) {
          model._set(item.field, item.value);
        });
      }));
      models = this._getItems();

      // 构建header与 item.template
      if (!maxModel) return;
      BbaseEst.each(maxModel._get('content'), function (item) {
        if (item.field.indexOf('/') == -1) {
          header += `<td>${item.label}</td>`;
          template += `<td><span bb-watch="${item.field}:html">{{${item.field}}}</span></td>`;
        }
      });
      header += '<td>提交时间</td>';
      template += `<td><span bb-watch="addTime:html">{{dateFormat addTime 'yyyy-MM-dd hh:mm'}}</span></td>`;
      this.$('.header-tr').html(header);
      BbaseApp.addCompileTemp(this.viewId, BbaseHandlebars.compile(this._parseHbs(template)));
      this._empty();
      this._setModels(models);
    },

    // 全选
    handleAllChange: function () {
      var _this = this;
      _this.stopItemCheck = true;
      _this.collection.each(function (model) {
        model._set('checked', _this._get('checked_all'));
        model.view._itemActive({add: true}, _this._get('checked_all'));
      });
      setTimeout(function () {
        _this.stopItemCheck = false;
      }, 50);

    },

    // 分页
    prevPage: function () {
      if (this._getPage() === 1) {
        return;
      }
      this._setPage(this._getPage() - 1);
      this._load();
    },
    nextPage: function () {
      if (this._getTotalPage() === this._getPage()) {
        return;
      }
      this._setPage(this._getPage() + 1);
      this._load();
    }
  });

  module.exports = DemoTableDynamic;
});
