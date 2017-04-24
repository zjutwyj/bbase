Bbase.MODULE['DemoCenter'] = 'modules/demo/controllers/DemoCenter.js';
Bbase.ROUTE['demo'] = function () {
  seajs.use(['BbaseJquery', 'DemoCenter'], function (BbaseJquery, DemoCenter) {
    BbaseApp.addRegion('DemoCenter', DemoCenter, {
      el: '#app-main'
    });
  });
};

Bbase.MODULE['DemoList'] = 'modules/demo/controllers/DemoList.js';
Bbase.MODULE['DemoListTodo'] = 'modules/demo/controllers/DemoListTodo.js';