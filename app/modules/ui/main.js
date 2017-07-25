Bbase.MODULE['UiTab'] = 'modules/ui/controllers/UiTab.js';
Bbase.ROUTE['ui_tab'] = function () {
  seajs.use(['BbaseJquery', 'UiTab'], function (BbaseJquery, UiTab) {
    BbaseApp.addRegion('UiTab', UiTab, {
      el: '#app-main'
    });
  });
};
Bbase.MODULE['UiCenter'] = 'modules/ui/controllers/UiCenter.js';
Bbase.ROUTE['ui'] = function () {
  seajs.use(['BbaseJquery', 'UiCenter'], function (BbaseJquery, UiCenter) {
    BbaseApp.addRegion('UiCenter', UiCenter, {
      el: '#app-main'
    });
  });
};

Bbase.MODULE['UiForm'] = 'modules/ui/controllers/UiForm.js';
Bbase.MODULE['UiFormRadio'] = 'modules/ui/controllers/UiFormRadio.js';
Bbase.MODULE['UiFormCheckbox'] = 'modules/ui/controllers/UiFormCheckbox.js';
Bbase.MODULE['UiFormSelect'] = 'modules/ui/controllers/UiFormSelect.js';
Bbase.MODULE['UiFormSlider'] = 'modules/ui/controllers/UiFormSlider.js';
Bbase.MODULE['UiFormDropDown'] = 'modules/ui/controllers/UiFormDropDown.js';
Bbase.MODULE['UiFormTextEditor'] = 'modules/ui/controllers/UiFormTextEditor.js';
Bbase.MODULE['UiFormGroup'] = 'modules/ui/controllers/UiFormGroup.js';
Bbase.MODULE['UiFormTab'] = 'modules/ui/controllers/UiFormTab.js';
Bbase.MODULE['UiFormDialog'] = 'modules/ui/controllers/UiFormDialog.js';
Bbase.MODULE['UiFormTip'] = 'modules/ui/controllers/UiFormTip.js';

Bbase.MODULE['UiScroll'] = 'modules/ui/controllers/UiScroll.js';
Bbase.MODULE['UiScrollbar'] = 'modules/ui/controllers/UiScrollbar.js';
Bbase.MODULE['UiSortable'] = 'modules/ui/controllers/UiSortable.js';
Bbase.MODULE['UiScrollfix'] = 'modules/ui/controllers/UiScrollfix.js';

Bbase.MODULE['UiList'] = 'modules/ui/controllers/UiList.js';
Bbase.MODULE['UiListExpand'] = 'modules/ui/controllers/UiListExpand.js';


