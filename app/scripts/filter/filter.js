/**
 * @description 过滤器
 * @class filter - 过滤器
 * @author yongjin<zjut_wyj@163.com> 2015/6/22
 */

var FILTER = {
  // 导航改变时
  navigator: function (name) {
    if (typeof BbaseApp !== 'undefined') {
      BbaseApp.emptyDialog();
      if (name.indexOf('design_center') === -1 && name.indexOf('member_register') === -1 && !CONST.USER.username) {
        //BbaseEst.trigger('accountRender', {});
      }
      BbaseUtils.addLoading();
    }
  }
}
