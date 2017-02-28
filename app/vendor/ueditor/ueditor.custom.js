/**
 * @description ueditor.plugin
 * @class ueditor.plugin
 * @author yongjin<zjut_wyj@163.com> 2015/8/23
 */
UE.commands['insertdesigntitle'] = {
  execCommand: function () {
    this.fireEvent("insertdesigntitle");
  }
};
UE.commands['insertdesignmobile'] = {
  execCommand: function () {
    this.fireEvent("insertdesignmobile");
  }
};
UE.commands['insertdesignname'] = {
  execCommand: function () {
    this.fireEvent("insertdesignname");
  }
};
UE.commands['imgupload'] = {
  execCommand: function () {
    this.fireEvent("imgupload");
  }
};
UE.commands['fontplus'] = {
  execCommand: function () {
    this.fireEvent("fontplus");
  }
};
UE.commands['fontminus'] = {
  execCommand: function () {
    this.fireEvent("fontminus");
  }
};
UE.commands['lineheightplus'] = {
  execCommand: function () {
    this.fireEvent("lineheightplus");
  }
};
UE.commands['lineheightminus'] = {
  execCommand: function () {
    this.fireEvent("lineheightminus");
  }
};