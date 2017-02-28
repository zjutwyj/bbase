/**
 * @description Service
 * @class Service
 * @author yongjin<zjut_wyj@163.com> 2014/12/17
 */
var SERVICE = {
  logout: function (options) {
    new BbaseService().factory({
      url: CONST.API + '/user/logout'
    }).then(function (result) {
      CONST.USER = {};
      BbaseEst.trigger('accountRender', {});
    });
  },
  initUserTest: function () {
    CONST.USER = {
      username: 'user01'
    };
    return {
      done: function (fn) {
        fn({
          attributes: {
            data: {
              username: 'user01'
            }
          },
          success: true,
          msg: ''
        });
      }
    }
  },
  initUser: function (model, stop) {
    var userModel = new model();
    userModel.hideTip = true;
    userModel.stopCheckLogin = stop;
    return userModel.fetch({
      wait: true,
      timeout: 5000,
      success: function (data) {
        if (data.attributes && data.attributes._response) {
          CONST.USER = {};
        } else {
          CONST.USER = data.attributes;
        }
      },
      error: function () {}
    });
  }
};
