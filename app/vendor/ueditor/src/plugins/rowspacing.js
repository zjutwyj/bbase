// plugins/rowspacing.js
/**
 * 段前段后间距插件
 * @file
 * @since 1.2.6.1
 */

/**
 * 设置段间距
 * @command rowspacing
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } value 段间距的值，以px为单位
 * @param { String } dir 间距位置，top或bottom，分别表示段前和段后
 * @example
 * ```javascript
 * editor.execCommand( 'rowspacing', '10', 'top' );
 * ```
 */

UE.plugins['rowspacing'] = function(){
  var me = this;
  var spacing = ['0', '0.5', '1', '1.5', '1.75', '2', '2.5', '3', '3.5', '4', '4.5', '5', '6', '7', '8', '9', '10', '12', '14', '16', '18', '20', '22', '24', '28', '30'];
  me.setOpt({
    'rowspacingtop':spacing,
    'rowspacingbottom':spacing,
    'rowspacingleft':spacing,
    'rowspacingright':spacing

  });
  me.commands['rowspacing'] =  {
    execCommand : function( cmdName,value,dir ) {
      this.execCommand('paragraph','p',{style:'margin-'+dir+':'+value + 'em'});
      return true;
    },
    queryCommandValue : function(cmdName,dir) {
      var pN = domUtils.filterNodeList(this.selection.getStartElementPath(),function(node){return domUtils.isBlockElm(node) }),
        value;
      //trace:1026
      if(pN){
        value = domUtils.getComputedStyle(pN,'margin-'+dir).replace(/[^(\d|\.)]/g,'');
        return !value ? 0 : value;
      }
      return 0;

    }
  };
};



