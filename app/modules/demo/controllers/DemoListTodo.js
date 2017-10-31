'use strict';
/**
 * @description 模块功能说明
 * @class DemoListTodo
 * @author yongjin<zjut_wyj@163.com> 2016/2/6
 */
define('DemoListTodo', [], function (require, exports, module) {
  var DemoListTodo, template;

  template = `
    <div class="DemoListTodo-wrap" style="padding-left:20px;width:573px;">
      <style type="text/css">
        button {margin: 0; padding: 0; border: 0; background: none; font-size: 100%; vertical-align: baseline; font-family: inherit; font-weight: inherit; color: inherit; -webkit-appearance: none; appearance: none; -webkit-font-smoothing: antialiased; -moz-font-smoothing: antialiased; font-smoothing: antialiased; }
        button, input[type="checkbox"] {outline: none; border: none; }
        .hidden {display: none; }
        .todoapp {background: #fff; margin: 130px 0 40px 0; position: relative; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1); width: 550px; }
        .todoapp input::-webkit-input-placeholder {font-style: italic; font-weight: 300; color: #e6e6e6; }
        .todoapp input::-moz-placeholder {font-style: italic; font-weight: 300; color: #e6e6e6; }
        .todoapp input::input-placeholder {font-style: italic; font-weight: 300; color: #e6e6e6; }
        .todoapp h1 {position: absolute; top: -137px; width: 100%; font-size: 100px; font-weight: 100; text-align: center; color: rgba(175, 47, 47, 0.15); -webkit-text-rendering: optimizeLegibility; -moz-text-rendering: optimizeLegibility; text-rendering: optimizeLegibility; }
        .new-todo, .edit {position: relative; margin: 0; width: 100%; font-size: 24px !important; font-family: inherit; font-weight: inherit; line-height: 1.4em !important; border: 0; outline: none; color: inherit; padding: 6px; height:54px !important; border: 1px solid #999; box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2); box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-font-smoothing: antialiased; font-smoothing: antialiased; }
        .new-todo {padding: 16px 16px 16px 60px; border: none; background: rgba(0, 0, 0, 0.003); box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03); border: none !important; border-top:1px solid #e6e6e6 !important; }
        .todoapp .main {position: relative; z-index: 2; border-top: 1px solid #e6e6e6; }
        label[for='toggle-all'] {display: none; }
        .toggle-all {position: absolute; top: -45px; left: -12px; width: 60px; height: 34px; text-align: center; border: none; }
        .toggle-all:before {content: '❯'; font-size: 22px; color: #e6e6e6; padding: 10px 27px 10px 27px; }
        .toggle-all:checked:before {color: #737373; }
        .todo-list {margin: 0; padding: 0; list-style: none; }
        .todo-list li {position: relative; font-size: 24px; border-bottom: 1px solid #ededed; height:60px; overflow:hidden; }
        .todo-list li:last-child {border-bottom: none; }
        .todo-list li.editing {border-bottom: 1px solid #fff; padding: 0; }
        .todo-list li.editing .edit {display: block; width: 506px; padding: 13px 17px 12px 17px; margin: 0 0 0 43px; }
        .todo-list li.editing .view {display: none; }
        .todo-list li .toggle {text-align: center; width: 40px;height: auto; position: absolute; top: 0; bottom: 0; margin: auto 0; border: none; -webkit-appearance: none; appearance: none; }
        .todo-list li .toggle:after {content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>'); }
        .todo-list li .toggle:checked:after {content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>'); }
        .todo-list li label {white-space: pre-line; word-break: break-all; padding: 15px 60px 15px 15px; margin-left: 45px; display: block; line-height: 1.2; transition: color 0.4s; }
        .todo-list label.completed {color: #d9d9d9; text-decoration: line-through; }
        .todo-list li .destroy {display: none; position: absolute; top: 0; right: 10px; bottom: 0; width: 40px; height: 40px; margin: auto 0; font-size: 30px; color: #cc9a9a; margin-bottom: 11px; transition: color 0.2s ease-out; }
        .todo-list li .destroy:hover {color: #af5b5e; }
        .todo-list li .destroy:after {content: '×'; }
        .todo-list li:hover .destroy {display: block; }
        .todo-list li .edit {display: none; }
        .todo-list li.editing:last-child {margin-bottom: -1px; }
        .todoapp .footer {color: #777; padding: 10px 15px; height: 40px; text-align: center; border-top: 1px solid #e6e6e6; }
        .todoapp .footer:before {content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 50px; overflow: hidden; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2); }
        .todo-count {float: left; text-align: left; }
        .todo-count strong {font-weight: 300; }
        .filters {margin: 0; padding: 0; list-style: none; position: absolute; right: 0; left: 0; }
        .filters li {display: inline; }
        .filters li a {color: inherit; margin: 3px; padding: 3px 7px; text-decoration: none; border: 1px solid transparent; border-radius: 3px; }
        .filters li a.selected, .filters li a:hover {border-color: rgba(175, 47, 47, 0.1); }
        .filters li a.selected {border-color: rgba(175, 47, 47, 0.2); }
        .clear-completed, html .clear-completed:active {float: right; position: relative; line-height: 20px; text-decoration: none; cursor: pointer; position: relative; margin-top:-5px; }
        .clear-completed:hover {text-decoration: underline; }
        .info {margin: 65px auto 0; color: #bfbfbf; font-size: 10px; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); text-align: center; }
        .info p {line-height: 1; }
        .info a {color: inherit; text-decoration: none; font-weight: 400; }
        .info a:hover {text-decoration: underline; }
        @media screen and (-webkit-min-device-pixel-ratio:0) {.toggle-all, .todo-list li .toggle {background: none; }
        .todo-list li .toggle {height: 40px; }
        .toggle-all {-webkit-transform: rotate(90deg); transform: rotate(90deg); -webkit-appearance: none; appearance: none; } }
        @media (max-width: 430px) {.footer {height: 50px; }
        .filters {bottom: 10px; } } .clear-completed:disabled {color: #dfdfdf; }
      </style>

      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" bb-model="newTodo" bb-keyup="addTodo:13$name$value">
        </header>
        <section class="main" bb-show="models.length">
          <input class="toggle-all" type="checkbox" bb-model="allDone" bb-change="checkAll" bb-checked="checked_all">
          <ul class="todo-list" bb-sortable="{handle: '.todo', draggable: '.todo'}">
          </ul>
        </section>
        <footer class="footer">
          <span class="todo-count">
                <strong bb-watch="remaining:html">{{remaining}}</strong> items left
              </span>
          <ul class="filters">
            <li><a href="javascript:;" bb-click="changeRoute('all', 2.6)" bb-watch="visibility:class" class="{{#If visibility=== 'all'}}selected{{/If}}">All</a></li>
            <li><a href="javascript:;" bb-click="changeRoute('active')" bb-watch="visibility:class" class="{{#If visibility === 'active'}}selected{{/If}}">Active</a></li>
            <li><a href="javascript:;" bb-click="changeRoute('completed')" bb-watch="visibility:class" class="{{#If visibility === 'completed'}}selected{{/If}}">Completed</a></li>
          </ul>
          <button class="clear-completed" bb-disabled="remaining===models.length" bb-click="removeCompleted">
            Clear completed
          </button>
        </footer>
      </section>
    </div>
  `;
  window.createItems = function () {
    window.timestart = new Date().getTime();
    var items = [];
    for (var i = 0; i < 6; i++) {
      items.push({ title: i, completed: false });
    }
    return items;
  }
  DemoListTodo = BbaseList.extend({

    initialize() {
      this._super({
        template: template,
        model: BbaseModel.extend({
          fields: ['title', 'completed', 'dx', 'checked']
        }),
        collection: BbaseCollection.extend({}),
        render: '.todo-list',
        items: window.createItems(),
        item: BbaseItem.extend({
          tagName: 'li',
          className: 'todo',
          template: `
            <div class="view">
              <input class="toggle" type="checkbox" bb-checked="completed" bb-model="completed">
              <label bb-watch="completed:class,title:html,dx:html" class="{{#if completed}}completed{{/if}}" bb-dblclick="editTodo">{{title}}</label>
              <button class="destroy" bb-click="_remove"></button>
            </div>
            <input class="edit" type="text" bb-model="title" value="{{pipe 'title'}}" bb-blur="doneEdit" bb-keyup="doneEdit:enter">
          `,
          editTodo() {
            this.beforeEditCache = this._get('title');
            this.$el.addClass('editing');
            this.$('.edit').focus();
          },

          change(type, field){
            this._super().handleItemChange(this.model.toJSON(), this._get('dx'));
          },

          doneEdit() {
            if (BbaseEst.isEmpty(this._get('title'))) {
              this._remove(this._get('dx'));
            }
            this.$el.removeClass('editing');
          }
        })
      });
    },

    init() {
      return {
        'active': '0',
        'remaining': this._options.items.length,
        'visibility': 'all',
        'allDone': false
      }
    },

    change(path) {
      this._set('remaining', this.active().length);
      this._set('allDone', this._get('remaining') === 0 ? true : false);
      if (path === 'newTodo'){
        this._setModels(this.getModels());
      }
    },

    handleItemChange: function(model, dx){
      if(this.filteredTodos) this.filteredTodos[dx] = model;
      this._set('remaining', this.active().length);
      this._set('allDone', this._get('remaining') === 0 ? true : false);
    },

    checkAll() {
      if (this._get('remaining') === 1) return;
      BbaseEst.each(this.filteredTodos, (item)=>{
        item.completed = this._get('allDone');
      });
      this._setModels(this.getModels());
    },

    changeRoute(type, bbb) {
      this._set('visibility', type);
      this._setModels(this.getModels());
    },

    getModels: function(){
      return this[this._get('visibility')]();
    },

    all() {
      return BbaseEst.clone(this.filteredTodos);
    },

    active() {
      return BbaseEst.filter(this.filteredTodos, (model) =>{
        return !model.completed;
      });
    },

    completed() {
      return BbaseEst.filter(this.filteredTodos, (model)=>{
        return model.completed;
      });
    },

    removeCompleted() {
      this._setModels(this.active());
    },

    addTodo(name, value) {
      value = BbaseEst.trim(this._get('newTodo'));
      if (!value) {
        return;
      }
      this.filteredTodos.push({ 'title': value, 'completed': false });
      this._set('newTodo', '');
    },

    afterRender() {
      this.filteredTodos = this._getItems();
      console.log(new Date().getTime() - window.timestart);
    }
  });

  module.exports = DemoListTodo;
});
