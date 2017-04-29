var status = {};
if (typeof app !== 'undefined' && app.getAllStatus){
  status = app.getAllStatus();
}
if (typeof STATUS !== 'undefined'){
  status = BbaseEst.extend(status, STATUS);
}
BbaseEst.each(status, function (val, key) {
  BbaseHandlebars.registerHelper(key, function (str, options) {
    var result = '';
    if (BbaseEst.isEmpty(options)) {
      return this[key];
    }
    BbaseEst.each(val, function (item) {
      if (item.value === str) {
        result = BbaseEst.isEmpty(item.html) ? item.text : item.html;
        return false;
      }
    });
    return result;
  });
});
