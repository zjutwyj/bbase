Bbase.MODULE['UiTab'] = 'modules/ui/controllers/UiTab.js';
Bbase.ROUTE['ui_tab'] = function () {
  seajs.use(['BbaseJquery', 'UiTab'], function (BbaseJquery, UiTab) {
    BbaseApp.addRegion('UiTab', UiTab, {
      el: '#app-main'
    });
  });
};
Bbase.MODULE['UiCenter'] = 'modules/ui/controllers/UiCenter.js';
Bbase.ROUTE['demo'] = function () {
  seajs.use(['BbaseJquery', 'UiCenter'], function (BbaseJquery, UiCenter) {
    BbaseApp.addRegion('UiCenter', UiCenter, {
      el: '#app-main'
    });
  });
};

Bbase.MODULE['UiList'] = 'modules/ui/controllers/UiList.js';
Bbase.MODULE['UiForm'] = 'modules/ui/controllers/UiForm.js';
Bbase.MODULE['UiDirective'] = 'modules/ui/controllers/UiDirective.js';
Bbase.MODULE['UiDropDown'] = 'modules/ui/controllers/UiDropDown.js';


Bbase.MODULE['UiList01'] = 'modules/ui/controllers/UiList01.js';