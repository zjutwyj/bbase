/**
 * @description 这里用到seajs模块加载机制
 * @namespace config
 * @author yongjin on 2014/7/18
 */

/**
 * seajs 配置
 * */
seajs.config({

  // Sea.js 的基础路径
  base: CONST.HOST,

  // 别名配置
  alias: Bbase.MODULE,

  // 路径配置
  paths: {
    bui: CONST.HOST + '/vendor/bui'
  },

  // 变量配置
  vars: {
    'locale': 'zh-cn'
  },

  // 映射配置
  map: [
    [/lib\/(.*).js/, CONST.LIB_FORDER + '/$1.js'], //['.js', '-min.js'] ,
    [ /^(.*\.(?:css|js|html))(.*)$/i, '$1?' + UTIL.hash(CONST.APP_VERSION)]
  ],

  // 调试模式
  debug: typeof CONST.DEBUG_SEAJS === 'undefined' ? false :
    CONST.DEBUG_SEAJS,

  // 文件编码
  charset: 'utf-8'
});
/**
 * 注册模板
 * */
UTIL.each(Bbase.TEMPLATE, function(value, key) {
  define(key, value);
});
