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
Bbase.MODULE['DemoListScrollbar'] = 'modules/demo/controllers/DemoListScrollbar.js';

Bbase.MODULE['DemoTable'] = 'modules/demo/controllers/DemoTable.js';
Bbase.MODULE['DemoTableDynamic'] = 'modules/demo/controllers/DemoTableDynamic.js';
