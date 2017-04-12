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

Bbase.MODULE['UiItemCheck'] = 'modules/ui/controllers/UiItemCheck.js';
Bbase.MODULE['UiItemCheckTab'] = 'modules/ui/controllers/UiItemCheckTab.js';
Bbase.MODULE['UiItemCheckBtn'] = 'modules/ui/controllers/UiItemCheckBtn.js';



Bbase.MODULE['UiScroll'] = 'modules/ui/controllers/UiScroll.js';
Bbase.MODULE['UiScrollbar'] = 'modules/ui/controllers/UiScrollbar.js';
Bbase.MODULE['UiSortable'] = 'modules/ui/controllers/UiSortable.js';


