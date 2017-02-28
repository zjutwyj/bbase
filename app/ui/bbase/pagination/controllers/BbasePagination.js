/**
 * @description BbasePagination
 * @class UI - ui库
 * @author yongjin on 2014/11/6
 */
define('BbasePagination', [],
  function (require, exports, module) {
    var BbasePagination, template;

    template = `
      <ul class="pagination" id="pagination-ul"  style="float:right;margin-top:0px;" currentPage="{{page}}">
    <li class="page-start bui-bar-item bui-inline-block {{#compare page '===' 1}}disabled{{else}}danaiPageNum{{/compare}}" aria-disabled="true"
        id="pageFirst" data-page="1"><a href="javascript:;">首页</a></li>
    <li class="page-pre bui-bar-item bui-inline-block {{#compare page '===' 1}}disabled{{else}}danaiPageNum{{/compare}}" aria-disabled="true"
        id="prev" data-page="{{minus page 1}}"><a href="javascript:;">&lt;</a></li>

    {{#pagination page totalPage 5}}
    <li class="bui-bar-item bui-button-number bui-inline-block {{#compare ../page '!==' this}}danaiPageNum{{else}}active{{/compare}}" data-page="{{this}}" aria-disabled="false" id="{{this}}" aria-pressed="false"><a href="javascript:;">{{this}}</a></li>
    {{/pagination}}
    <li class="page-next bui-bar-item bui-inline-block {{#compare page '===' totalPage}}disabled{{else}}danaiPageNum{{/compare}}" aria-disabled="true"
        id="next" data-page="{{plus page 1}}"><a href="javascript:;">&gt</a></li>
    <li class="page-end bui-bar-item bui-inline-block {{#compare page '===' totalPage}}disabled{{else}}danaiPageNum{{/compare}}" aria-disabled="true"
        id="pageLast" data-page="{{totalPage}}"><a href="javascript:;">尾页</a></li>
    <li class="page-go bui-bar-item-text bui-bar-item bui-inline-block bui-bar-item-text-hover bui-bar-item-hover" style="line-height: 30px; padding-left: 5px;"
        id=""><input type="text" class="input-pageTo control-text" style="padding:4px 0;" value="{{page}}"> <button type="button" class="button button-info pageTo">GO
    </button></li>
    <li class="page-refresh bui-bar-item-text bui-bar-item bui-inline-block bui-bar-item-text-hover bui-bar-item-hover" style="line-height: 30px; padding-left: 10px;">
        <button type="button" class="button button-info reload"><i class="icon-white icon-repeat"></i>刷新
        </button></li>
   <!-- <li class="bui-bar-item bui-inline-block danaiPageNum" aria-disabled="true"
        id="test" data-page="55"><a href="javascript:;">55</a></li>-->
    <li class="page-per-page bui-bar-item bui-inline-block">
        &nbsp;&nbsp;每页显示&nbsp;&nbsp;<select class="per_page_show" value="{{pageSize}}">
        <option value="5" {{#compare pageSize '==' 5}}selected="selected"{{/compare}}>5</option>
        <option value="10" {{#compare pageSize '==' 10}}selected="selected"{{/compare}}>10</option>
        <option value="16" {{#compare pageSize '==' 16}}selected="selected"{{/compare}}>16</option>
        <option value="18" {{#compare pageSize '==' 18}}selected="selected"{{/compare}}>18</option>
        <option value="20" {{#compare pageSize '==' 20}}selected="selected"{{/compare}}>20</option>
        <option value="30" {{#compare pageSize '==' 30}}selected="selected"{{/compare}}>30</option>
        <option value="40" {{#compare pageSize '==' 40}}selected="selected"{{/compare}}>40</option>
        <option value="50" {{#compare pageSize '==' 50}}selected="selected"{{/compare}}>50</option>
        <option value="100" {{#compare pageSize '==' 100}}selected="selected"{{/compare}}>100</option>
        <option value="500" {{#compare pageSize '==' 500}}selected="selected"{{/compare}}>500</option>
        <option value="1000" {{#compare pageSize '==' 1000}}selected="selected"{{/compare}}>1000</option>
        </select>
        &nbsp;条&nbsp;
    </li>
    <li class="page-info bui-bar-item-text bui-bar-item bui-inline-block bui-bar-item-text-hover bui-bar-item-hover" style="line-height: 30px; padding-left: 10px;"
        id="totalCount">{{page}} / {{totalPage}}页, 共{{count}}个</li>
</ul>
    `;

    //分页模板
    var BbasePagination = BbaseBackbone.View.extend({
      tagName: "div",
      events: {
        'change .per_page_show': 'changePerPage',
        'click .reload': 'reload',
        'click .pageTo': 'pageTo'
      },
      template: BbaseHandlebars.compile(template),
      initialize: function () {
        debug('7.BbasePagination.initialize');
        if (!this.model.get('page')) this.model.set('page', 1);
        if (!this.model.get('count')) this.model.set('count', 0);
        if (!this.model.get('pageSize')) this.model.set('pageSize', 16);
        this.render();
      },
      render: function () {
        debug('8.BbasePagination.render');
        var ctx = this;

        this.model.set('totalPage', BbaseEst.getMaxPage(this.model.get('count'), this.model.get('pageSize')));
        var $html = $(this.template(this.model.toJSON()));

        $(".danaiPageNum", $html).bind('click', function () {
          var num = $(this).attr('data-page');
          ctx.toPage(num);
        });

        this.$el.html($html);
        this.$select = this.$('.per_page_show');
        return this;
      },
      changePerPage: function () {
        // 默认从第一页开始
        this.model.set('page', 1);
        this.model.set('pageSize', this.$select.val());
        this.model.trigger('reloadList', this.model);
      },
      toPage: function (num) {
        if (parseInt(num, 10) > this.model.get('totalPage') || parseInt(num, 10) < 1) return;
        this.model.set('page', parseInt(num, 10));
        this.model.trigger('reloadList', this.model);
      },
      reload: function () {
        this.model.trigger('reloadList', this.model);
      },
      pageTo: function () {
        var page = parseInt(BbaseEst.trim(this.$('.input-pageTo').val()), 10);
        if (page > this.model.get('totalPage') || page < 1) return;
        if (BbaseEst.isEmpty(page)) return;
        this.model.set('page', page);
        this.model.trigger('reloadList', this.model);
      }
    });
    module.exports = BbasePagination;
  });
