/**
 * @description BbaseUtils
 * @class BbaseUtils - 底层工具类
 * @author yongjin<zjut_wyj@163.com> 2015/1/27
 */
(function(BbaseBackbone, BbaseEst, BbaseApp, undefined){
var BbaseUtils = {
  /**
   * 对话框
   *
   * @method [对话框] - dialog
   * @param options [title: ][width: ][height: ][target: ][success: 确定按钮回调]
   * @author wyj 14.12.18
   * @example
   *      BbaseUtils.dialog({
   *         id: 'copyDialog',
   *         title: '复制图片',
   *         target: '.btn-email-bind',
   *         width: 800,
   *         quickClose: true, // 点击空白处关闭对话框
   *         hideCloseBtn: false, // 是否隐藏关闭按钮
   *         content: this.copyDetail({
   *           filename: this.model.get('filename'),
   *           serverPath: this.model.get('serverPath')
   *         }),
   *         cover: true, // 是否显示遮罩
   *         onshow: function(){// 对话框显示时回调
   *         },
   *         load: function(){ // iframe载入完成后回调
   *           ...base.js
   *         },
   *         success: function(){// 按确定按钮时回调
   *           this.close();
   *         }
   *       });
   */
  dialog: function(options) {
    var button = options.button || [];
    seajs.use(['BbaseDialog'], function(dialog) {
      if (options.success) {
        button.push({
          value: CONST.LANG.CONFIRM,
          autofocus: true,
          callback: function() {
            options.success.apply(this, arguments);
          }
        });
      }
      if (!options.hideCloseBtn) {
        button.push({
          value: CONST.LANG.CLOSE,
          callback: function() {
            this.close().remove();
          }
        });
      }
      options = BbaseEst.extend({
        id: options.id || options.moduleId || BbaseEst.nextUid('dialog'),
        title: CONST.LANG.DIALOG_TIP,
        width: 150,
        content: '',
        button: button
      }, options);
      if (options.target) {
        options.target = $(options.target).get(0);
      }
      options.oniframeload = function() {
        try {
          this.iframeNode.contentWindow.topDialog = thisDialog;
          this.iframeNode.contentWindow.app = app;
          delete BbaseApp.getRoutes().index;
        } catch (e) {}
        if (typeof options.load === 'function') {
          options.load.call(this, arguments);
        }
      };
      if (options.cover) {
        //options.quickClose = false;
        BbaseApp.addDialog(dialog(options), options.viewId || options.dialogId).showModal(options.target);
      } else {
        BbaseApp.addDialog(dialog(options), options.viewId || options.dialogId).show(options.target);
      }
    });
  },
  /**
   * 提示信息
   *
   * @method [对话框] - initTip
   * @param msg
   * @param options
   * @author wyj 14.12.18
   * @example
   *      BbaseUtils.tip('提示内容', {
   *        time: 1000,
   *        title: '温馨提示'
   *      });
   */
  tip: function(msg, options) {
    options = BbaseEst.extend({
      id: 'tip-dialog' + BbaseEst.nextUid(),
      time: 3000,
      content: '<div style="padding: 10px;">' + msg + '</div>',
      title: null
    }, options);
    seajs.use(['BbaseDialog'], function(dialog) {
      if (window.tipsDialog) window.tipsDialog.close().remove();
      window.tipsDialog = BbaseApp.addDialog(dialog(options)).show(options.target);
      setTimeout(function() {
        window.tipsDialog.close().remove();
      }, options.time);
    });
  },
  /**
   * 确认框， 比如删除操作
   *
   * @method [对话框] - confirm
   * @param opts [title: 标题][content: 内容][success: 成功回调]
   * @author wyj 14.12.8
   * @example
   *      BbaseUtils.confirm({
   *        title: '提示',
   *        target: this.$('.name').get(0),
   *        content: '是否删除?',
   *        success: function(){
   *          ...
   *        },
   *        cancel: function(){
   *          ...
   *        }
   *      });
   */
  confirm: function(opts, context) {
    var options = {
      title: CONST.LANG.WARM_TIP,
      content: CONST.LANG.DEL_CONFIRM,
      success: function() {},
      target: null
    };
    BbaseEst.extend(options, opts);
    if (!context) context = this;
    seajs.use(['BbaseDialog'], function(dialog) {
      window.comfirmDialog = BbaseApp.addDialog(dialog({
        id: 'dialog' + BbaseEst.nextUid(),
        title: options.title,
        cover:options.cover,
        content: '<div style="padding: 20px;">' + options.content + '</div>',
        width: options.width || 200,
        button: [{
          value: opts.successValue || CONST.LANG.CONFIRM,
          autofocus: true,
          callback: function() {
            if (options.success) options.success.call(context);
          }
        }, {
          value: opts.cancelValue || CONST.LANG.CANCEL,
          callback: function() {
            window.comfirmDialog.close().remove();
            if (options.cancel) options.cancel.call(context);
          }
        }],
        onClose: function() {
          if (options.cancel) options.cancel.call(context);
        }
      })).show(options.target);
    });
  },
  /**
   * 添加加载动画
   * @method [加载] - addLoading
   * @param optoins
   * @author wyj 15.04.08
   * @example
   *      BbaseUtils.addLoading();
   */
  addLoading: function(options) {
    try {
      if (window.$loading) window.$loading.remove();
      window.$loading = $('<div id="loading" class="loading"><div class="object" id="object_one">' +
        '</div><div class="object" id="object_two"></div><div class="object" id="object_three"></div></div>');
      $('body').append(window.$loading);
      if (window.$loading_timer){
        clearTimeout(window.$loading_timer);
      }
      window.$loading_timer = setTimeout(function(){
        BbaseUtils.removeLoading();
      }, 30000);
    } catch (e) {}
    return window.$loading;
  },
  /**
   * 移除加载动画
   * @method [加载] - removeLoading
   * @author wyj 15.04.08
   * @example
   *      BbaseUtils.removeLoading();
   */
  removeLoading: function(options) {
    if (window.$loading) window.$loading.remove();
    else $('.loading').remove();
  },

  addRegionLoading: function($node, options){
    var options = options || {};
    var rloading = BbaseEst.nextUid('rloaing');
    var color = CONST.LIGHT_COLOR || CONST.MAIN_COLOR || '#666';
    var bgColor = options.backgroundColor || '#fff';
    $node.attr('data-rloading', rloading);
    var html = "<div style=\"background-color: " + bgColor+";z-index: 9999999999999999999; position: relative;\"> <svg version=\"1.1\" id=\""+rloading+"\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"40px\" height=\"40px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\"> <path fill=\"" + color+ "\" d=\"M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z\"> <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"rotate\" from=\"0 25 25\" to=\"360 25 25\" dur=\"0.6s\" repeatCount=\"indefinite\"/> </path> </svg> </div>";
    $node.append($(html));
  },

  removeRegionLoading: function($node){
    $node.find('#' + $node.attr('data-rloading')).remove();
  },

  getItem: function(doc, obj) {
    try {
      for (var i = 0, ci; ci = this.tmpList[i++];) {
        if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
          return ci;
        }
      }
    } catch (e) {
      return null;
    }

  },
  /**
   * 加载资源
   * @param  {[type]}   doc [description]
   * @param  {[type]}   obj [description]
   * @param  {Function} fn  [description]
   * @return {[type]}       [description]
   * @example
   *
   *  BbaseUtils.loadFile(document, {
          href: CONST.HOST + "/vendor/flatpickr/flatpickr.min.css",
          rel: 'stylesheet',
          tag: "link",
          type: "text/css",
          defer: "defer"
        }, function() {
          $(".publishTime").flatpickr({
            minuteIncrement:1,
            onChange: function(selectedDates, dateStr, instance) {
              ctx.model.set('publishTime', dateStr);
            },
            onClose: function(selectedDates, dateStr, instance){
              ctx.model.set('publishTime', dateStr);
            }
          });
          $(".unpublishTime").flatpickr({
            minuteIncrement:1,
            onChange: function(selectedDates, dateStr, instance) {
              ctx.model.set('unpublishTime', dateStr);
            },
            onClose: function(selectedDates, dateStr, instance){
              ctx.model.set('unpublishTime', dateStr);
            }
          });
        });
   */
  loadFile: function(doc, obj, fn) {
    var ctx=this;
    ctx.tmpList = ctx.tmpList || [];
    var item = ctx.getItem(doc, obj);
    if (item) {
      if (item.ready) {
        fn && fn();
      } else {
        item.funs.push(fn)
      }
      return;
    }
    ctx.tmpList.push({
      doc: doc,
      url: obj.src || obj.href,
      funs: [fn]
    });
    if (!doc.body) {
      var html = [];
      for (var p in obj) {
        if (p == 'tag') continue;
        html.push(p + '="' + obj[p] + '"')
      }
      doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></' + obj.tag + '>');
      return;
    }
    if (obj.id && doc.getElementById(obj.id)) {
      return;
    }
    var element = doc.createElement(obj.tag);
    delete obj.tag;
    for (var p in obj) {
      element.setAttribute(p, obj[p]);
    }
    element.onload = element.onreadystatechange = function() {
      if (!this.readyState || /loaded|complete/.test(this.readyState)) {
        item = ctx.getItem(doc, obj);
        if (item.funs.length > 0) {
          item.ready = 1;
          for (var fi; fi = item.funs.pop();) {
            fi();
          }
        }
        element.onload = element.onreadystatechange = null;
      }
    };
    element.onerror = function() {
      throw Error('The load ' + (obj.href || obj.src) + ' fails')
    };
    doc.getElementsByTagName("head")[0].appendChild(element);
  },
  /**
   * 调用方法 - 命令模式[说明， 只有在需要记录日志，撤销、恢复操作等功能时调用该方法]
   *
   * @method [调用] - execute ( 调用方法 )
   * @param name
   * @return {*}
   * @author wyj 15.2.15
   * @example
   *      BbaseUtils.execute( "initSelect", {
   *        ...
   *      }, this);
   */
  execute: function(name) {
    return BbaseUtils[name] && BbaseUtils[name].apply(BbaseUtils, [].slice.call(arguments, 1));
  }
};
window.BbaseUtils = BbaseUtils;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp);

