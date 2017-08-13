Bbase.ROUTE['test'] = function () {
  seajs.use(['TestCenter'], function (TestCenter) {
    BbaseApp.addRegion('TestCenter', TestCenter, {
      el: '#app-main'
    });
  });
}
Bbase.MODULE['TestCenter'] = 'modules/test/controllers/TestCenter.js';
Bbase.MODULE['TestUnit1'] = 'modules/test/controllers/TestUnit1.js';