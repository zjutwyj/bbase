'use strict';
/**
 * @description 模块功能说明
 * @class BbaseNavigatorPanel
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('BbaseNavigatorPanel', [], function(require, exports, module) {
  var BbaseNavigatorPanel;

  var BbaseNavigatorDetail = BbaseView.extend({
    initialize() {
      this._super({
        template: `
          <div>
            <div>此处将请求参数里设置的detailModule模块</div>
            <div bb-click="submit">模拟提交按钮</div>
          </div>
        `
      });
    },
    submit() {
      if (this.options.onChange) {
        this.options.onChange.call(this, {});
      }
    }
  });

  BbaseNavigatorPanel = BbaseList.extend({
    initialize: function() {
      var width = typeof this.options.width === 'undefined' ? '252px' : this.options.width + 'px';
      var height = typeof this.options.height === 'undefined' ? 'auto' : this.options.height + 'px';
      var wrapHeight = typeof this.options.height === 'undefined' ? 'auto' : (this.options.height + 75) + 'px';
      this._super({
        template: `
          <div class="BbaseNavigatorPanel-wrap bbase-component-navigator-panel" style="width: ${width};height:${wrapHeight};">
            <div class="navlist" style="width: ${width};height: ${height}" bb-bbaseuiscrollbar="{viewId: 'navigatorpanelscroll',disableMouseMove:true,fadeScrollbars: fadeScrollbars}">
                <ul class="menu-list menu-list-primary ng-pristine ng-untouched ng-valid angular-ui-tree-nodes ng-not-empty" bb-bbaseuisortable="{viewId:'bbaseuinavigatorpanelsortable',onEnd: onSortEnd,handle:'.drag-area'}" ui-tree-nodes="" aria-invalid="false">
              </ul>
            </div>
            <div class="p18-panel-footer" data-hook="panel-footer" ng-if="$ctrl.hasFooter()" ng-transclude="footer">
              <div class="cc-panel-footer">
                <button class="cc-x-height p9a-secondary -inverse add-page-button" bb-click="addPage">
                <span class="cc-x-height">+ 新增栏目</span>
                </button>
              </div>
            </div>
          </div>
        `,
        model: BbaseModel.extend({
          baseId: this.options.baseId || 'navigatorId',
          baseUrl: CONST.API + (this.options.detailApi || '/navigator/detail')
        }),
        collection: BbaseCollection.extend({
          url: this.options.listApi ?
            this.options.listApi.indexOf('http') > -1 ? this.options.listApi : CONST.API + this.options.listApi : CONST.API + '/navigator/list'
        }),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'menu-item angular-ui-tree-node',
          template: `
            <div bb-click="handleChange" bb-watch="selected:class,parentId:class" class="tree-node {{#If selected}}selected-page{{/If}} " role="button" tabindex="0">
                  <div class="bbaseicon cc-icon-subpage" disabled="disabled"></div>
                  <!---->
                  <div class="drag-area angular-ui-tree-handle" ui-tree-handle="">
                    <!---->
                    <div class="bbaseicon cc-icon-drag-small bbasefont bbase-drag" bb-click="stop"></div>
                    <!---->
                  </div>
                  <!---->
                  <form blur="submit" class="page-name-form ng-pristine ng-valid" editable-form="" name="renameForm">
                    <div buttons="no" class="menu-name page-name editable {{#If display!=='s'}}line-through{{/If}}" e-form="renameForm" bb-watch="name:html,display:class,display:html" placeholder="Enter name" tabindex="0">{{name}} {{#If display!=='s'}}[已隐藏]{{/If}}</div>
                  </form>
                  <div class="bbaseicon custom-icon cc-icon-home"></div>
                  <div class="indications">
                    <!---->
                    <div bb-click="openDetailDialog" class="bbaseicon settings-button cc-icon-settings tooltipstered bbasefont bbase-setting" data-hook="page-settings" role="button" tabindex="0"></div>
                    <!---->
                    <!---->
                    <div bb-click="_del" class="bbaseicon delete-button cc-icon-settings tooltipstered bbasefont bbase-delete" data-hook="page-delete" role="button" tabindex="0"></div>
                    <!---->
                  </div>
                </div>
                 <!---->
                <ul class="menu-list ng-pristine ng-untouched ng-valid angular-ui-tree-nodes ng-not-empty node-tree" ui-tree-nodes="" aria-invalid="false" bb-bbaseuisortable="{viewId:'bbaseuinavigatorpanelsortablesub',onEnd: onSortEnd,handle:'.drag-area'}">
                  <!---->
                </ul>
                <!---->
          `,
          initData() {
            return {
              selected: false,
              display: "s"
            }
          },
          openDetailDialog(e) {
            e.stopImmediatePropagation();
            this._dialog({
              title: '修改栏目',
              moduleId: this._super('view')._options.detailModule || BbaseNavigatorDetail,
              width: 500,
              cover: true,
              height: 400,
              data: {
                id: this._get('id'),
                saveBtnName: '保存'
              },
              onChange: this._bind(function(model) {
                var parentId =this._get('parentId');

                this._set(model);
                if (parentId !== model.parentId){
                  this._super('view')._reload();
                }
              })
            });
          },
          onSortEnd(evt, list){
            if (this._super('view')._options.onSortEnd){
              this._super('view')._options.onSortEnd.call(this, evt, list);
            }
          },
          stop(e) {
            e.stopImmediatePropagation();
          },
          handleChange() {
            this._super('view').handleChange(this.model.toJSON(true));
          },
          afterRender() {
            if (!BbaseEst.isEmpty(this._get('parentId'))) {
              this.$el.addClass('sub-page not-managed-page');
            }
          }
        }),
        render: '.angular-ui-tree-nodes',
        subRender: '.node-tree',
        collapse: '.node-collapse',
        parentId: 'parentId',
        categoryId: 'id',
        rootId: 'parentId', // 一级分类字段名称
        rootValue: null, // 一级分类字段值
        extend: true
      });
    },
    initData: function() {
      return {
        curModel: null,
        fadeScrollbars: this._options.fadeScrollbars
      }
    },
    viewUpdate() {
      setTimeout(() => {
        this.handleSelect();
        this.iscroll && this.iscroll.refresh();
      }, 80);
    },
    destroy: function() {
      this.iscroll && this.iscroll.destroy();
    },
    beforeLoad(){
      if (this.loading){
        return false;
      }
      this.loading = true;
    },
    afterLoad(){
      this.loading = false;
    },

    afterRender() {
    },
    handleSelect() {
      if (BbaseEst.isEmpty(this._options.cur) &&  this.collection.models.length>0) {
        this._options.cur = this.collection.models[0].id;
      }
      this.collection.each((view) => {
        view._set('selected', false);
        if (view._get('id') === this._options.cur) {
          this._set('curModel', view.toJSON(true));
          view._set('selected', true);
        } else {
          view._set('selected', false);
        }
      });
    },
    afterShow() {
      this.viewUpdate();
      this._options.onChange && this._options.onChange.call(this, this.collection.models.length > 0 ? this.collection.models[0].attributes:null, true);
    },
    handleChange(model) {
      this._options.cur = model[this._options.path];
      this.handleSelect();
      if (this._options.onChange) {
        this._options.onChange.call(this, model);
      }
    },
    setValue(value){
      if (this._options.cur === value) return;
      this._options.cur = value;
      this.handleSelect();
      if (this._options.onChange) {
        this._options.onChange.call(this, this._get('curModel'));
      }
    },
    onSortEnd(evt,list){
      if (this._options.onSortEnd){
        this._options.onSortEnd.call(this, evt, list);
      }
    },
    addPage() {
      var _this = this;
      _this._dialog({
        title: '新增栏目',
        moduleId: _this._options.detailModule || BbaseNavigatorDetail,
        width: 500,
        cover: true,
        height: 400,
        data: {
          saveBtnName: '保存'
        },
        onChange: function(model) {
          _this._reload();
        }
      });
    }
  });

  module.exports = BbaseNavigatorPanel;
});