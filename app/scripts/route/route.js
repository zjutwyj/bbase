/**
 * @description 路由
 * @class route
 * @author yongjin<zjut_wyj@163.com> 2015/6/22
 */
var b_routes = { routes: { '': 'manage' }, defaults: function () {} };
UTIL.each(Bbase.ROUTE, function (value, key) {
  var fnName = key.replace(/\//g, '');
  b_routes.routes[key] = fnName;
  b_routes[fnName] = UTIL.inject(value, function (id, callback, pass) {
    var pass = true;
    var ctx = this;
    BbaseApp.emptyDialog();
    var result = FILTER['navigator'].apply(ctx, ['#/' + key]);
    if (BbaseEst.typeOf(result) !== 'undefined' && !result) {
      pass = false;
    }
    if (!pass) return false;
    return new UTIL.setArguments(arguments, pass);
  }, function (id, callback) {
    if (!arguments[arguments.length - 1]) {
      BbaseUtils.removeLoading();
    }
  });
});
