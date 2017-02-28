/**
 * @description leave
 * @class leave
 * @author yongjin<zjut_wyj@163.com> 2015/8/19
 */
// 配置退出浏览器执行的方法
if (CONST.ON_BEFORE_UNLOAD) {
  window.onbeforeunload = function () {
    // 判断需要提示的页面
    if (window.location.hash.indexOf('#/design_center') > -1) {
      return '您将要离开编辑页面，如果您尚未保存，请不要离开！';
    }
  };
}