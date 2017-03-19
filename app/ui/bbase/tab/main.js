/**
 * @description main
 * @class main
 * @author yongjin<zjut_wyj@163.com> 2015/9/6
 */
Bbase.MODULE['BbaseTab'] = 'ui/bbase/tab/controllers/BbaseTab.js';

Bbase.DIRECTIVE['bbaseuitab'] = {
  bind: function (value, selector) {
    var object = this._getObject(value, 'cur');

    this._require(['BbaseTab'], function (BbaseTab) {
      var viewId = object.viewId;

      //var items = [
      //{ text: '最新', nodeId: '#config-prop', sortType: 'addTime' }, // 若存在moduleId,则配置项里require是否为false,都会根据模块类型渲染，el默认为nodeId
      //{ text: '浏览量', nodeId: '#config-global', sortType: 'views', oneRender: false }, // 若存在oneRender: true,则只渲染一次， 否则实时
      //{ text: '转发量', nodeId: '#config-global', sortType: 'mviews', delay: false }, // 是否延迟加载
      //{ text: '反馈量', nodeId: '#config-global', sortType: 'rviews' }
      //];

      this._region(viewId, BbaseTab, {
        el: this.$(selector), // 插入点
        tpl: object.tpl || '<a href="javascript:;">{{text}}</a>', // 模版
        toolTip: object.toolTip, // 是否初始化提示，详见SuperView的_initilize参数说明
        cur: this._get(object.cur) || object.default || object.cur, // 显示当前项内容
        require: object.require, // 是否模块化请求， 默认为true（若去除此配置，items里的nodeId都得改成moduleId）
        theme: object.theme || 'tab-ul-text', // 样式：目前有tab-ul-normal,tab-ul-text,tab-ul-btn,tab-ul-line
        path: object.path || 'value', // 作用域字段
        direction: object.direction || 'h',
        contSelector: object.contSelector, // 【可选】容器选择符
        args: {},
        items: object.items, // 传递给视图的参数, 具体数据见上面
        onChange: BbaseEst.proxy(function (item, init, b, c) { // 点击事件回调
          if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur) && !init) {
            this._set(object.cur, item.value);
          }
          if (object.onChange) {
            return object.onChange.apply(this, [item, init, b, c]);
          }
        }, this),
        postData: object.postData
      });
      if (typeof this.model.attributes[object.cur] !== 'undefined' && !BbaseEst.isEmpty(object.cur)) {
        this._watch([object.cur], '', function () {
          this._view(viewId).setValue(this._get(object.cur));
        });
      }
    });
  }
}
