/**
 * @description BbaseService - 单例模式， 只创建一个实例化对象
 * @class BbaseService - 数据请求
 * @author yongjin<zjut_wyj@163.com> 2015/1/26
 */
(function(BbaseBackbone, BbaseEst, BbaseApp, BbaseUtils, undefined){
var BbaseService = function() {
  if (typeof BbaseService.instance === 'object') {
    return BbaseService.instance;
  }
  BbaseService.instance = this;
}

BbaseService.prototype = {
  /**
   * 基础ajax
   *
   * @method ajax
   * @param options
   * @return {*}
   * @author wyj 15.1.26
   * @example
   *        new BbaseService().ajax(options).done(function (result) {
                if (result.attributes) {
                  ...
                }
              });
   */
  ajax: function(options) {
    var data = BbaseEst.extend({ _method: 'GET' }, options);
    if (options.data){
      data = options.data;
    }
    return $.ajax({
      type: options.type || 'post',
      url: options.url,
      cache: options.cache,
      data: data,
      success: function(result) {}
    });
  },
  /**
   * 初始化树
   *
   * @method initTree
   * @private
   * @param options
   * @param result
   * @author wyj 15.1.26
   */
  initTree: function(options, result) {
    if (options.tree) {
      result.attributes.data = BbaseEst.bulidTreeNode(result.attributes.data, options.rootKey, options.rootValue, {
        categoryId: options.categoryId, // 分类ＩＤ
        belongId: options.belongId, // 父类ＩＤ
        childTag: options.childTag, // 子分类集的字段名称
        sortBy: options.sortBy, // 按某个字段排序
        callback: function(item) {
          if (options.tree) {
            item.text = item[options.text];
            item.value = item[options.value];
          }
        }
      });
    }
  },
  /**
   * 初始化选择框
   *
   * @method initSelect
   * @private
   * @param options
   * @param result
   * @author wyj 15.1.26
   */
  initSelect: function(options, result) {
    if (options.select) {
      BbaseEst.each(result.attributes.data, function(item) {
        item.text = item[options.text];
        item.value = item[options.value];
      });
      if (options.tree) {
        result.attributes.data = BbaseEst.bulidSelectNode(result.attributes.data, 1, {
          name: 'text'
        });
      }
    }
  },
  /**
   * 初始化是否展开
   *
   * @method initExtend
   * @private
   * @param options
   * @param result
   * @author wyj 15.1.27
   */
  initExtend: function(options, result) {
    if (options.extend) {
      result.attributes.data = BbaseEst.extendTree(result.attributes.data);
    }
  },
  /**
   * 添加默认选项
   *
   * @method initDefault
   * @private
   * @param options
   * @param result
   * @author wyj 15.1.27
   */
  initDefault: function(options, result) {
    if (result.attributes && options.defaults && BbaseEst.typeOf(result.attributes.data) === 'array') {
      result.attributes.data.unshift({ text: CONST.LANG.SELECT_DEFAULT, value: options.defaultValue });
    }
  },
  /**
   * 基础工厂类 - 工厂模式，通过不同的url请求不同的数据
   * 注意：这个方法获取的数据是list类型的， 适合列表或下拉框使用
   *
   * @method factory
   * @param options
   * @return {BbaseEst.promise}
   * @author wyj 15.1.26
   * @example
   *      new BbaseService().factory({
              url: '', // 请求地址
              data: { // 表单参数
              },
              session: true, // 永久记录，除非软件版本号更新
              cache: true // 暂时缓存， 浏览器刷新后需重新请求

              select: true, // 是否构建下拉框
              tree: true, // 是否构建树
              extend: true, // 是否全部展开
              defaults： false, // 是否添加默认选项
              defaultValue: '/', // 默认为 /

              // 如果tree为true时， 表示需要构建树， 则需补充以下字段
              rootKey: 'isroot', // 构建树时的父级字段名称
              rootValue: '01', // 父级字段值
              categoryId: 'categoryId', //分类 Id
              belongId: 'belongId', // 父类ID
              childTag: 'cates', // 子集字段名称
              sortBy: 'sort', // 根据某个字段排序

              // 如果select为true时 ，表示需要构建下拉框， 则下面的text与value必填
              text: 'name', // 下拉框名称
              value: 'categoryId', // 下拉框值
            });

   */
  factory: function(options) {
    var ctx = this;
    var $q = BbaseEst.promise;
    var params = '';
    var cacheId = '';
    var result = null;
    var ajaxTimeout = null;

    options = BbaseEst.extend({
      select: false,
      extend: false,
      defaults: false,
      tree: false,
      defaultValue: null,
      timeout: 10000,
      cache: false,
      complete: function(XMLHttpRequest, status) {
        BbaseUtils.removeLoading();
        if (status == 'timeout') {
          ajaxTimeout.abort();
          BbaseUtils.tip('服务器繁忙， 请稍后再试');
        }
      }
    }, options);

    for (var key in options) {
      params += options[key];
    }
    cacheId = '_hash' + BbaseEst.hash(params);

    // localStorage缓存
    if (options.session && !BbaseApp.getData('versionUpdated')) {
      result = BbaseApp.getSession(cacheId);
      if (result) {
        return new $q(function(topResolve, topReject) {
          topResolve(result);
        });
      }
    }
    return new $q(function(topResolve, topReject) {
      if (CONST.DEBUG_LOCALSERVICE) {
        topResolve([]);
      } else {
        ajaxTimeout = ctx.ajax(options).done(function(result) {
          var list = null;

          if (result && result.msgType === 'notLogin') {
            BbaseEst.trigger('checkLogin', null, true);
          }
          if (BbaseEst.typeOf(result) === 'string') {
            if (options.session && result.attributes) {
              BbaseApp.addSession(cacheId, result);
            }
            topResolve(result);
            return;
          }
          if (result.attributes) {
            ctx.initTree(options, result);
            ctx.initSelect(options, result);
            ctx.initExtend(options, result);
          } else {
            result.attributes = result.attributes || {};
            result.attributes.data = [];
          }
          ctx.initDefault(options, result);
          list = result.attributes ? result.attributes.data : result;
          if (options.session && result.attributes) {
            BbaseApp.addSession(cacheId, list);
          }
          topResolve(list);
        });
      }
    });
  },
  /**
   * 基础工厂类 - 工厂模式，通过不同的url请求不同的数据
   * 注意：这个方法获取的数据是从任何类型的
   *
   * @method query
   * @param options
   * @return {BbaseEst.promise}
   * @author wyj 15.1.26
   * @example
   *      new BbaseService().query({
              url: '', // 请求地址
              data: { // 表单参数
              },
              session: true, // 永久记录，除非软件版本号更新
              cache: true // 暂时缓存， 浏览器刷新后需重新请求
            });
   */
  query: function(options) {
    var ctx = this;
    var $q = BbaseEst.promise;
    var params = '';
    var cacheId = '';
    var result = null;
    var ajaxTimeout = null;

    options = BbaseEst.extend({
      cache: false,
      timeout: 10000,
      complete: function(XMLHttpRequest, status) {
        BbaseUtils.removeLoading();
        if (status == 'timeout') {
          ajaxTimeout.abort();
          BbaseUtils.tip('服务器繁忙， 请稍后再试');
        }
      }
    }, options);

    for (var key in options) {
      params += options[key];
    }
    cacheId = '_hash' + BbaseEst.hash(params);

    // localStorage缓存
    if (options.session && !BbaseApp.getData('versionUpdated')) {
      result = BbaseApp.getSession(cacheId);
      if (result) {
        return new $q(function(topResolve, topReject) {
          topResolve(result);
        });
      }
    }
    return new $q(function(topResolve, topReject) {
      if (CONST.DEBUG_LOCALSERVICE) {
        topResolve([]);
      } else {
        ajaxTimeout = ctx.ajax(options).done(function(result) {
          if (result.msgType === 'notLogin') {
            BbaseEst.trigger('checkLogin', null, true);
          }
          if (options.session && result) {
            BbaseApp.addSession(cacheId, result);
          }
          topResolve(result);
        });
      }
    });
  }
}
window.BbaseService = BbaseService;
})(window.BbaseBackbone, window.BbaseEst, window.BbaseApp, window.BbaseUtils);

