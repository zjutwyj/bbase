// plugins/table.core.js
/**
 * Created with JetBrains WebStorm.
 * User: taoqili
 * Date: 13-1-18
 * Time: 上午11:09
 * To change this template use File | Settings | File Templates.
 */
/**
 * UE表格操作类
 * @param table
 * @constructor
 */
(function () {
  var UETable = UE.UETable = function (table) {
    this.table = table;
    this.indexTable = [];
    this.selectedTds = [];
    this.cellsRange = {};
    this.update(table);
  };

  //===以下为静态工具方法===
  UETable.removeSelectedClass = function (cells) {
    utils.each(cells, function (cell) {
      domUtils.removeClasses(cell, "selectTdClass");
    })
  };
  UETable.addSelectedClass = function (cells) {
    utils.each(cells, function (cell) {
      domUtils.addClass(cell, "selectTdClass");
    })
  };
  UETable.isEmptyBlock = function (node) {
    var reg = new RegExp(domUtils.fillChar, 'g');
    if (node[browser.ie ? 'innerText' : 'textContent'].replace(/^\s*$/, '').replace(reg, '').length > 0) {
      return 0;
    }
    for (var i in dtd.$isNotEmpty) if (dtd.$isNotEmpty.hasOwnProperty(i)) {
      if (node.getElementsByTagName(i).length) {
        return 0;
      }
    }
    return 1;
  };
  UETable.getWidth = function (cell) {
    if (!cell)return 0;
    return parseInt(domUtils.getComputedStyle(cell, "width"), 10);
  };

  /**
   * 获取单元格或者单元格组的“对齐”状态。 如果当前的检测对象是一个单元格组， 只有在满足所有单元格的 水平和竖直 对齐属性都相同的
   * 条件时才会返回其状态值，否则将返回null； 如果当前只检测了一个单元格， 则直接返回当前单元格的对齐状态；
   * @param table cell or table cells , 支持单个单元格dom对象 或者 单元格dom对象数组
   * @return { align: 'left' || 'right' || 'center', valign: 'top' || 'middle' || 'bottom' } 或者 null
   */
  UETable.getTableCellAlignState = function ( cells ) {

    !utils.isArray( cells ) && ( cells = [cells] );

    var result = {},
      status = ['align', 'valign'],
      tempStatus = null,
      isSame = true;//状态是否相同

    utils.each( cells, function( cellNode ){

      utils.each( status, function( currentState ){

        tempStatus = cellNode.getAttribute( currentState );

        if( !result[ currentState ] && tempStatus ) {
          result[ currentState ] = tempStatus;
        } else if( !result[ currentState ] || ( tempStatus !== result[ currentState ] ) ) {
          isSame = false;
          return false;
        }

      } );

      return isSame;

    });

    return isSame ? result : null;

  };

  /**
   * 根据当前选区获取相关的table信息
   * @return {Object}
   */
  UETable.getTableItemsByRange = function (editor) {
    var start = editor.selection.getStart();

    //ff下会选中bookmark
    if( start && start.id && start.id.indexOf('_baidu_bookmark_start_') === 0 && start.nextSibling) {
      start = start.nextSibling;
    }

    //在table或者td边缘有可能存在选中tr的情况
    var cell = start && domUtils.findParentByTagName(start, ["td", "th"], true),
      tr = cell && cell.parentNode,
      caption = start && domUtils.findParentByTagName(start, 'caption', true),
      table = caption ? caption.parentNode : tr && tr.parentNode.parentNode;

    return {
      cell:cell,
      tr:tr,
      table:table,
      caption:caption
    }
  };
  UETable.getUETableBySelected = function (editor) {
    var table = UETable.getTableItemsByRange(editor).table;
    if (table && table.ueTable && table.ueTable.selectedTds.length) {
      return table.ueTable;
    }
    return null;
  };

  UETable.getDefaultValue = function (editor, table) {
    var borderMap = {
        thin:'0px',
        medium:'1px',
        thick:'2px'
      },
      tableBorder, tdPadding, tdBorder, tmpValue;
    if (!table) {
      table = editor.document.createElement('table');
      table.insertRow(0).insertCell(0).innerHTML = 'xxx';
      editor.body.appendChild(table);
      var td = table.getElementsByTagName('td')[0];
      tmpValue = domUtils.getComputedStyle(table, 'border-left-width');
      tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
      tmpValue = domUtils.getComputedStyle(td, 'padding-left');
      tdPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
      tmpValue = domUtils.getComputedStyle(td, 'border-left-width');
      tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
      domUtils.remove(table);
      return {
        tableBorder:tableBorder,
        tdPadding:tdPadding,
        tdBorder:tdBorder
      };
    } else {
      td = table.getElementsByTagName('td')[0];
      tmpValue = domUtils.getComputedStyle(table, 'border-left-width');
      tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
      tmpValue = domUtils.getComputedStyle(td, 'padding-left');
      tdPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
      tmpValue = domUtils.getComputedStyle(td, 'border-left-width');
      tdBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
      return {
        tableBorder:tableBorder,
        tdPadding:tdPadding,
        tdBorder:tdBorder
      };
    }
  };
  /**
   * 根据当前点击的td或者table获取索引对象
   * @param tdOrTable
   */
  UETable.getUETable = function (tdOrTable) {
    var tag = tdOrTable.tagName.toLowerCase();
    tdOrTable = (tag == "td" || tag == "th" || tag == 'caption') ? domUtils.findParentByTagName(tdOrTable, "table", true) : tdOrTable;
    if (!tdOrTable.ueTable) {
      tdOrTable.ueTable = new UETable(tdOrTable);
    }
    return tdOrTable.ueTable;
  };

  UETable.cloneCell = function(cell,ignoreMerge,keepPro){
    if (!cell || utils.isString(cell)) {
      return this.table.ownerDocument.createElement(cell || 'td');
    }
    var flag = domUtils.hasClass(cell, "selectTdClass");
    flag && domUtils.removeClasses(cell, "selectTdClass");
    var tmpCell = cell.cloneNode(true);
    if (ignoreMerge) {
      tmpCell.rowSpan = tmpCell.colSpan = 1;
    }
    //去掉宽高
    !keepPro && domUtils.removeAttributes(tmpCell,'width height');
    !keepPro && domUtils.removeAttributes(tmpCell,'style');

    tmpCell.style.borderLeftStyle = "";
    tmpCell.style.borderTopStyle = "";
    tmpCell.style.borderLeftColor = cell.style.borderRightColor;
    tmpCell.style.borderLeftWidth = cell.style.borderRightWidth;
    tmpCell.style.borderTopColor = cell.style.borderBottomColor;
    tmpCell.style.borderTopWidth = cell.style.borderBottomWidth;
    flag && domUtils.addClass(cell, "selectTdClass");
    return tmpCell;
  }

  UETable.prototype = {
    getMaxRows:function () {
      var rows = this.table.rows, maxLen = 1;
      for (var i = 0, row; row = rows[i]; i++) {
        var currentMax = 1;
        for (var j = 0, cj; cj = row.cells[j++];) {
          currentMax = Math.max(cj.rowSpan || 1, currentMax);
        }
        maxLen = Math.max(currentMax + i, maxLen);
      }
      return maxLen;
    },
    /**
     * 获取当前表格的最大列数
     */
    getMaxCols:function () {
      var rows = this.table.rows, maxLen = 0, cellRows = {};
      for (var i = 0, row; row = rows[i]; i++) {
        var cellsNum = 0;
        for (var j = 0, cj; cj = row.cells[j++];) {
          cellsNum += (cj.colSpan || 1);
          if (cj.rowSpan && cj.rowSpan > 1) {
            for (var k = 1; k < cj.rowSpan; k++) {
              if (!cellRows['row_' + (i + k)]) {
                cellRows['row_' + (i + k)] = (cj.colSpan || 1);
              } else {
                cellRows['row_' + (i + k)]++
              }
            }

          }
        }
        cellsNum += cellRows['row_' + i] || 0;
        maxLen = Math.max(cellsNum, maxLen);
      }
      return maxLen;
    },
    getCellColIndex:function (cell) {

    },
    /**
     * 获取当前cell旁边的单元格，
     * @param cell
     * @param right
     */
    getHSideCell:function (cell, right) {
      try {
        var cellInfo = this.getCellInfo(cell),
          previewRowIndex, previewColIndex;
        var len = this.selectedTds.length,
          range = this.cellsRange;
        //首行或者首列没有前置单元格
        if ((!right && (!len ? !cellInfo.colIndex : !range.beginColIndex)) || (right && (!len ? (cellInfo.colIndex == (this.colsNum - 1)) : (range.endColIndex == this.colsNum - 1)))) return null;

        previewRowIndex = !len ? cellInfo.rowIndex : range.beginRowIndex;
        previewColIndex = !right ? ( !len ? (cellInfo.colIndex < 1 ? 0 : (cellInfo.colIndex - 1)) : range.beginColIndex - 1)
          : ( !len ? cellInfo.colIndex + 1 : range.endColIndex + 1);
        return this.getCell(this.indexTable[previewRowIndex][previewColIndex].rowIndex, this.indexTable[previewRowIndex][previewColIndex].cellIndex);
      } catch (e) {
        showError(e);
      }
    },
    getTabNextCell:function (cell, preRowIndex) {
      var cellInfo = this.getCellInfo(cell),
        rowIndex = preRowIndex || cellInfo.rowIndex,
        colIndex = cellInfo.colIndex + 1 + (cellInfo.colSpan - 1),
        nextCell;
      try {
        nextCell = this.getCell(this.indexTable[rowIndex][colIndex].rowIndex, this.indexTable[rowIndex][colIndex].cellIndex);
      } catch (e) {
        try {
          rowIndex = rowIndex * 1 + 1;
          colIndex = 0;
          nextCell = this.getCell(this.indexTable[rowIndex][colIndex].rowIndex, this.indexTable[rowIndex][colIndex].cellIndex);
        } catch (e) {
        }
      }
      return nextCell;

    },
    /**
     * 获取视觉上的后置单元格
     * @param cell
     * @param bottom
     */
    getVSideCell:function (cell, bottom, ignoreRange) {
      try {
        var cellInfo = this.getCellInfo(cell),
          nextRowIndex, nextColIndex;
        var len = this.selectedTds.length && !ignoreRange,
          range = this.cellsRange;
        //末行或者末列没有后置单元格
        if ((!bottom && (cellInfo.rowIndex == 0)) || (bottom && (!len ? (cellInfo.rowIndex + cellInfo.rowSpan > this.rowsNum - 1) : (range.endRowIndex == this.rowsNum - 1)))) return null;

        nextRowIndex = !bottom ? ( !len ? cellInfo.rowIndex - 1 : range.beginRowIndex - 1)
          : ( !len ? (cellInfo.rowIndex + cellInfo.rowSpan) : range.endRowIndex + 1);
        nextColIndex = !len ? cellInfo.colIndex : range.beginColIndex;
        return this.getCell(this.indexTable[nextRowIndex][nextColIndex].rowIndex, this.indexTable[nextRowIndex][nextColIndex].cellIndex);
      } catch (e) {
        showError(e);
      }
    },
    /**
     * 获取相同结束位置的单元格，xOrY指代了是获取x轴相同还是y轴相同
     */
    getSameEndPosCells:function (cell, xOrY) {
      try {
        var flag = (xOrY.toLowerCase() === "x"),
          end = domUtils.getXY(cell)[flag ? 'x' : 'y'] + cell["offset" + (flag ? 'Width' : 'Height')],
          rows = this.table.rows,
          cells = null, returns = [];
        for (var i = 0; i < this.rowsNum; i++) {
          cells = rows[i].cells;
          for (var j = 0, tmpCell; tmpCell = cells[j++];) {
            var tmpEnd = domUtils.getXY(tmpCell)[flag ? 'x' : 'y'] + tmpCell["offset" + (flag ? 'Width' : 'Height')];
            //对应行的td已经被上面行rowSpan了
            if (tmpEnd > end && flag) break;
            if (cell == tmpCell || end == tmpEnd) {
              //只获取单一的单元格
              //todo 仅获取单一单元格在特定情况下会造成returns为空，从而影响后续的拖拽实现，修正这个。需考虑性能
              if (tmpCell[flag ? "colSpan" : "rowSpan"] == 1) {
                returns.push(tmpCell);
              }
              if (flag) break;
            }
          }
        }
        return returns;
      } catch (e) {
        showError(e);
      }
    },
    setCellContent:function (cell, content) {
      cell.innerHTML = content || (browser.ie ? domUtils.fillChar : "<br />");
    },
    cloneCell:UETable.cloneCell,
    /**
     * 获取跟当前单元格的右边竖线为左边的所有未合并单元格
     */
    getSameStartPosXCells:function (cell) {
      try {
        var start = domUtils.getXY(cell).x + cell.offsetWidth,
          rows = this.table.rows, cells , returns = [];
        for (var i = 0; i < this.rowsNum; i++) {
          cells = rows[i].cells;
          for (var j = 0, tmpCell; tmpCell = cells[j++];) {
            var tmpStart = domUtils.getXY(tmpCell).x;
            if (tmpStart > start) break;
            if (tmpStart == start && tmpCell.colSpan == 1) {
              returns.push(tmpCell);
              break;
            }
          }
        }
        return returns;
      } catch (e) {
        showError(e);
      }
    },
    /**
     * 更新table对应的索引表
     */
    update:function (table) {
      this.table = table || this.table;
      this.selectedTds = [];
      this.cellsRange = {};
      this.indexTable = [];
      var rows = this.table.rows,
        rowsNum = this.getMaxRows(),
        dNum = rowsNum - rows.length,
        colsNum = this.getMaxCols();
      while (dNum--) {
        this.table.insertRow(rows.length);
      }
      this.rowsNum = rowsNum;
      this.colsNum = colsNum;
      for (var i = 0, len = rows.length; i < len; i++) {
        this.indexTable[i] = new Array(colsNum);
      }
      //填充索引表
      for (var rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
        for (var cellIndex = 0, cell, cells = row.cells; cell = cells[cellIndex]; cellIndex++) {
          //修正整行被rowSpan时导致的行数计算错误
          if (cell.rowSpan > rowsNum) {
            cell.rowSpan = rowsNum;
          }
          var colIndex = cellIndex,
            rowSpan = cell.rowSpan || 1,
            colSpan = cell.colSpan || 1;
          //当已经被上一行rowSpan或者被前一列colSpan了，则跳到下一个单元格进行
          while (this.indexTable[rowIndex][colIndex]) colIndex++;
          for (var j = 0; j < rowSpan; j++) {
            for (var k = 0; k < colSpan; k++) {
              this.indexTable[rowIndex + j][colIndex + k] = {
                rowIndex:rowIndex,
                cellIndex:cellIndex,
                colIndex:colIndex,
                rowSpan:rowSpan,
                colSpan:colSpan
              }
            }
          }
        }
      }
      //修复残缺td
      for (j = 0; j < rowsNum; j++) {
        for (k = 0; k < colsNum; k++) {
          if (this.indexTable[j][k] === undefined) {
            row = rows[j];
            cell = row.cells[row.cells.length - 1];
            cell = cell ? cell.cloneNode(true) : this.table.ownerDocument.createElement("td");
            this.setCellContent(cell);
            if (cell.colSpan !== 1)cell.colSpan = 1;
            if (cell.rowSpan !== 1)cell.rowSpan = 1;
            row.appendChild(cell);
            this.indexTable[j][k] = {
              rowIndex:j,
              cellIndex:cell.cellIndex,
              colIndex:k,
              rowSpan:1,
              colSpan:1
            }
          }
        }
      }
      //当框选后删除行或者列后撤销，需要重建选区。
      var tds = domUtils.getElementsByTagName(this.table, "td"),
        selectTds = [];
      utils.each(tds, function (td) {
        if (domUtils.hasClass(td, "selectTdClass")) {
          selectTds.push(td);
        }
      });
      if (selectTds.length) {
        var start = selectTds[0],
          end = selectTds[selectTds.length - 1],
          startInfo = this.getCellInfo(start),
          endInfo = this.getCellInfo(end);
        this.selectedTds = selectTds;
        this.cellsRange = {
          beginRowIndex:startInfo.rowIndex,
          beginColIndex:startInfo.colIndex,
          endRowIndex:endInfo.rowIndex + endInfo.rowSpan - 1,
          endColIndex:endInfo.colIndex + endInfo.colSpan - 1
        };
      }
      //给第一行设置firstRow的样式名称,在排序图标的样式上使用到
      if(!domUtils.hasClass(this.table.rows[0], "firstRow")) {
        domUtils.addClass(this.table.rows[0], "firstRow");
        for(var i = 1; i< this.table.rows.length; i++) {
          domUtils.removeClasses(this.table.rows[i], "firstRow");
        }
      }
    },
    /**
     * 获取单元格的索引信息
     */
    getCellInfo:function (cell) {
      if (!cell) return;
      var cellIndex = cell.cellIndex,
        rowIndex = cell.parentNode.rowIndex,
        rowInfo = this.indexTable[rowIndex],
        numCols = this.colsNum;
      for (var colIndex = cellIndex; colIndex < numCols; colIndex++) {
        var cellInfo = rowInfo[colIndex];
        if (cellInfo.rowIndex === rowIndex && cellInfo.cellIndex === cellIndex) {
          return cellInfo;
        }
      }
    },
    /**
     * 根据行列号获取单元格
     */
    getCell:function (rowIndex, cellIndex) {
      return rowIndex < this.rowsNum && this.table.rows[rowIndex].cells[cellIndex] || null;
    },
    /**
     * 删除单元格
     */
    deleteCell:function (cell, rowIndex) {
      rowIndex = typeof rowIndex == 'number' ? rowIndex : cell.parentNode.rowIndex;
      var row = this.table.rows[rowIndex];
      row.deleteCell(cell.cellIndex);
    },
    /**
     * 根据始末两个单元格获取被框选的所有单元格范围
     */
    getCellsRange:function (cellA, cellB) {
      function checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex) {
        var tmpBeginRowIndex = beginRowIndex,
          tmpBeginColIndex = beginColIndex,
          tmpEndRowIndex = endRowIndex,
          tmpEndColIndex = endColIndex,
          cellInfo, colIndex, rowIndex;
        // 通过indexTable检查是否存在超出TableRange上边界的情况
        if (beginRowIndex > 0) {
          for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
            cellInfo = me.indexTable[beginRowIndex][colIndex];
            rowIndex = cellInfo.rowIndex;
            if (rowIndex < beginRowIndex) {
              tmpBeginRowIndex = Math.min(rowIndex, tmpBeginRowIndex);
            }
          }
        }
        // 通过indexTable检查是否存在超出TableRange右边界的情况
        if (endColIndex < me.colsNum) {
          for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
            cellInfo = me.indexTable[rowIndex][endColIndex];
            colIndex = cellInfo.colIndex + cellInfo.colSpan - 1;
            if (colIndex > endColIndex) {
              tmpEndColIndex = Math.max(colIndex, tmpEndColIndex);
            }
          }
        }
        // 检查是否有超出TableRange下边界的情况
        if (endRowIndex < me.rowsNum) {
          for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
            cellInfo = me.indexTable[endRowIndex][colIndex];
            rowIndex = cellInfo.rowIndex + cellInfo.rowSpan - 1;
            if (rowIndex > endRowIndex) {
              tmpEndRowIndex = Math.max(rowIndex, tmpEndRowIndex);
            }
          }
        }
        // 检查是否有超出TableRange左边界的情况
        if (beginColIndex > 0) {
          for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
            cellInfo = me.indexTable[rowIndex][beginColIndex];
            colIndex = cellInfo.colIndex;
            if (colIndex < beginColIndex) {
              tmpBeginColIndex = Math.min(cellInfo.colIndex, tmpBeginColIndex);
            }
          }
        }
        //递归调用直至所有完成所有框选单元格的扩展
        if (tmpBeginRowIndex != beginRowIndex || tmpBeginColIndex != beginColIndex || tmpEndRowIndex != endRowIndex || tmpEndColIndex != endColIndex) {
          return checkRange(tmpBeginRowIndex, tmpBeginColIndex, tmpEndRowIndex, tmpEndColIndex);
        } else {
          // 不需要扩展TableRange的情况
          return {
            beginRowIndex:beginRowIndex,
            beginColIndex:beginColIndex,
            endRowIndex:endRowIndex,
            endColIndex:endColIndex
          };
        }
      }

      try {
        var me = this,
          cellAInfo = me.getCellInfo(cellA);
        if (cellA === cellB) {
          return {
            beginRowIndex:cellAInfo.rowIndex,
            beginColIndex:cellAInfo.colIndex,
            endRowIndex:cellAInfo.rowIndex + cellAInfo.rowSpan - 1,
            endColIndex:cellAInfo.colIndex + cellAInfo.colSpan - 1
          };
        }
        var cellBInfo = me.getCellInfo(cellB);
        // 计算TableRange的四个边
        var beginRowIndex = Math.min(cellAInfo.rowIndex, cellBInfo.rowIndex),
          beginColIndex = Math.min(cellAInfo.colIndex, cellBInfo.colIndex),
          endRowIndex = Math.max(cellAInfo.rowIndex + cellAInfo.rowSpan - 1, cellBInfo.rowIndex + cellBInfo.rowSpan - 1),
          endColIndex = Math.max(cellAInfo.colIndex + cellAInfo.colSpan - 1, cellBInfo.colIndex + cellBInfo.colSpan - 1);

        return checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex);
      } catch (e) {
        //throw e;
      }
    },
    /**
     * 依据cellsRange获取对应的单元格集合
     */
    getCells:function (range) {
      //每次获取cells之前必须先清除上次的选择，否则会对后续获取操作造成影响
      this.clearSelected();
      var beginRowIndex = range.beginRowIndex,
        beginColIndex = range.beginColIndex,
        endRowIndex = range.endRowIndex,
        endColIndex = range.endColIndex,
        cellInfo, rowIndex, colIndex, tdHash = {}, returnTds = [];
      for (var i = beginRowIndex; i <= endRowIndex; i++) {
        for (var j = beginColIndex; j <= endColIndex; j++) {
          cellInfo = this.indexTable[i][j];
          rowIndex = cellInfo.rowIndex;
          colIndex = cellInfo.colIndex;
          // 如果Cells里已经包含了此Cell则跳过
          var key = rowIndex + '|' + colIndex;
          if (tdHash[key]) continue;
          tdHash[key] = 1;
          if (rowIndex < i || colIndex < j || rowIndex + cellInfo.rowSpan - 1 > endRowIndex || colIndex + cellInfo.colSpan - 1 > endColIndex) {
            return null;
          }
          returnTds.push(this.getCell(rowIndex, cellInfo.cellIndex));
        }
      }
      return returnTds;
    },
    /**
     * 清理已经选中的单元格
     */
    clearSelected:function () {
      UETable.removeSelectedClass(this.selectedTds);
      this.selectedTds = [];
      this.cellsRange = {};
    },
    /**
     * 根据range设置已经选中的单元格
     */
    setSelected:function (range) {
      var cells = this.getCells(range);
      UETable.addSelectedClass(cells);
      this.selectedTds = cells;
      this.cellsRange = range;
    },
    isFullRow:function () {
      var range = this.cellsRange;
      return (range.endColIndex - range.beginColIndex + 1) == this.colsNum;
    },
    isFullCol:function () {
      var range = this.cellsRange,
        table = this.table,
        ths = table.getElementsByTagName("th"),
        rows = range.endRowIndex - range.beginRowIndex + 1;
      return  !ths.length ? rows == this.rowsNum : rows == this.rowsNum || (rows == this.rowsNum - 1);

    },
    /**
     * 获取视觉上的前置单元格，默认是左边，top传入时
     * @param cell
     * @param top
     */
    getNextCell:function (cell, bottom, ignoreRange) {
      try {
        var cellInfo = this.getCellInfo(cell),
          nextRowIndex, nextColIndex;
        var len = this.selectedTds.length && !ignoreRange,
          range = this.cellsRange;
        //末行或者末列没有后置单元格
        if ((!bottom && (cellInfo.rowIndex == 0)) || (bottom && (!len ? (cellInfo.rowIndex + cellInfo.rowSpan > this.rowsNum - 1) : (range.endRowIndex == this.rowsNum - 1)))) return null;

        nextRowIndex = !bottom ? ( !len ? cellInfo.rowIndex - 1 : range.beginRowIndex - 1)
          : ( !len ? (cellInfo.rowIndex + cellInfo.rowSpan) : range.endRowIndex + 1);
        nextColIndex = !len ? cellInfo.colIndex : range.beginColIndex;
        return this.getCell(this.indexTable[nextRowIndex][nextColIndex].rowIndex, this.indexTable[nextRowIndex][nextColIndex].cellIndex);
      } catch (e) {
        showError(e);
      }
    },
    getPreviewCell:function (cell, top) {
      try {
        var cellInfo = this.getCellInfo(cell),
          previewRowIndex, previewColIndex;
        var len = this.selectedTds.length,
          range = this.cellsRange;
        //首行或者首列没有前置单元格
        if ((!top && (!len ? !cellInfo.colIndex : !range.beginColIndex)) || (top && (!len ? (cellInfo.rowIndex > (this.colsNum - 1)) : (range.endColIndex == this.colsNum - 1)))) return null;

        previewRowIndex = !top ? ( !len ? cellInfo.rowIndex : range.beginRowIndex )
          : ( !len ? (cellInfo.rowIndex < 1 ? 0 : (cellInfo.rowIndex - 1)) : range.beginRowIndex);
        previewColIndex = !top ? ( !len ? (cellInfo.colIndex < 1 ? 0 : (cellInfo.colIndex - 1)) : range.beginColIndex - 1)
          : ( !len ? cellInfo.colIndex : range.endColIndex + 1);
        return this.getCell(this.indexTable[previewRowIndex][previewColIndex].rowIndex, this.indexTable[previewRowIndex][previewColIndex].cellIndex);
      } catch (e) {
        showError(e);
      }
    },
    /**
     * 移动单元格中的内容
     */
    moveContent:function (cellTo, cellFrom) {
      if (UETable.isEmptyBlock(cellFrom)) return;
      if (UETable.isEmptyBlock(cellTo)) {
        cellTo.innerHTML = cellFrom.innerHTML;
        return;
      }
      var child = cellTo.lastChild;
      if (child.nodeType == 3 || !dtd.$block[child.tagName]) {
        cellTo.appendChild(cellTo.ownerDocument.createElement('br'))
      }
      while (child = cellFrom.firstChild) {
        cellTo.appendChild(child);
      }
    },
    /**
     * 向右合并单元格
     */
    mergeRight:function (cell) {
      var cellInfo = this.getCellInfo(cell),
        rightColIndex = cellInfo.colIndex + cellInfo.colSpan,
        rightCellInfo = this.indexTable[cellInfo.rowIndex][rightColIndex],
        rightCell = this.getCell(rightCellInfo.rowIndex, rightCellInfo.cellIndex);
      //合并
      cell.colSpan = cellInfo.colSpan + rightCellInfo.colSpan;
      //被合并的单元格不应存在宽度属性
      cell.removeAttribute("width");
      //移动内容
      this.moveContent(cell, rightCell);
      //删掉被合并的Cell
      this.deleteCell(rightCell, rightCellInfo.rowIndex);
      this.update();
    },
    /**
     * 向下合并单元格
     */
    mergeDown:function (cell) {
      var cellInfo = this.getCellInfo(cell),
        downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan,
        downCellInfo = this.indexTable[downRowIndex][cellInfo.colIndex],
        downCell = this.getCell(downCellInfo.rowIndex, downCellInfo.cellIndex);
      cell.rowSpan = cellInfo.rowSpan + downCellInfo.rowSpan;
      cell.removeAttribute("height");
      this.moveContent(cell, downCell);
      this.deleteCell(downCell, downCellInfo.rowIndex);
      this.update();
    },
    /**
     * 合并整个range中的内容
     */
    mergeRange:function () {
      //由于合并操作可以在任意时刻进行，所以无法通过鼠标位置等信息实时生成range，只能通过缓存实例中的cellsRange对象来访问
      var range = this.cellsRange,
        leftTopCell = this.getCell(range.beginRowIndex, this.indexTable[range.beginRowIndex][range.beginColIndex].cellIndex);

      if (leftTopCell.tagName == "TH" && range.endRowIndex !== range.beginRowIndex) {
        var index = this.indexTable,
          info = this.getCellInfo(leftTopCell);
        leftTopCell = this.getCell(1, index[1][info.colIndex].cellIndex);
        range = this.getCellsRange(leftTopCell, this.getCell(index[this.rowsNum - 1][info.colIndex].rowIndex, index[this.rowsNum - 1][info.colIndex].cellIndex));
      }

      // 删除剩余的Cells
      var cells = this.getCells(range);
      for(var i= 0,ci;ci=cells[i++];){
        if (ci !== leftTopCell) {
          this.moveContent(leftTopCell, ci);
          this.deleteCell(ci);
        }
      }
      // 修改左上角Cell的rowSpan和colSpan，并调整宽度属性设置
      leftTopCell.rowSpan = range.endRowIndex - range.beginRowIndex + 1;
      leftTopCell.rowSpan > 1 && leftTopCell.removeAttribute("height");
      leftTopCell.colSpan = range.endColIndex - range.beginColIndex + 1;
      leftTopCell.colSpan > 1 && leftTopCell.removeAttribute("width");
      if (leftTopCell.rowSpan == this.rowsNum && leftTopCell.colSpan != 1) {
        leftTopCell.colSpan = 1;
      }

      if (leftTopCell.colSpan == this.colsNum && leftTopCell.rowSpan != 1) {
        var rowIndex = leftTopCell.parentNode.rowIndex;
        //解决IE下的表格操作问题
        if( this.table.deleteRow ) {
          for (var i = rowIndex+ 1, curIndex=rowIndex+ 1, len=leftTopCell.rowSpan; i < len; i++) {
            this.table.deleteRow(curIndex);
          }
        } else {
          for (var i = 0, len=leftTopCell.rowSpan - 1; i < len; i++) {
            var row = this.table.rows[rowIndex + 1];
            row.parentNode.removeChild(row);
          }
        }
        leftTopCell.rowSpan = 1;
      }
      this.update();
    },
    /**
     * 插入一行单元格
     */
    insertRow:function (rowIndex, sourceCell) {
      var numCols = this.colsNum,
        table = this.table,
        row = table.insertRow(rowIndex), cell,
        isInsertTitle = typeof sourceCell == 'string' && sourceCell.toUpperCase() == 'TH';

      function replaceTdToTh(colIndex, cell, tableRow) {
        if (colIndex == 0) {
          var tr = tableRow.nextSibling || tableRow.previousSibling,
            th = tr.cells[colIndex];
          if (th.tagName == 'TH') {
            th = cell.ownerDocument.createElement("th");
            th.appendChild(cell.firstChild);
            tableRow.insertBefore(th, cell);
            domUtils.remove(cell)
          }
        }else{
          if (cell.tagName == 'TH') {
            var td = cell.ownerDocument.createElement("td");
            td.appendChild(cell.firstChild);
            tableRow.insertBefore(td, cell);
            domUtils.remove(cell)
          }
        }
      }

      //首行直接插入,无需考虑部分单元格被rowspan的情况
      if (rowIndex == 0 || rowIndex == this.rowsNum) {
        for (var colIndex = 0; colIndex < numCols; colIndex++) {
          cell = this.cloneCell(sourceCell, true);
          this.setCellContent(cell);
          cell.getAttribute('vAlign') && cell.setAttribute('vAlign', cell.getAttribute('vAlign'));
          row.appendChild(cell);
          if(!isInsertTitle) replaceTdToTh(colIndex, cell, row);
        }
      } else {
        var infoRow = this.indexTable[rowIndex],
          cellIndex = 0;
        for (colIndex = 0; colIndex < numCols; colIndex++) {
          var cellInfo = infoRow[colIndex];
          //如果存在某个单元格的rowspan穿过待插入行的位置，则修改该单元格的rowspan即可，无需插入单元格
          if (cellInfo.rowIndex < rowIndex) {
            cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
            cell.rowSpan = cellInfo.rowSpan + 1;
          } else {
            cell = this.cloneCell(sourceCell, true);
            this.setCellContent(cell);
            row.appendChild(cell);
          }
          if(!isInsertTitle) replaceTdToTh(colIndex, cell, row);
        }
      }
      //框选时插入不触发contentchange，需要手动更新索引。
      this.update();
      return row;
    },
    /**
     * 删除一行单元格
     * @param rowIndex
     */
    deleteRow:function (rowIndex) {
      var row = this.table.rows[rowIndex],
        infoRow = this.indexTable[rowIndex],
        colsNum = this.colsNum,
        count = 0;     //处理计数
      for (var colIndex = 0; colIndex < colsNum;) {
        var cellInfo = infoRow[colIndex],
          cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
        if (cell.rowSpan > 1) {
          if (cellInfo.rowIndex == rowIndex) {
            var clone = cell.cloneNode(true);
            clone.rowSpan = cell.rowSpan - 1;
            clone.innerHTML = "";
            cell.rowSpan = 1;
            var nextRowIndex = rowIndex + 1,
              nextRow = this.table.rows[nextRowIndex],
              insertCellIndex,
              preMerged = this.getPreviewMergedCellsNum(nextRowIndex, colIndex) - count;
            if (preMerged < colIndex) {
              insertCellIndex = colIndex - preMerged - 1;
              //nextRow.insertCell(insertCellIndex);
              domUtils.insertAfter(nextRow.cells[insertCellIndex], clone);
            } else {
              if (nextRow.cells.length) nextRow.insertBefore(clone, nextRow.cells[0])
            }
            count += 1;
            //cell.parentNode.removeChild(cell);
          }
        }
        colIndex += cell.colSpan || 1;
      }
      var deleteTds = [], cacheMap = {};
      for (colIndex = 0; colIndex < colsNum; colIndex++) {
        var tmpRowIndex = infoRow[colIndex].rowIndex,
          tmpCellIndex = infoRow[colIndex].cellIndex,
          key = tmpRowIndex + "_" + tmpCellIndex;
        if (cacheMap[key])continue;
        cacheMap[key] = 1;
        cell = this.getCell(tmpRowIndex, tmpCellIndex);
        deleteTds.push(cell);
      }
      var mergeTds = [];
      utils.each(deleteTds, function (td) {
        if (td.rowSpan == 1) {
          td.parentNode.removeChild(td);
        } else {
          mergeTds.push(td);
        }
      });
      utils.each(mergeTds, function (td) {
        td.rowSpan--;
      });
      row.parentNode.removeChild(row);
      //浏览器方法本身存在bug,采用自定义方法删除
      //this.table.deleteRow(rowIndex);
      this.update();
    },
    insertCol:function (colIndex, sourceCell, defaultValue) {
      var rowsNum = this.rowsNum,
        rowIndex = 0,
        tableRow, cell,
        backWidth = parseInt((this.table.offsetWidth - (this.colsNum + 1) * 20 - (this.colsNum + 1)) / (this.colsNum + 1), 10),
        isInsertTitleCol = typeof sourceCell == 'string' && sourceCell.toUpperCase() == 'TH';

      function replaceTdToTh(rowIndex, cell, tableRow) {
        if (rowIndex == 0) {
          var th = cell.nextSibling || cell.previousSibling;
          if (th.tagName == 'TH') {
            th = cell.ownerDocument.createElement("th");
            th.appendChild(cell.firstChild);
            tableRow.insertBefore(th, cell);
            domUtils.remove(cell)
          }
        }else{
          if (cell.tagName == 'TH') {
            var td = cell.ownerDocument.createElement("td");
            td.appendChild(cell.firstChild);
            tableRow.insertBefore(td, cell);
            domUtils.remove(cell)
          }
        }
      }

      var preCell;
      if (colIndex == 0 || colIndex == this.colsNum) {
        for (; rowIndex < rowsNum; rowIndex++) {
          tableRow = this.table.rows[rowIndex];
          preCell = tableRow.cells[colIndex == 0 ? colIndex : tableRow.cells.length];
          cell = this.cloneCell(sourceCell, true); //tableRow.insertCell(colIndex == 0 ? colIndex : tableRow.cells.length);
          this.setCellContent(cell);
          cell.setAttribute('vAlign', cell.getAttribute('vAlign'));
          preCell && cell.setAttribute('width', preCell.getAttribute('width'));
          if (!colIndex) {
            tableRow.insertBefore(cell, tableRow.cells[0]);
          } else {
            domUtils.insertAfter(tableRow.cells[tableRow.cells.length - 1], cell);
          }
          if(!isInsertTitleCol) replaceTdToTh(rowIndex, cell, tableRow)
        }
      } else {
        for (; rowIndex < rowsNum; rowIndex++) {
          var cellInfo = this.indexTable[rowIndex][colIndex];
          if (cellInfo.colIndex < colIndex) {
            cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
            cell.colSpan = cellInfo.colSpan + 1;
          } else {
            tableRow = this.table.rows[rowIndex];
            preCell = tableRow.cells[cellInfo.cellIndex];

            cell = this.cloneCell(sourceCell, true);//tableRow.insertCell(cellInfo.cellIndex);
            this.setCellContent(cell);
            cell.setAttribute('vAlign', cell.getAttribute('vAlign'));
            preCell && cell.setAttribute('width', preCell.getAttribute('width'));
            //防止IE下报错
            preCell ? tableRow.insertBefore(cell, preCell) : tableRow.appendChild(cell);
          }
          if(!isInsertTitleCol) replaceTdToTh(rowIndex, cell, tableRow);
        }
      }
      //框选时插入不触发contentchange，需要手动更新索引
      this.update();
      this.updateWidth(backWidth, defaultValue || {tdPadding:10, tdBorder:1});
    },
    updateWidth:function (width, defaultValue) {
      var table = this.table,
        tmpWidth = UETable.getWidth(table) - defaultValue.tdPadding * 2 - defaultValue.tdBorder + width;
      if (tmpWidth < table.ownerDocument.body.offsetWidth) {
        table.setAttribute("width", tmpWidth);
        return;
      }
      var tds = domUtils.getElementsByTagName(this.table, "td th");
      utils.each(tds, function (td) {
        td.setAttribute("width", width);
      })
    },
    deleteCol:function (colIndex) {
      var indexTable = this.indexTable,
        tableRows = this.table.rows,
        backTableWidth = this.table.getAttribute("width"),
        backTdWidth = 0,
        rowsNum = this.rowsNum,
        cacheMap = {};
      for (var rowIndex = 0; rowIndex < rowsNum;) {
        var infoRow = indexTable[rowIndex],
          cellInfo = infoRow[colIndex],
          key = cellInfo.rowIndex + '_' + cellInfo.colIndex;
        // 跳过已经处理过的Cell
        if (cacheMap[key])continue;
        cacheMap[key] = 1;
        var cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
        if (!backTdWidth) backTdWidth = cell && parseInt(cell.offsetWidth / cell.colSpan, 10).toFixed(0);
        // 如果Cell的colSpan大于1, 就修改colSpan, 否则就删掉这个Cell
        if (cell.colSpan > 1) {
          cell.colSpan--;
        } else {
          tableRows[rowIndex].deleteCell(cellInfo.cellIndex);
        }
        rowIndex += cellInfo.rowSpan || 1;
      }
      this.table.setAttribute("width", backTableWidth - backTdWidth);
      this.update();
    },
    splitToCells:function (cell) {
      var me = this,
        cells = this.splitToRows(cell);
      utils.each(cells, function (cell) {
        me.splitToCols(cell);
      })
    },
    splitToRows:function (cell) {
      var cellInfo = this.getCellInfo(cell),
        rowIndex = cellInfo.rowIndex,
        colIndex = cellInfo.colIndex,
        results = [];
      // 修改Cell的rowSpan
      cell.rowSpan = 1;
      results.push(cell);
      // 补齐单元格
      for (var i = rowIndex, endRow = rowIndex + cellInfo.rowSpan; i < endRow; i++) {
        if (i == rowIndex)continue;
        var tableRow = this.table.rows[i],
          tmpCell = tableRow.insertCell(colIndex - this.getPreviewMergedCellsNum(i, colIndex));
        tmpCell.colSpan = cellInfo.colSpan;
        this.setCellContent(tmpCell);
        tmpCell.setAttribute('vAlign', cell.getAttribute('vAlign'));
        tmpCell.setAttribute('align', cell.getAttribute('align'));
        if (cell.style.cssText) {
          tmpCell.style.cssText = cell.style.cssText;
        }
        results.push(tmpCell);
      }
      this.update();
      return results;
    },
    getPreviewMergedCellsNum:function (rowIndex, colIndex) {
      var indexRow = this.indexTable[rowIndex],
        num = 0;
      for (var i = 0; i < colIndex;) {
        var colSpan = indexRow[i].colSpan,
          tmpRowIndex = indexRow[i].rowIndex;
        num += (colSpan - (tmpRowIndex == rowIndex ? 1 : 0));
        i += colSpan;
      }
      return num;
    },
    splitToCols:function (cell) {
      var backWidth = (cell.offsetWidth / cell.colSpan - 22).toFixed(0),

        cellInfo = this.getCellInfo(cell),
        rowIndex = cellInfo.rowIndex,
        colIndex = cellInfo.colIndex,
        results = [];
      // 修改Cell的rowSpan
      cell.colSpan = 1;
      cell.setAttribute("width", backWidth);
      results.push(cell);
      // 补齐单元格
      for (var j = colIndex, endCol = colIndex + cellInfo.colSpan; j < endCol; j++) {
        if (j == colIndex)continue;
        var tableRow = this.table.rows[rowIndex],
          tmpCell = tableRow.insertCell(this.indexTable[rowIndex][j].cellIndex + 1);
        tmpCell.rowSpan = cellInfo.rowSpan;
        this.setCellContent(tmpCell);
        tmpCell.setAttribute('vAlign', cell.getAttribute('vAlign'));
        tmpCell.setAttribute('align', cell.getAttribute('align'));
        tmpCell.setAttribute('width', backWidth);
        if (cell.style.cssText) {
          tmpCell.style.cssText = cell.style.cssText;
        }
        //处理th的情况
        if (cell.tagName == 'TH') {
          var th = cell.ownerDocument.createElement('th');
          th.appendChild(tmpCell.firstChild);
          th.setAttribute('vAlign', cell.getAttribute('vAlign'));
          th.rowSpan = tmpCell.rowSpan;
          tableRow.insertBefore(th, tmpCell);
          domUtils.remove(tmpCell);
        }
        results.push(tmpCell);
      }
      this.update();
      return results;
    },
    isLastCell:function (cell, rowsNum, colsNum) {
      rowsNum = rowsNum || this.rowsNum;
      colsNum = colsNum || this.colsNum;
      var cellInfo = this.getCellInfo(cell);
      return ((cellInfo.rowIndex + cellInfo.rowSpan) == rowsNum) &&
        ((cellInfo.colIndex + cellInfo.colSpan) == colsNum);
    },
    getLastCell:function (cells) {
      cells = cells || this.table.getElementsByTagName("td");
      var firstInfo = this.getCellInfo(cells[0]);
      var me = this, last = cells[0],
        tr = last.parentNode,
        cellsNum = 0, cols = 0, rows;
      utils.each(cells, function (cell) {
        if (cell.parentNode == tr)cols += cell.colSpan || 1;
        cellsNum += cell.rowSpan * cell.colSpan || 1;
      });
      rows = cellsNum / cols;
      utils.each(cells, function (cell) {
        if (me.isLastCell(cell, rows, cols)) {
          last = cell;
          return false;
        }
      });
      return last;

    },
    selectRow:function (rowIndex) {
      var indexRow = this.indexTable[rowIndex],
        start = this.getCell(indexRow[0].rowIndex, indexRow[0].cellIndex),
        end = this.getCell(indexRow[this.colsNum - 1].rowIndex, indexRow[this.colsNum - 1].cellIndex),
        range = this.getCellsRange(start, end);
      this.setSelected(range);
    },
    selectTable:function () {
      var tds = this.table.getElementsByTagName("td"),
        range = this.getCellsRange(tds[0], tds[tds.length - 1]);
      this.setSelected(range);
    },
    setBackground:function (cells, value) {
      if (typeof value === "string") {
        utils.each(cells, function (cell) {
          cell.style.backgroundColor = value;
        })
      } else if (typeof value === "object") {
        value = utils.extend({
          repeat:true,
          colorList:["#ddd", "#fff"]
        }, value);
        var rowIndex = this.getCellInfo(cells[0]).rowIndex,
          count = 0,
          colors = value.colorList,
          getColor = function (list, index, repeat) {
            return list[index] ? list[index] : repeat ? list[index % list.length] : "";
          };
        for (var i = 0, cell; cell = cells[i++];) {
          var cellInfo = this.getCellInfo(cell);
          cell.style.backgroundColor = getColor(colors, ((rowIndex + count) == cellInfo.rowIndex) ? count : ++count, value.repeat);
        }
      }
    },
    removeBackground:function (cells) {
      utils.each(cells, function (cell) {
        cell.style.backgroundColor = "";
      })
    }


  };
  function showError(e) {
  }
})();

// plugins/table.cmds.js
/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-20
 * Time: 下午6:25
 * To change this template use File | Settings | File Templates.
 */
;
(function () {
  var UT = UE.UETable,
    getTableItemsByRange = function (editor) {
      return UT.getTableItemsByRange(editor);
    },
    getUETableBySelected = function (editor) {
      return UT.getUETableBySelected(editor)
    },
    getDefaultValue = function (editor, table) {
      return UT.getDefaultValue(editor, table);
    },
    getUETable = function (tdOrTable) {
      return UT.getUETable(tdOrTable);
    };


  UE.commands['inserttable'] = {
    queryCommandState: function () {
      return getTableItemsByRange(this).table ? -1 : 0;
    },
    execCommand: function (cmd, opt) {
      function createTable(opt, tdWidth) {
        var html = [],
          rowsNum = opt.numRows,
          colsNum = opt.numCols;
        for (var r = 0; r < rowsNum; r++) {
          html.push('<tr' + (r == 0 ? ' class="firstRow"':'') + '>');
          for (var c = 0; c < colsNum; c++) {
            html.push('<td width="' + tdWidth + '"  vAlign="' + opt.tdvalign + '" >' + (browser.ie && browser.version < 11 ? domUtils.fillChar : '<br/>') + '</td>')
          }
          html.push('</tr>')
        }
        //禁止指定table-width
        return '<table><tbody>' + html.join('') + '</tbody></table>'
      }

      if (!opt) {
        opt = utils.extend({}, {
          numCols: this.options.defaultCols,
          numRows: this.options.defaultRows,
          tdvalign: this.options.tdvalign
        })
      }
      var me = this;
      var range = this.selection.getRange(),
        start = range.startContainer,
        firstParentBlock = domUtils.findParent(start, function (node) {
          return domUtils.isBlockElm(node);
        }, true) || me.body;

      var defaultValue = getDefaultValue(me),
        tableWidth = firstParentBlock.offsetWidth,
        tdWidth = Math.floor(tableWidth / opt.numCols - defaultValue.tdPadding * 2 - defaultValue.tdBorder);

      //todo其他属性
      !opt.tdvalign && (opt.tdvalign = me.options.tdvalign);
      me.execCommand("inserthtml", createTable(opt, tdWidth));
    }
  };

  UE.commands['insertparagraphbeforetable'] = {
    queryCommandState: function () {
      return getTableItemsByRange(this).cell ? 0 : -1;
    },
    execCommand: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        var p = this.document.createElement("p");
        p.innerHTML = browser.ie ? '&nbsp;' : '<br />';
        table.parentNode.insertBefore(p, table);
        this.selection.getRange().setStart(p, 0).setCursor();
      }
    }
  };

  UE.commands['deletetable'] = {
    queryCommandState: function () {
      var rng = this.selection.getRange();
      return domUtils.findParentByTagName(rng.startContainer, 'table', true) ? 0 : -1;
    },
    execCommand: function (cmd, table) {
      var rng = this.selection.getRange();
      table = table || domUtils.findParentByTagName(rng.startContainer, 'table', true);
      if (table) {
        var next = table.nextSibling;
        if (!next) {
          next = domUtils.createElement(this.document, 'p', {
            'innerHTML': browser.ie ? domUtils.fillChar : '<br/>'
          });
          table.parentNode.insertBefore(next, table);
        }
        domUtils.remove(table);
        rng = this.selection.getRange();
        if (next.nodeType == 3) {
          rng.setStartBefore(next)
        } else {
          rng.setStart(next, 0)
        }
        rng.setCursor(false, true)
        this.fireEvent("tablehasdeleted")

      }

    }
  };
  UE.commands['cellalign'] = {
    queryCommandState: function () {
      return getSelectedArr(this).length ? 0 : -1
    },
    execCommand: function (cmd, align) {
      var selectedTds = getSelectedArr(this);
      if (selectedTds.length) {
        for (var i = 0, ci; ci = selectedTds[i++];) {
          ci.setAttribute('align', align);
        }
      }
    }
  };
  UE.commands['cellvalign'] = {
    queryCommandState: function () {
      return getSelectedArr(this).length ? 0 : -1;
    },
    execCommand: function (cmd, valign) {
      var selectedTds = getSelectedArr(this);
      if (selectedTds.length) {
        for (var i = 0, ci; ci = selectedTds[i++];) {
          ci.setAttribute('vAlign', valign);
        }
      }
    }
  };
  UE.commands['insertcaption'] = {
    queryCommandState: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        return table.getElementsByTagName('caption').length == 0 ? 1 : -1;
      }
      return -1;
    },
    execCommand: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        var caption = this.document.createElement('caption');
        caption.innerHTML = browser.ie ? domUtils.fillChar : '<br/>';
        table.insertBefore(caption, table.firstChild);
        var range = this.selection.getRange();
        range.setStart(caption, 0).setCursor();
      }

    }
  };
  UE.commands['deletecaption'] = {
    queryCommandState: function () {
      var rng = this.selection.getRange(),
        table = domUtils.findParentByTagName(rng.startContainer, 'table');
      if (table) {
        return table.getElementsByTagName('caption').length == 0 ? -1 : 1;
      }
      return -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        table = domUtils.findParentByTagName(rng.startContainer, 'table');
      if (table) {
        domUtils.remove(table.getElementsByTagName('caption')[0]);
        var range = this.selection.getRange();
        range.setStart(table.rows[0].cells[0], 0).setCursor();
      }

    }
  };
  UE.commands['inserttitle'] = {
    queryCommandState: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        var firstRow = table.rows[0];
        return firstRow.cells[firstRow.cells.length-1].tagName.toLowerCase() != 'th' ? 0 : -1
      }
      return -1;
    },
    execCommand: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        getUETable(table).insertRow(0, 'th');
      }
      var th = table.getElementsByTagName('th')[0];
      this.selection.getRange().setStart(th, 0).setCursor(false, true);
    }
  };
  UE.commands['deletetitle'] = {
    queryCommandState: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        var firstRow = table.rows[0];
        return firstRow.cells[firstRow.cells.length-1].tagName.toLowerCase() == 'th' ? 0 : -1
      }
      return -1;
    },
    execCommand: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        domUtils.remove(table.rows[0])
      }
      var td = table.getElementsByTagName('td')[0];
      this.selection.getRange().setStart(td, 0).setCursor(false, true);
    }
  };
  UE.commands['inserttitlecol'] = {
    queryCommandState: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        var lastRow = table.rows[table.rows.length-1];
        return lastRow.getElementsByTagName('th').length ? -1 : 0;
      }
      return -1;
    },
    execCommand: function (cmd) {
      var table = getTableItemsByRange(this).table;
      if (table) {
        getUETable(table).insertCol(0, 'th');
      }
      resetTdWidth(table, this);
      var th = table.getElementsByTagName('th')[0];
      this.selection.getRange().setStart(th, 0).setCursor(false, true);
    }
  };
  UE.commands['deletetitlecol'] = {
    queryCommandState: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        var lastRow = table.rows[table.rows.length-1];
        return lastRow.getElementsByTagName('th').length ? 0 : -1;
      }
      return -1;
    },
    execCommand: function () {
      var table = getTableItemsByRange(this).table;
      if (table) {
        for(var i = 0; i< table.rows.length; i++ ){
          domUtils.remove(table.rows[i].children[0])
        }
      }
      resetTdWidth(table, this);
      var td = table.getElementsByTagName('td')[0];
      this.selection.getRange().setStart(td, 0).setCursor(false, true);
    }
  };

  UE.commands["mergeright"] = {
    queryCommandState: function (cmd) {
      var tableItems = getTableItemsByRange(this),
        table = tableItems.table,
        cell = tableItems.cell;

      if (!table || !cell) return -1;
      var ut = getUETable(table);
      if (ut.selectedTds.length) return -1;

      var cellInfo = ut.getCellInfo(cell),
        rightColIndex = cellInfo.colIndex + cellInfo.colSpan;
      if (rightColIndex >= ut.colsNum) return -1; // 如果处于最右边则不能向右合并

      var rightCellInfo = ut.indexTable[cellInfo.rowIndex][rightColIndex],
        rightCell = table.rows[rightCellInfo.rowIndex].cells[rightCellInfo.cellIndex];
      if (!rightCell || cell.tagName != rightCell.tagName) return -1; // TH和TD不能相互合并

      // 当且仅当两个Cell的开始列号和结束列号一致时能进行合并
      return (rightCellInfo.rowIndex == cellInfo.rowIndex && rightCellInfo.rowSpan == cellInfo.rowSpan) ? 0 : -1;
    },
    execCommand: function (cmd) {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell);
      ut.mergeRight(cell);
      rng.moveToBookmark(bk).select();
    }
  };
  UE.commands["mergedown"] = {
    queryCommandState: function (cmd) {
      var tableItems = getTableItemsByRange(this),
        table = tableItems.table,
        cell = tableItems.cell;

      if (!table || !cell) return -1;
      var ut = getUETable(table);
      if (ut.selectedTds.length)return -1;

      var cellInfo = ut.getCellInfo(cell),
        downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan;
      if (downRowIndex >= ut.rowsNum) return -1; // 如果处于最下边则不能向下合并

      var downCellInfo = ut.indexTable[downRowIndex][cellInfo.colIndex],
        downCell = table.rows[downCellInfo.rowIndex].cells[downCellInfo.cellIndex];
      if (!downCell || cell.tagName != downCell.tagName) return -1; // TH和TD不能相互合并

      // 当且仅当两个Cell的开始列号和结束列号一致时能进行合并
      return (downCellInfo.colIndex == cellInfo.colIndex && downCellInfo.colSpan == cellInfo.colSpan) ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell);
      ut.mergeDown(cell);
      rng.moveToBookmark(bk).select();
    }
  };
  UE.commands["mergecells"] = {
    queryCommandState: function () {
      return getUETableBySelected(this) ? 0 : -1;
    },
    execCommand: function () {
      var ut = getUETableBySelected(this);
      if (ut && ut.selectedTds.length) {
        var cell = ut.selectedTds[0];
        ut.mergeRange();
        var rng = this.selection.getRange();
        if (domUtils.isEmptyBlock(cell)) {
          rng.setStart(cell, 0).collapse(true)
        } else {
          rng.selectNodeContents(cell)
        }
        rng.select();
      }


    }
  };
  UE.commands["insertrow"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      return cell && (cell.tagName == "TD" || (cell.tagName == 'TH' && tableItems.tr !== tableItems.table.rows[0])) &&
        getUETable(tableItems.table).rowsNum < this.options.maxRowNum ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell,
        table = tableItems.table,
        ut = getUETable(table),
        cellInfo = ut.getCellInfo(cell);
      //ut.insertRow(!ut.selectedTds.length ? cellInfo.rowIndex:ut.cellsRange.beginRowIndex,'');
      if (!ut.selectedTds.length) {
        ut.insertRow(cellInfo.rowIndex, cell);
      } else {
        var range = ut.cellsRange;
        for (var i = 0, len = range.endRowIndex - range.beginRowIndex + 1; i < len; i++) {
          ut.insertRow(range.beginRowIndex, cell);
        }
      }
      rng.moveToBookmark(bk).select();
      if (table.getAttribute("interlaced") === "enabled")this.fireEvent("interlacetable", table);
    }
  };
  //后插入行
  UE.commands["insertrownext"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      return cell && (cell.tagName == "TD") && getUETable(tableItems.table).rowsNum < this.options.maxRowNum ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell,
        table = tableItems.table,
        ut = getUETable(table),
        cellInfo = ut.getCellInfo(cell);
      //ut.insertRow(!ut.selectedTds.length? cellInfo.rowIndex + cellInfo.rowSpan : ut.cellsRange.endRowIndex + 1,'');
      if (!ut.selectedTds.length) {
        ut.insertRow(cellInfo.rowIndex + cellInfo.rowSpan, cell);
      } else {
        var range = ut.cellsRange;
        for (var i = 0, len = range.endRowIndex - range.beginRowIndex + 1; i < len; i++) {
          ut.insertRow(range.endRowIndex + 1, cell);
        }
      }
      rng.moveToBookmark(bk).select();
      if (table.getAttribute("interlaced") === "enabled")this.fireEvent("interlacetable", table);
    }
  };
  UE.commands["deleterow"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this);
      return tableItems.cell ? 0 : -1;
    },
    execCommand: function () {
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell),
        cellsRange = ut.cellsRange,
        cellInfo = ut.getCellInfo(cell),
        preCell = ut.getVSideCell(cell),
        nextCell = ut.getVSideCell(cell, true),
        rng = this.selection.getRange();
      if (utils.isEmptyObject(cellsRange)) {
        ut.deleteRow(cellInfo.rowIndex);
      } else {
        for (var i = cellsRange.beginRowIndex; i < cellsRange.endRowIndex + 1; i++) {
          ut.deleteRow(cellsRange.beginRowIndex);
        }
      }
      var table = ut.table;
      if (!table.getElementsByTagName('td').length) {
        var nextSibling = table.nextSibling;
        domUtils.remove(table);
        if (nextSibling) {
          rng.setStart(nextSibling, 0).setCursor(false, true);
        }
      } else {
        if (cellInfo.rowSpan == 1 || cellInfo.rowSpan == cellsRange.endRowIndex - cellsRange.beginRowIndex + 1) {
          if (nextCell || preCell) rng.selectNodeContents(nextCell || preCell).setCursor(false, true);
        } else {
          var newCell = ut.getCell(cellInfo.rowIndex, ut.indexTable[cellInfo.rowIndex][cellInfo.colIndex].cellIndex);
          if (newCell) rng.selectNodeContents(newCell).setCursor(false, true);
        }
      }
      if (table.getAttribute("interlaced") === "enabled")this.fireEvent("interlacetable", table);
    }
  };
  UE.commands["insertcol"] = {
    queryCommandState: function (cmd) {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      return cell && (cell.tagName == "TD" || (cell.tagName == 'TH' && cell !== tableItems.tr.cells[0])) &&
        getUETable(tableItems.table).colsNum < this.options.maxColNum ? 0 : -1;
    },
    execCommand: function (cmd) {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      if (this.queryCommandState(cmd) == -1)return;
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell),
        cellInfo = ut.getCellInfo(cell);

      //ut.insertCol(!ut.selectedTds.length ? cellInfo.colIndex:ut.cellsRange.beginColIndex);
      if (!ut.selectedTds.length) {
        ut.insertCol(cellInfo.colIndex, cell);
      } else {
        var range = ut.cellsRange;
        for (var i = 0, len = range.endColIndex - range.beginColIndex + 1; i < len; i++) {
          ut.insertCol(range.beginColIndex, cell);
        }
      }
      rng.moveToBookmark(bk).select(true);
    }
  };
  UE.commands["insertcolnext"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      return cell && getUETable(tableItems.table).colsNum < this.options.maxColNum ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell),
        cellInfo = ut.getCellInfo(cell);
      //ut.insertCol(!ut.selectedTds.length ? cellInfo.colIndex + cellInfo.colSpan:ut.cellsRange.endColIndex +1);
      if (!ut.selectedTds.length) {
        ut.insertCol(cellInfo.colIndex + cellInfo.colSpan, cell);
      } else {
        var range = ut.cellsRange;
        for (var i = 0, len = range.endColIndex - range.beginColIndex + 1; i < len; i++) {
          ut.insertCol(range.endColIndex + 1, cell);
        }
      }
      rng.moveToBookmark(bk).select();
    }
  };

  UE.commands["deletecol"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this);
      return tableItems.cell ? 0 : -1;
    },
    execCommand: function () {
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell),
        range = ut.cellsRange,
        cellInfo = ut.getCellInfo(cell),
        preCell = ut.getHSideCell(cell),
        nextCell = ut.getHSideCell(cell, true);
      if (utils.isEmptyObject(range)) {
        ut.deleteCol(cellInfo.colIndex);
      } else {
        for (var i = range.beginColIndex; i < range.endColIndex + 1; i++) {
          ut.deleteCol(range.beginColIndex);
        }
      }
      var table = ut.table,
        rng = this.selection.getRange();

      if (!table.getElementsByTagName('td').length) {
        var nextSibling = table.nextSibling;
        domUtils.remove(table);
        if (nextSibling) {
          rng.setStart(nextSibling, 0).setCursor(false, true);
        }
      } else {
        if (domUtils.inDoc(cell, this.document)) {
          rng.setStart(cell, 0).setCursor(false, true);
        } else {
          if (nextCell && domUtils.inDoc(nextCell, this.document)) {
            rng.selectNodeContents(nextCell).setCursor(false, true);
          } else {
            if (preCell && domUtils.inDoc(preCell, this.document)) {
              rng.selectNodeContents(preCell).setCursor(true, true);
            }
          }
        }
      }
    }
  };
  UE.commands["splittocells"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      if (!cell) return -1;
      var ut = getUETable(tableItems.table);
      if (ut.selectedTds.length > 0) return -1;
      return cell && (cell.colSpan > 1 || cell.rowSpan > 1) ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell);
      ut.splitToCells(cell);
      rng.moveToBookmark(bk).select();
    }
  };
  UE.commands["splittorows"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      if (!cell) return -1;
      var ut = getUETable(tableItems.table);
      if (ut.selectedTds.length > 0) return -1;
      return cell && cell.rowSpan > 1 ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell);
      ut.splitToRows(cell);
      rng.moveToBookmark(bk).select();
    }
  };
  UE.commands["splittocols"] = {
    queryCommandState: function () {
      var tableItems = getTableItemsByRange(this),
        cell = tableItems.cell;
      if (!cell) return -1;
      var ut = getUETable(tableItems.table);
      if (ut.selectedTds.length > 0) return -1;
      return cell && cell.colSpan > 1 ? 0 : -1;
    },
    execCommand: function () {
      var rng = this.selection.getRange(),
        bk = rng.createBookmark(true);
      var cell = getTableItemsByRange(this).cell,
        ut = getUETable(cell);
      ut.splitToCols(cell);
      rng.moveToBookmark(bk).select();

    }
  };

  UE.commands["adaptbytext"] =
    UE.commands["adaptbywindow"] = {
      queryCommandState: function () {
        return getTableItemsByRange(this).table ? 0 : -1
      },
      execCommand: function (cmd) {
        var tableItems = getTableItemsByRange(this),
          table = tableItems.table;
        if (table) {
          if (cmd == 'adaptbywindow') {
            resetTdWidth(table, this);
          } else {
            var cells = domUtils.getElementsByTagName(table, "td th");
            utils.each(cells, function (cell) {
              cell.removeAttribute("width");
            });
            table.removeAttribute("width");
          }
        }
      }
    };

  //平均分配各列
  UE.commands['averagedistributecol'] = {
    queryCommandState: function () {
      var ut = getUETableBySelected(this);
      if (!ut) return -1;
      return ut.isFullRow() || ut.isFullCol() ? 0 : -1;
    },
    execCommand: function (cmd) {
      var me = this,
        ut = getUETableBySelected(me);

      function getAverageWidth() {
        var tb = ut.table,
          averageWidth, sumWidth = 0, colsNum = 0,
          tbAttr = getDefaultValue(me, tb);

        if (ut.isFullRow()) {
          sumWidth = tb.offsetWidth;
          colsNum = ut.colsNum;
        } else {
          var begin = ut.cellsRange.beginColIndex,
            end = ut.cellsRange.endColIndex,
            node;
          for (var i = begin; i <= end;) {
            node = ut.selectedTds[i];
            sumWidth += node.offsetWidth;
            i += node.colSpan;
            colsNum += 1;
          }
        }
        averageWidth = Math.ceil(sumWidth / colsNum) - tbAttr.tdBorder * 2 - tbAttr.tdPadding * 2;
        return averageWidth;
      }

      function setAverageWidth(averageWidth) {
        utils.each(domUtils.getElementsByTagName(ut.table, "th"), function (node) {
          node.setAttribute("width", "");
        });
        var cells = ut.isFullRow() ? domUtils.getElementsByTagName(ut.table, "td") : ut.selectedTds;

        utils.each(cells, function (node) {
          if (node.colSpan == 1) {
            node.setAttribute("width", averageWidth);
          }
        });
      }

      if (ut && ut.selectedTds.length) {
        setAverageWidth(getAverageWidth());
      }
    }
  };
  //平均分配各行
  UE.commands['averagedistributerow'] = {
    queryCommandState: function () {
      var ut = getUETableBySelected(this);
      if (!ut) return -1;
      if (ut.selectedTds && /th/ig.test(ut.selectedTds[0].tagName)) return -1;
      return ut.isFullRow() || ut.isFullCol() ? 0 : -1;
    },
    execCommand: function (cmd) {
      var me = this,
        ut = getUETableBySelected(me);

      function getAverageHeight() {
        var averageHeight, rowNum, sumHeight = 0,
          tb = ut.table,
          tbAttr = getDefaultValue(me, tb),
          tdpadding = parseInt(domUtils.getComputedStyle(tb.getElementsByTagName('td')[0], "padding-top"));

        if (ut.isFullCol()) {
          var captionArr = domUtils.getElementsByTagName(tb, "caption"),
            thArr = domUtils.getElementsByTagName(tb, "th"),
            captionHeight, thHeight;

          if (captionArr.length > 0) {
            captionHeight = captionArr[0].offsetHeight;
          }
          if (thArr.length > 0) {
            thHeight = thArr[0].offsetHeight;
          }

          sumHeight = tb.offsetHeight - (captionHeight || 0) - (thHeight || 0);
          rowNum = thArr.length == 0 ? ut.rowsNum : (ut.rowsNum - 1);
        } else {
          var begin = ut.cellsRange.beginRowIndex,
            end = ut.cellsRange.endRowIndex,
            count = 0,
            trs = domUtils.getElementsByTagName(tb, "tr");
          for (var i = begin; i <= end; i++) {
            sumHeight += trs[i].offsetHeight;
            count += 1;
          }
          rowNum = count;
        }
        //ie8下是混杂模式
        if (browser.ie && browser.version < 9) {
          averageHeight = Math.ceil(sumHeight / rowNum);
        } else {
          averageHeight = Math.ceil(sumHeight / rowNum) - tbAttr.tdBorder * 2 - tdpadding * 2;
        }
        return averageHeight;
      }

      function setAverageHeight(averageHeight) {
        var cells = ut.isFullCol() ? domUtils.getElementsByTagName(ut.table, "td") : ut.selectedTds;
        utils.each(cells, function (node) {
          if (node.rowSpan == 1) {
            node.setAttribute("height", averageHeight);
          }
        });
      }

      if (ut && ut.selectedTds.length) {
        setAverageHeight(getAverageHeight());
      }
    }
  };

  //单元格对齐方式
  UE.commands['cellalignment'] = {
    queryCommandState: function () {
      return getTableItemsByRange(this).table ? 0 : -1
    },
    execCommand: function (cmd, data) {
      var me = this,
        ut = getUETableBySelected(me);

      if (!ut) {
        var start = me.selection.getStart(),
          cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], true);
        if (!/caption/ig.test(cell.tagName)) {
          domUtils.setAttributes(cell, data);
        } else {
          cell.style.textAlign = data.align;
          cell.style.verticalAlign = data.vAlign;
        }
        me.selection.getRange().setCursor(true);
      } else {
        utils.each(ut.selectedTds, function (cell) {
          domUtils.setAttributes(cell, data);
        });
      }
    },
    /**
     * 查询当前点击的单元格的对齐状态， 如果当前已经选择了多个单元格， 则会返回所有单元格经过统一协调过后的状态
     * @see UE.UETable.getTableCellAlignState
     */
    queryCommandValue: function (cmd) {

      var activeMenuCell = getTableItemsByRange( this).cell;

      if( !activeMenuCell ) {
        activeMenuCell = getSelectedArr(this)[0];
      }

      if (!activeMenuCell) {

        return null;

      } else {

        //获取同时选中的其他单元格
        var cells = UE.UETable.getUETable(activeMenuCell).selectedTds;

        !cells.length && ( cells = activeMenuCell );

        return UE.UETable.getTableCellAlignState(cells);

      }

    }
  };
  //表格对齐方式
  UE.commands['tablealignment'] = {
    queryCommandState: function () {
      if (browser.ie && browser.version < 8) {
        return -1;
      }
      return getTableItemsByRange(this).table ? 0 : -1
    },
    execCommand: function (cmd, value) {
      var me = this,
        start = me.selection.getStart(),
        table = start && domUtils.findParentByTagName(start, ["table"], true);

      if (table) {
        table.setAttribute("align",value);
      }
    }
  };

  //表格属性
  UE.commands['edittable'] = {
    queryCommandState: function () {
      return getTableItemsByRange(this).table ? 0 : -1
    },
    execCommand: function (cmd, color) {
      var rng = this.selection.getRange(),
        table = domUtils.findParentByTagName(rng.startContainer, 'table');
      if (table) {
        var arr = domUtils.getElementsByTagName(table, "td").concat(
          domUtils.getElementsByTagName(table, "th"),
          domUtils.getElementsByTagName(table, "caption")
        );
        utils.each(arr, function (node) {
          node.style.borderColor = color;
        });
      }
    }
  };
  //单元格属性
  UE.commands['edittd'] = {
    queryCommandState: function () {
      return getTableItemsByRange(this).table ? 0 : -1
    },
    execCommand: function (cmd, bkColor) {
      var me = this,
        ut = getUETableBySelected(me);

      if (!ut) {
        var start = me.selection.getStart(),
          cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], true);
        if (cell) {
          cell.style.backgroundColor = bkColor;
        }
      } else {
        utils.each(ut.selectedTds, function (cell) {
          cell.style.backgroundColor = bkColor;
        });
      }
    }
  };

  UE.commands["settablebackground"] = {
    queryCommandState: function () {
      return getSelectedArr(this).length > 1 ? 0 : -1;
    },
    execCommand: function (cmd, value) {
      var cells, ut;
      cells = getSelectedArr(this);
      ut = getUETable(cells[0]);
      ut.setBackground(cells, value);
    }
  };

  UE.commands["cleartablebackground"] = {
    queryCommandState: function () {
      var cells = getSelectedArr(this);
      if (!cells.length)return -1;
      for (var i = 0, cell; cell = cells[i++];) {
        if (cell.style.backgroundColor !== "") return 0;
      }
      return -1;
    },
    execCommand: function () {
      var cells = getSelectedArr(this),
        ut = getUETable(cells[0]);
      ut.removeBackground(cells);
    }
  };

  UE.commands["interlacetable"] = UE.commands["uninterlacetable"] = {
    queryCommandState: function (cmd) {
      var table = getTableItemsByRange(this).table;
      if (!table) return -1;
      var interlaced = table.getAttribute("interlaced");
      if (cmd == "interlacetable") {
        //TODO 待定
        //是否需要待定，如果设置，则命令只能单次执行成功，但反射具备toggle效果；否则可以覆盖前次命令，但反射将不存在toggle效果
        return (interlaced === "enabled") ? -1 : 0;
      } else {
        return (!interlaced || interlaced === "disabled") ? -1 : 0;
      }
    },
    execCommand: function (cmd, classList) {
      var table = getTableItemsByRange(this).table;
      if (cmd == "interlacetable") {
        table.setAttribute("interlaced", "enabled");
        this.fireEvent("interlacetable", table, classList);
      } else {
        table.setAttribute("interlaced", "disabled");
        this.fireEvent("uninterlacetable", table);
      }
    }
  };
  UE.commands["setbordervisible"] = {
    queryCommandState: function (cmd) {
      var table = getTableItemsByRange(this).table;
      if (!table) return -1;
      return 0;
    },
    execCommand: function () {
      var table = getTableItemsByRange(this).table;
      utils.each(domUtils.getElementsByTagName(table,'td'),function(td){
        td.style.borderWidth = '1px';
        td.style.borderStyle = 'solid';
      })
    }
  };
  function resetTdWidth(table, editor) {
    var tds = domUtils.getElementsByTagName(table,'td th');
    utils.each(tds, function (td) {
      td.removeAttribute("width");
    });
    table.setAttribute('width', getTableWidth(editor, true, getDefaultValue(editor, table)));
    var tdsWidths = [];
    setTimeout(function () {
      utils.each(tds, function (td) {
        (td.colSpan == 1) && tdsWidths.push(td.offsetWidth)
      })
      utils.each(tds, function (td,i) {
        (td.colSpan == 1) && td.setAttribute("width", tdsWidths[i] + "");
      })
    }, 0);
  }

  function getTableWidth(editor, needIEHack, defaultValue) {
    var body = editor.body;
    return body.offsetWidth - (needIEHack ? parseInt(domUtils.getComputedStyle(body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (editor.options.offsetWidth || 0);
  }

  function getSelectedArr(editor) {
    var cell = getTableItemsByRange(editor).cell;
    if (cell) {
      var ut = getUETable(cell);
      return ut.selectedTds.length ? ut.selectedTds : [cell];
    } else {
      return [];
    }
  }
})();

// plugins/table.action.js
/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-10-12
 * Time: 上午10:05
 * To change this template use File | Settings | File Templates.
 */
UE.plugins['table'] = function () {
  var me = this,
    tabTimer = null,
  //拖动计时器
    tableDragTimer = null,
  //双击计时器
    tableResizeTimer = null,
  //单元格最小宽度
    cellMinWidth = 5,
    isInResizeBuffer = false,
  //单元格边框大小
    cellBorderWidth = 5,
  //鼠标偏移距离
    offsetOfTableCell = 10,
  //记录在有限时间内的点击状态， 共有3个取值， 0, 1, 2。 0代表未初始化， 1代表单击了1次，2代表2次
    singleClickState = 0,
    userActionStatus = null,
  //双击允许的时间范围
    dblclickTime = 360,
    UT = UE.UETable,
    getUETable = function (tdOrTable) {
      return UT.getUETable(tdOrTable);
    },
    getUETableBySelected = function (editor) {
      return UT.getUETableBySelected(editor);
    },
    getDefaultValue = function (editor, table) {
      return UT.getDefaultValue(editor, table);
    },
    removeSelectedClass = function (cells) {
      return UT.removeSelectedClass(cells);
    };

  function showError(e) {
//        throw e;
  }
  me.ready(function(){
    var me = this;
    var orgGetText = me.selection.getText;
    me.selection.getText = function(){
      var table = getUETableBySelected(me);
      if(table){
        var str = '';
        utils.each(table.selectedTds,function(td){
          str += td[browser.ie?'innerText':'textContent'];
        })
        return str;
      }else{
        return orgGetText.call(me.selection)
      }

    }
  })

  //处理拖动及框选相关方法
  var startTd = null, //鼠标按下时的锚点td
    currentTd = null, //当前鼠标经过时的td
    onDrag = "", //指示当前拖动状态，其值可为"","h","v" ,分别表示未拖动状态，横向拖动状态，纵向拖动状态，用于鼠标移动过程中的判断
    onBorder = false, //检测鼠标按下时是否处在单元格边缘位置
    dragButton = null,
    dragOver = false,
    dragLine = null, //模拟的拖动线
    dragTd = null;    //发生拖动的目标td

  var mousedown = false,
  //todo 判断混乱模式
    needIEHack = true;

  me.setOpt({
    'maxColNum':20,
    'maxRowNum':100,
    'defaultCols':5,
    'defaultRows':5,
    'tdvalign':'top',
    'cursorpath':me.options.UEDITOR_HOME_URL + "themes/default/images/cursor_",
    'tableDragable':false,
    'classList':["ue-table-interlace-color-single","ue-table-interlace-color-double"]
  });
  me.getUETable = getUETable;
  var commands = {
    'deletetable':1,
    'inserttable':1,
    'cellvalign':1,
    'insertcaption':1,
    'deletecaption':1,
    'inserttitle':1,
    'deletetitle':1,
    "mergeright":1,
    "mergedown":1,
    "mergecells":1,
    "insertrow":1,
    "insertrownext":1,
    "deleterow":1,
    "insertcol":1,
    "insertcolnext":1,
    "deletecol":1,
    "splittocells":1,
    "splittorows":1,
    "splittocols":1,
    "adaptbytext":1,
    "adaptbywindow":1,
    "adaptbycustomer":1,
    "insertparagraph":1,
    "insertparagraphbeforetable":1,
    "averagedistributecol":1,
    "averagedistributerow":1
  };
  me.ready(function () {
    utils.cssRule('table',
      //选中的td上的样式
        '.selectTdClass{background-color:#edf5fa !important}' +
        'table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{}' +
        //插入的表格的默认样式
        'table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
        'td,th{padding: 5px 10px;  border: 1px solid #333;}' +
        'caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
        'th{border-top:1px solid #BBB;background-color:#F7F7F7;}' +
        'table tr.firstRow th{border-top-width:2px;}' +
        '.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }' +
        'td p{margin:0;padding:0;}', me.document);

    var tableCopyList, isFullCol, isFullRow;
    //注册del/backspace事件
    me.addListener('keydown', function (cmd, evt) {
      return;
      var me = this;
      var keyCode = evt.keyCode || evt.which;

      if (keyCode == 8) {

        var ut = getUETableBySelected(me);
        if (ut && ut.selectedTds.length) {

          if (ut.isFullCol()) {
            me.execCommand('deletecol')
          } else if (ut.isFullRow()) {
            me.execCommand('deleterow')
          } else {
            me.fireEvent('delcells');
          }
          domUtils.preventDefault(evt);
        }

        var caption = domUtils.findParentByTagName(me.selection.getStart(), 'caption', true),
          range = me.selection.getRange();
        if (range.collapsed && caption && isEmptyBlock(caption)) {
          me.fireEvent('saveScene');
          var table = caption.parentNode;
          domUtils.remove(caption);
          if (table) {
            range.setStart(table.rows[0].cells[0], 0).setCursor(false, true);
          }
          me.fireEvent('saveScene');
        }

      }

      if (keyCode == 46) {

        ut = getUETableBySelected(me);
        if (ut) {
          me.fireEvent('saveScene');
          for (var i = 0, ci; ci = ut.selectedTds[i++];) {
            domUtils.fillNode(me.document, ci)
          }
          me.fireEvent('saveScene');
          domUtils.preventDefault(evt);

        }

      }
      if (keyCode == 13) {

        var rng = me.selection.getRange(),
          caption = domUtils.findParentByTagName(rng.startContainer, 'caption', true);
        if (caption) {
          var table = domUtils.findParentByTagName(caption, 'table');
          if (!rng.collapsed) {

            rng.deleteContents();
            me.fireEvent('saveScene');
          } else {
            if (caption) {
              rng.setStart(table.rows[0].cells[0], 0).setCursor(false, true);
            }
          }
          domUtils.preventDefault(evt);
          return;
        }
        if (rng.collapsed) {
          var table = domUtils.findParentByTagName(rng.startContainer, 'table');
          if (table) {
            var cell = table.rows[0].cells[0],
              start = domUtils.findParentByTagName(me.selection.getStart(), ['td', 'th'], true),
              preNode = table.previousSibling;
            if (cell === start && (!preNode || preNode.nodeType == 1 && preNode.tagName == 'TABLE' ) && domUtils.isStartInblock(rng)) {
              var first = domUtils.findParent(me.selection.getStart(), function(n){return domUtils.isBlockElm(n)}, true);
              if(first && ( /t(h|d)/i.test(first.tagName) || first ===  start.firstChild )){
                me.execCommand('insertparagraphbeforetable');
                domUtils.preventDefault(evt);
              }

            }
          }
        }
      }

      if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == '67') {
        tableCopyList = null;
        var ut = getUETableBySelected(me);
        if (ut) {
          var tds = ut.selectedTds;
          isFullCol = ut.isFullCol();
          isFullRow = ut.isFullRow();
          tableCopyList = [
            [ut.cloneCell(tds[0],null,true)]
          ];
          for (var i = 1, ci; ci = tds[i]; i++) {
            if (ci.parentNode !== tds[i - 1].parentNode) {
              tableCopyList.push([ut.cloneCell(ci,null,true)]);
            } else {
              tableCopyList[tableCopyList.length - 1].push(ut.cloneCell(ci,null,true));
            }

          }
        }
      }
    });
    me.addListener("tablehasdeleted",function(){
      toggleDraggableState(this, false, "", null);
      if (dragButton)domUtils.remove(dragButton);
    });

    me.addListener('beforepaste', function (cmd, html) {
      var me = this;
      var rng = me.selection.getRange();
      if (domUtils.findParentByTagName(rng.startContainer, 'caption', true)) {
        var div = me.document.createElement("div");
        div.innerHTML = html.html;
        //trace:3729
        html.html = div[browser.ie9below ? 'innerText' : 'textContent'];
        return;
      }
      var table = getUETableBySelected(me);
      if (tableCopyList) {
        me.fireEvent('saveScene');
        var rng = me.selection.getRange();
        var td = domUtils.findParentByTagName(rng.startContainer, ['td', 'th'], true), tmpNode, preNode;
        if (td) {
          var ut = getUETable(td);
          if (isFullRow) {
            var rowIndex = ut.getCellInfo(td).rowIndex;
            if (td.tagName == 'TH') {
              rowIndex++;
            }
            for (var i = 0, ci; ci = tableCopyList[i++];) {
              var tr = ut.insertRow(rowIndex++, "td");
              for (var j = 0, cj; cj = ci[j]; j++) {
                var cell = tr.cells[j];
                if (!cell) {
                  cell = tr.insertCell(j)
                }
                cell.innerHTML = cj.innerHTML;
                cj.getAttribute('width') && cell.setAttribute('width', cj.getAttribute('width'));
                cj.getAttribute('vAlign') && cell.setAttribute('vAlign', cj.getAttribute('vAlign'));
                cj.getAttribute('align') && cell.setAttribute('align', cj.getAttribute('align'));
                cj.style.cssText && (cell.style.cssText = cj.style.cssText)
              }
              for (var j = 0, cj; cj = tr.cells[j]; j++) {
                if (!ci[j])
                  break;
                cj.innerHTML = ci[j].innerHTML;
                ci[j].getAttribute('width') && cj.setAttribute('width', ci[j].getAttribute('width'));
                ci[j].getAttribute('vAlign') && cj.setAttribute('vAlign', ci[j].getAttribute('vAlign'));
                ci[j].getAttribute('align') && cj.setAttribute('align', ci[j].getAttribute('align'));
                ci[j].style.cssText && (cj.style.cssText = ci[j].style.cssText)
              }
            }
          } else {
            if (isFullCol) {
              cellInfo = ut.getCellInfo(td);
              var maxColNum = 0;
              for (var j = 0, ci = tableCopyList[0], cj; cj = ci[j++];) {
                maxColNum += cj.colSpan || 1;
              }
              me.__hasEnterExecCommand = true;
              for (i = 0; i < maxColNum; i++) {
                me.execCommand('insertcol');
              }
              me.__hasEnterExecCommand = false;
              td = ut.table.rows[0].cells[cellInfo.cellIndex];
              if (td.tagName == 'TH') {
                td = ut.table.rows[1].cells[cellInfo.cellIndex];
              }
            }
            for (var i = 0, ci; ci = tableCopyList[i++];) {
              tmpNode = td;
              for (var j = 0, cj; cj = ci[j++];) {
                if (td) {
                  td.innerHTML = cj.innerHTML;
                  //todo 定制处理
                  cj.getAttribute('width') && td.setAttribute('width', cj.getAttribute('width'));
                  cj.getAttribute('vAlign') && td.setAttribute('vAlign', cj.getAttribute('vAlign'));
                  cj.getAttribute('align') && td.setAttribute('align', cj.getAttribute('align'));
                  cj.style.cssText && (td.style.cssText = cj.style.cssText);
                  preNode = td;
                  td = td.nextSibling;
                } else {
                  var cloneTd = cj.cloneNode(true);
                  domUtils.removeAttributes(cloneTd, ['class', 'rowSpan', 'colSpan']);

                  preNode.parentNode.appendChild(cloneTd)
                }
              }
              td = ut.getNextCell(tmpNode, true, true);
              if (!tableCopyList[i])
                break;
              if (!td) {
                var cellInfo = ut.getCellInfo(tmpNode);
                ut.table.insertRow(ut.table.rows.length);
                ut.update();
                td = ut.getVSideCell(tmpNode, true);
              }
            }
          }
          ut.update();
        } else {
          table = me.document.createElement('table');
          for (var i = 0, ci; ci = tableCopyList[i++];) {
            var tr = table.insertRow(table.rows.length);
            for (var j = 0, cj; cj = ci[j++];) {
              cloneTd = UT.cloneCell(cj,null,true);
              domUtils.removeAttributes(cloneTd, ['class']);
              tr.appendChild(cloneTd)
            }
            if (j == 2 && cloneTd.rowSpan > 1) {
              cloneTd.rowSpan = 1;
            }
          }

          var defaultValue = getDefaultValue(me),
            width = me.body.offsetWidth -
              (needIEHack ? parseInt(domUtils.getComputedStyle(me.body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (me.options.offsetWidth || 0);
          me.execCommand('insertHTML', '<table  ' +
            ( isFullCol && isFullRow ? 'width="' + width + '"' : '') +
            '>' + table.innerHTML.replace(/>\s*</g, '><').replace(/\bth\b/gi, "td") + '</table>')
        }
        me.fireEvent('contentchange');
        me.fireEvent('saveScene');
        html.html = '';
        return true;
      } else {
        var div = me.document.createElement("div"), tables;
        div.innerHTML = html.html;
        tables = div.getElementsByTagName("table");
        if (domUtils.findParentByTagName(me.selection.getStart(), 'table')) {
          utils.each(tables, function (t) {
            domUtils.remove(t)
          });
          if (domUtils.findParentByTagName(me.selection.getStart(), 'caption', true)) {
            div.innerHTML = div[browser.ie ? 'innerText' : 'textContent'];
          }
        } else {
          utils.each(tables, function (table) {
            removeStyleSize(table, true);
            domUtils.removeAttributes(table, ['style', 'border']);
            utils.each(domUtils.getElementsByTagName(table, "td"), function (td) {
              if (isEmptyBlock(td)) {
                domUtils.fillNode(me.document, td);
              }
              removeStyleSize(td, true);
//                            domUtils.removeAttributes(td, ['style'])
            });
          });
        }
        html.html = div.innerHTML;
      }
    });

    me.addListener('afterpaste', function () {
      utils.each(domUtils.getElementsByTagName(me.body, "table"), function (table) {
        if (table.offsetWidth > me.body.offsetWidth) {
          var defaultValue = getDefaultValue(me, table);
          table.style.width = me.body.offsetWidth - (needIEHack ? parseInt(domUtils.getComputedStyle(me.body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (me.options.offsetWidth || 0) + 'px'
        }
      })
    });
    me.addListener('blur', function () {
      tableCopyList = null;
    });
    var timer;
    me.addListener('keydown', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var rng = me.selection.getRange(),
          cell = domUtils.findParentByTagName(rng.startContainer, ['th', 'td'], true);
        if (cell) {
          var table = cell.parentNode.parentNode.parentNode;
          if (table.offsetWidth > table.getAttribute("width")) {
            cell.style.wordBreak = "break-all";
          }
        }

      }, 100);
    });
    me.addListener("selectionchange", function () {
      toggleDraggableState(me, false, "", null);
    });


    //内容变化时触发索引更新
    //todo 可否考虑标记检测，如果不涉及表格的变化就不进行索引重建和更新
    me.addListener("contentchange", function () {
      var me = this;
      //尽可能排除一些不需要更新的状况
      hideDragLine(me);
      if (getUETableBySelected(me))return;
      var rng = me.selection.getRange();
      var start = rng.startContainer;
      start = domUtils.findParentByTagName(start, ['td', 'th'], true);
      utils.each(domUtils.getElementsByTagName(me.document, 'table'), function (table) {
        if (me.fireEvent("excludetable", table) === true) return;
        table.ueTable = new UT(table);
        //trace:3742
//                utils.each(domUtils.getElementsByTagName(me.document, 'td'), function (td) {
//
//                    if (domUtils.isEmptyBlock(td) && td !== start) {
//                        domUtils.fillNode(me.document, td);
//                        if (browser.ie && browser.version == 6) {
//                            td.innerHTML = '&nbsp;'
//                        }
//                    }
//                });
//                utils.each(domUtils.getElementsByTagName(me.document, 'th'), function (th) {
//                    if (domUtils.isEmptyBlock(th) && th !== start) {
//                        domUtils.fillNode(me.document, th);
//                        if (browser.ie && browser.version == 6) {
//                            th.innerHTML = '&nbsp;'
//                        }
//                    }
//                });
        table.onmouseover = function () {
          me.fireEvent('tablemouseover', table);
        };
        table.onmousemove = function () {
          me.fireEvent('tablemousemove', table);
          me.options.tableDragable && toggleDragButton(true, this, me);
          utils.defer(function(){
            me.fireEvent('contentchange',50)
          },true)
        };
        table.onmouseout = function () {
          me.fireEvent('tablemouseout', table);
          toggleDraggableState(me, false, "", null);
          hideDragLine(me);
        };
        table.onclick = function (evt) {
          evt = me.window.event || evt;
          var target = getParentTdOrTh(evt.target || evt.srcElement);
          if (!target)return;
          var ut = getUETable(target),
            table = ut.table,
            cellInfo = ut.getCellInfo(target),
            cellsRange,
            rng = me.selection.getRange();
//                    if ("topLeft" == inPosition(table, mouseCoords(evt))) {
//                        cellsRange = ut.getCellsRange(ut.table.rows[0].cells[0], ut.getLastCell());
//                        ut.setSelected(cellsRange);
//                        return;
//                    }
//                    if ("bottomRight" == inPosition(table, mouseCoords(evt))) {
//
//                        return;
//                    }
          if (inTableSide(table, target, evt, true)) {
            var endTdCol = ut.getCell(ut.indexTable[ut.rowsNum - 1][cellInfo.colIndex].rowIndex, ut.indexTable[ut.rowsNum - 1][cellInfo.colIndex].cellIndex);
            if (evt.shiftKey && ut.selectedTds.length) {
              if (ut.selectedTds[0] !== endTdCol) {
                cellsRange = ut.getCellsRange(ut.selectedTds[0], endTdCol);
                ut.setSelected(cellsRange);
              } else {
                rng && rng.selectNodeContents(endTdCol).select();
              }
            } else {
              if (target !== endTdCol) {
                cellsRange = ut.getCellsRange(target, endTdCol);
                ut.setSelected(cellsRange);
              } else {
                rng && rng.selectNodeContents(endTdCol).select();
              }
            }
            return;
          }
          if (inTableSide(table, target, evt)) {
            var endTdRow = ut.getCell(ut.indexTable[cellInfo.rowIndex][ut.colsNum - 1].rowIndex, ut.indexTable[cellInfo.rowIndex][ut.colsNum - 1].cellIndex);
            if (evt.shiftKey && ut.selectedTds.length) {
              if (ut.selectedTds[0] !== endTdRow) {
                cellsRange = ut.getCellsRange(ut.selectedTds[0], endTdRow);
                ut.setSelected(cellsRange);
              } else {
                rng && rng.selectNodeContents(endTdRow).select();
              }
            } else {
              if (target !== endTdRow) {
                cellsRange = ut.getCellsRange(target, endTdRow);
                ut.setSelected(cellsRange);
              } else {
                rng && rng.selectNodeContents(endTdRow).select();
              }
            }
          }
        };
      });

      switchBorderColor(me, true);
    });

    domUtils.on(me.document, "mousemove", mouseMoveEvent);

    domUtils.on(me.document, "mouseout", function (evt) {
      var target = evt.target || evt.srcElement;
      if (target.tagName == "TABLE") {
        toggleDraggableState(me, false, "", null);
      }
    });
    /**
     * 表格隔行变色
     */
    me.addListener("interlacetable",function(type,table,classList){
      if(!table) return;
      var me = this,
        rows = table.rows,
        len = rows.length,
        getClass = function(list,index,repeat){
          return list[index] ? list[index] : repeat ? list[index % list.length]: "";
        };
      for(var i = 0;i<len;i++){
        rows[i].className = getClass( classList|| me.options.classList,i,true);
      }
    });
    me.addListener("uninterlacetable",function(type,table){
      if(!table) return;
      var me = this,
        rows = table.rows,
        classList = me.options.classList,
        len = rows.length;
      for(var i = 0;i<len;i++){
        domUtils.removeClasses( rows[i], classList );
      }
    });

    me.addListener("mousedown", mouseDownEvent);
    me.addListener("mouseup", mouseUpEvent);
    //拖动的时候触发mouseup
    domUtils.on( me.body, 'dragstart', function( evt ){
      mouseUpEvent.call( me, 'dragstart', evt );
    });
    me.addOutputRule(function(root){
      utils.each(root.getNodesByTagName('div'),function(n){
        if (n.getAttr('id') == 'ue_tableDragLine') {
          n.parentNode.removeChild(n);
        }
      });
    });

    var currentRowIndex = 0;
    me.addListener("mousedown", function () {
      currentRowIndex = 0;
    });
    me.addListener('tabkeydown', function () {
      var range = this.selection.getRange(),
        common = range.getCommonAncestor(true, true),
        table = domUtils.findParentByTagName(common, 'table');
      if (table) {
        if (domUtils.findParentByTagName(common, 'caption', true)) {
          var cell = domUtils.getElementsByTagName(table, 'th td');
          if (cell && cell.length) {
            range.setStart(cell[0], 0).setCursor(false, true)
          }
        } else {
          var cell = domUtils.findParentByTagName(common, ['td', 'th'], true),
            ua = getUETable(cell);
          currentRowIndex = cell.rowSpan > 1 ? currentRowIndex : ua.getCellInfo(cell).rowIndex;
          var nextCell = ua.getTabNextCell(cell, currentRowIndex);
          if (nextCell) {
            if (isEmptyBlock(nextCell)) {
              range.setStart(nextCell, 0).setCursor(false, true)
            } else {
              range.selectNodeContents(nextCell).select()
            }
          } else {
            me.fireEvent('saveScene');
            me.__hasEnterExecCommand = true;
            this.execCommand('insertrownext');
            me.__hasEnterExecCommand = false;
            range = this.selection.getRange();
            range.setStart(table.rows[table.rows.length - 1].cells[0], 0).setCursor();
            me.fireEvent('saveScene');
          }
        }
        return true;
      }

    });
    browser.ie && me.addListener('selectionchange', function () {
      toggleDraggableState(this, false, "", null);
    });
    me.addListener("keydown", function (type, evt) {
      var me = this;
      //处理在表格的最后一个输入tab产生新的表格
      var keyCode = evt.keyCode || evt.which;
      if (keyCode == 8 || keyCode == 46) {
        return;
      }
      var notCtrlKey = !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey;
      notCtrlKey && removeSelectedClass(domUtils.getElementsByTagName(me.body, "td"));
      var ut = getUETableBySelected(me);
      if (!ut) return;
      notCtrlKey && ut.clearSelected();
    });

    me.addListener("beforegetcontent", function () {
      switchBorderColor(this, false);
      browser.ie && utils.each(this.document.getElementsByTagName('caption'), function (ci) {
        if (domUtils.isEmptyNode(ci)) {
          ci.innerHTML = '&nbsp;'
        }
      });
    });
    me.addListener("aftergetcontent", function () {
      switchBorderColor(this, true);
    });
    me.addListener("getAllHtml", function () {
      removeSelectedClass(me.document.getElementsByTagName("td"));
    });
    //修正全屏状态下插入的表格宽度在非全屏状态下撑开编辑器的情况
    me.addListener("fullscreenchanged", function (type, fullscreen) {
      if (!fullscreen) {
        var ratio = this.body.offsetWidth / document.body.offsetWidth,
          tables = domUtils.getElementsByTagName(this.body, "table");
        utils.each(tables, function (table) {
          if (table.offsetWidth < me.body.offsetWidth) return false;
          var tds = domUtils.getElementsByTagName(table, "td"),
            backWidths = [];
          utils.each(tds, function (td) {
            backWidths.push(td.offsetWidth);
          });
          for (var i = 0, td; td = tds[i]; i++) {
            td.setAttribute("width", Math.floor(backWidths[i] * ratio));
          }
          table.setAttribute("width", Math.floor(getTableWidth(me, needIEHack, getDefaultValue(me))))
        });
      }
    });

    //重写execCommand命令，用于处理框选时的处理
    var oldExecCommand = me.execCommand;
    me.execCommand = function (cmd, datatat) {

      var me = this,
        args = arguments;

      cmd = cmd.toLowerCase();
      var ut = getUETableBySelected(me), tds,
        range = new dom.Range(me.document),
        cmdFun = me.commands[cmd] || UE.commands[cmd],
        result;
      if (!cmdFun) return;
      if (ut && !commands[cmd] && !cmdFun.notNeedUndo && !me.__hasEnterExecCommand) {
        me.__hasEnterExecCommand = true;
        me.fireEvent("beforeexeccommand", cmd);
        tds = ut.selectedTds;
        var lastState = -2, lastValue = -2, value, state;
        for (var i = 0, td; td = tds[i]; i++) {
          if (isEmptyBlock(td)) {
            range.setStart(td, 0).setCursor(false, true)
          } else {
            range.selectNode(td).select(true);
          }
          state = me.queryCommandState(cmd);
          value = me.queryCommandValue(cmd);
          if (state != -1) {
            if (lastState !== state || lastValue !== value) {
              me._ignoreContentChange = true;
              result = oldExecCommand.apply(me, arguments);
              me._ignoreContentChange = false;

            }
            lastState = me.queryCommandState(cmd);
            lastValue = me.queryCommandValue(cmd);
            if (domUtils.isEmptyBlock(td)) {
              domUtils.fillNode(me.document, td)
            }
          }
        }
        range.setStart(tds[0], 0).shrinkBoundary(true).setCursor(false, true);
        me.fireEvent('contentchange');
        me.fireEvent("afterexeccommand", cmd);
        me.__hasEnterExecCommand = false;
        me._selectionChange();
      } else {
        result = oldExecCommand.apply(me, arguments);
      }
      return result;
    };


  });
  /**
   * 删除obj的宽高style，改成属性宽高
   * @param obj
   * @param replaceToProperty
   */
  function removeStyleSize(obj, replaceToProperty) {
    removeStyle(obj, "width", true);
    removeStyle(obj, "height", true);
  }

  function removeStyle(obj, styleName, replaceToProperty) {
    if (obj.style[styleName]) {
      replaceToProperty && obj.setAttribute(styleName, parseInt(obj.style[styleName], 10));
      obj.style[styleName] = "";
    }
  }

  function getParentTdOrTh(ele) {
    if (ele.tagName == "TD" || ele.tagName == "TH") return ele;
    var td;
    if (td = domUtils.findParentByTagName(ele, "td", true) || domUtils.findParentByTagName(ele, "th", true)) return td;
    return null;
  }

  function isEmptyBlock(node) {
    var reg = new RegExp(domUtils.fillChar, 'g');
    if (node[browser.ie ? 'innerText' : 'textContent'].replace(/^\s*$/, '').replace(reg, '').length > 0) {
      return 0;
    }
    for (var n in dtd.$isNotEmpty) {
      if (node.getElementsByTagName(n).length) {
        return 0;
      }
    }
    return 1;
  }


  function mouseCoords(evt) {
    if (evt.pageX || evt.pageY) {
      return { x:evt.pageX, y:evt.pageY };
    }
    return {
      x:evt.clientX + me.document.body.scrollLeft - me.document.body.clientLeft,
      y:evt.clientY + me.document.body.scrollTop - me.document.body.clientTop
    };
  }

  function mouseMoveEvent(evt) {

    if( isEditorDisabled() ) {
      return;
    }

    try {

      //普通状态下鼠标移动
      var target = getParentTdOrTh(evt.target || evt.srcElement),
        pos;

      //区分用户的行为是拖动还是双击
      if( isInResizeBuffer  ) {

        me.body.style.webkitUserSelect = 'none';

        if( Math.abs( userActionStatus.x - evt.clientX ) > offsetOfTableCell || Math.abs( userActionStatus.y - evt.clientY ) > offsetOfTableCell ) {
          clearTableDragTimer();
          isInResizeBuffer = false;
          singleClickState = 0;
          //drag action
          tableBorderDrag(evt);
        }
      }

      //修改单元格大小时的鼠标移动
      if (onDrag && dragTd) {
        singleClickState = 0;
        me.body.style.webkitUserSelect = 'none';
        me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();
        pos = mouseCoords(evt);
        toggleDraggableState(me, true, onDrag, pos, target);
        if (onDrag == "h") {
          dragLine.style.left = getPermissionX(dragTd, evt) + "px";
        } else if (onDrag == "v") {
          dragLine.style.top = getPermissionY(dragTd, evt) + "px";
        }
        return;
      }
      //当鼠标处于table上时，修改移动过程中的光标状态
      if (target) {
        //针对使用table作为容器的组件不触发拖拽效果
        if (me.fireEvent('excludetable', target) === true)
          return;
        pos = mouseCoords(evt);
        var state = getRelation(target, pos),
          table = domUtils.findParentByTagName(target, "table", true);

        if (inTableSide(table, target, evt, true)) {
          if (me.fireEvent("excludetable", table) === true) return;
          me.body.style.cursor = "url(" + me.options.cursorpath + "h.png),pointer";
        } else if (inTableSide(table, target, evt)) {
          if (me.fireEvent("excludetable", table) === true) return;
          me.body.style.cursor = "url(" + me.options.cursorpath + "v.png),pointer";
        } else {
          me.body.style.cursor = "text";
          var curCell = target;
          if (/\d/.test(state)) {
            state = state.replace(/\d/, '');
            target = getUETable(target).getPreviewCell(target, state == "v");
          }
          //位于第一行的顶部或者第一列的左边时不可拖动
          toggleDraggableState(me, target ? !!state : false, target ? state : '', pos, target);

        }
      } else {
        toggleDragButton(false, table, me);
      }

    } catch (e) {
      showError(e);
    }
  }

  var dragButtonTimer;

  function toggleDragButton(show, table, editor) {
    if (!show) {
      if (dragOver)return;
      dragButtonTimer = setTimeout(function () {
        !dragOver && dragButton && dragButton.parentNode && dragButton.parentNode.removeChild(dragButton);
      }, 2000);
    } else {
      createDragButton(table, editor);
    }
  }

  function createDragButton(table, editor) {
    var pos = domUtils.getXY(table),
      doc = table.ownerDocument;
    if (dragButton && dragButton.parentNode)return dragButton;
    dragButton = doc.createElement("div");
    dragButton.contentEditable = false;
    dragButton.innerHTML = "";
    dragButton.style.cssText = "width:15px;height:15px;background-image:url(" + editor.options.UEDITOR_HOME_URL + "dialogs/table/dragicon.png);position: absolute;cursor:move;top:" + (pos.y - 15) + "px;left:" + (pos.x) + "px;";
    domUtils.unSelectable(dragButton);
    dragButton.onmouseover = function (evt) {
      dragOver = true;
    };
    dragButton.onmouseout = function (evt) {
      dragOver = false;
    };
    domUtils.on(dragButton, 'click', function (type, evt) {
      doClick(evt, this);
    });
    domUtils.on(dragButton, 'dblclick', function (type, evt) {
      doDblClick(evt);
    });
    domUtils.on(dragButton, 'dragstart', function (type, evt) {
      domUtils.preventDefault(evt);
    });
    var timer;

    function doClick(evt, button) {
      // 部分浏览器下需要清理
      clearTimeout(timer);
      timer = setTimeout(function () {
        editor.fireEvent("tableClicked", table, button);
      }, 300);
    }

    function doDblClick(evt) {
      clearTimeout(timer);
      var ut = getUETable(table),
        start = table.rows[0].cells[0],
        end = ut.getLastCell(),
        range = ut.getCellsRange(start, end);
      editor.selection.getRange().setStart(start, 0).setCursor(false, true);
      ut.setSelected(range);
    }

    doc.body.appendChild(dragButton);
  }


//    function inPosition(table, pos) {
//        var tablePos = domUtils.getXY(table),
//            width = table.offsetWidth,
//            height = table.offsetHeight;
//        if (pos.x - tablePos.x < 5 && pos.y - tablePos.y < 5) {
//            return "topLeft";
//        } else if (tablePos.x + width - pos.x < 5 && tablePos.y + height - pos.y < 5) {
//            return "bottomRight";
//        }
//    }

  function inTableSide(table, cell, evt, top) {
    var pos = mouseCoords(evt),
      state = getRelation(cell, pos);

    if (top) {
      var caption = table.getElementsByTagName("caption")[0],
        capHeight = caption ? caption.offsetHeight : 0;
      return (state == "v1") && ((pos.y - domUtils.getXY(table).y - capHeight) < 8);
    } else {
      return (state == "h1") && ((pos.x - domUtils.getXY(table).x) < 8);
    }
  }

  /**
   * 获取拖动时允许的X轴坐标
   * @param dragTd
   * @param evt
   */
  function getPermissionX(dragTd, evt) {
    var ut = getUETable(dragTd);
    if (ut) {
      var preTd = ut.getSameEndPosCells(dragTd, "x")[0],
        nextTd = ut.getSameStartPosXCells(dragTd)[0],
        mouseX = mouseCoords(evt).x,
        left = (preTd ? domUtils.getXY(preTd).x : domUtils.getXY(ut.table).x) + 20 ,
        right = nextTd ? domUtils.getXY(nextTd).x + nextTd.offsetWidth - 20 : (me.body.offsetWidth + 5 || parseInt(domUtils.getComputedStyle(me.body, "width"), 10));

      left += cellMinWidth;
      right -= cellMinWidth;

      return mouseX < left ? left : mouseX > right ? right : mouseX;
    }
  }

  /**
   * 获取拖动时允许的Y轴坐标
   */
  function getPermissionY(dragTd, evt) {
    try {
      var top = domUtils.getXY(dragTd).y,
        mousePosY = mouseCoords(evt).y;
      return mousePosY < top ? top : mousePosY;
    } catch (e) {
      showError(e);
    }
  }

  /**
   * 移动状态切换
   */
  function toggleDraggableState(editor, draggable, dir, mousePos, cell) {
    try {
      editor.body.style.cursor = dir == "h" ? "col-resize" : dir == "v" ? "row-resize" : "text";
      if (browser.ie) {
        if (dir && !mousedown && !getUETableBySelected(editor)) {
          getDragLine(editor, editor.document);
          showDragLineAt(dir, cell);
        } else {
          hideDragLine(editor)
        }
      }
      onBorder = draggable;
    } catch (e) {
      showError(e);
    }
  }

  /**
   * 获取与UETable相关的resize line
   * @param uetable UETable对象
   */
  function getResizeLineByUETable() {

    var lineId = '_UETableResizeLine',
      line = this.document.getElementById( lineId );

    if( !line ) {
      line = this.document.createElement("div");
      line.id = lineId;
      line.contnetEditable = false;
      line.setAttribute("unselectable", "on");

      var styles = {
        width: 2*cellBorderWidth + 1 + 'px',
        position: 'absolute',
        'z-index': 100000,
        cursor: 'col-resize',
        background: 'red',
        display: 'none'
      };

      //切换状态
      line.onmouseout = function(){
        this.style.display = 'none';
      };

      utils.extend( line.style, styles );

      this.document.body.appendChild( line );

    }

    return line;

  }

  /**
   * 更新resize-line
   */
  function updateResizeLine( cell, uetable ) {

    var line = getResizeLineByUETable.call( this ),
      table = uetable.table,
      styles = {
        top: domUtils.getXY( table ).y + 'px',
        left: domUtils.getXY( cell).x + cell.offsetWidth - cellBorderWidth + 'px',
        display: 'block',
        height: table.offsetHeight + 'px'
      };

    utils.extend( line.style, styles );

  }

  /**
   * 显示resize-line
   */
  function showResizeLine( cell ) {

    var uetable = getUETable( cell );

    updateResizeLine.call( this, cell, uetable );

  }

  /**
   * 获取鼠标与当前单元格的相对位置
   * @param ele
   * @param mousePos
   */
  function getRelation(ele, mousePos) {
    var elePos = domUtils.getXY(ele);

    if( !elePos ) {
      return '';
    }

    if (elePos.x + ele.offsetWidth - mousePos.x < cellBorderWidth) {
      return "h";
    }
    if (mousePos.x - elePos.x < cellBorderWidth) {
      return 'h1'
    }
    if (elePos.y + ele.offsetHeight - mousePos.y < cellBorderWidth) {
      return "v";
    }
    if (mousePos.y - elePos.y < cellBorderWidth) {
      return 'v1'
    }
    return '';
  }

  function mouseDownEvent(type, evt) {

    if( isEditorDisabled() ) {
      return ;
    }

    userActionStatus = {
      x: evt.clientX,
      y: evt.clientY
    };

    //右键菜单单独处理
    if (evt.button == 2) {
      var ut = getUETableBySelected(me),
        flag = false;

      if (ut) {
        var td = getTargetTd(me, evt);
        utils.each(ut.selectedTds, function (ti) {
          if (ti === td) {
            flag = true;
          }
        });
        if (!flag) {
          removeSelectedClass(domUtils.getElementsByTagName(me.body, "th td"));
          ut.clearSelected()
        } else {
          td = ut.selectedTds[0];
          setTimeout(function () {
            me.selection.getRange().setStart(td, 0).setCursor(false, true);
          }, 0);

        }
      }
    } else {
      tableClickHander( evt );
    }

  }

  //清除表格的计时器
  function clearTableTimer() {
    tabTimer && clearTimeout( tabTimer );
    tabTimer = null;
  }

  //双击收缩
  function tableDbclickHandler(evt) {
    singleClickState = 0;
    evt = evt || me.window.event;
    var target = getParentTdOrTh(evt.target || evt.srcElement);
    if (target) {
      var h;
      if (h = getRelation(target, mouseCoords(evt))) {

        hideDragLine( me );

        if (h == 'h1') {
          h = 'h';
          if (inTableSide(domUtils.findParentByTagName(target, "table"), target, evt)) {
            me.execCommand('adaptbywindow');
          } else {
            target = getUETable(target).getPreviewCell(target);
            if (target) {
              var rng = me.selection.getRange();
              rng.selectNodeContents(target).setCursor(true, true)
            }
          }
        }
        if (h == 'h') {
          var ut = getUETable(target),
            table = ut.table,
            cells = getCellsByMoveBorder( target, table, true );

          cells = extractArray( cells, 'left' );

          ut.width = ut.offsetWidth;

          var oldWidth = [],
            newWidth = [];

          utils.each( cells, function( cell ){

            oldWidth.push( cell.offsetWidth );

          } );

          utils.each( cells, function( cell ){

            cell.removeAttribute("width");

          } );

          window.setTimeout( function(){

            //是否允许改变
            var changeable = true;

            utils.each( cells, function( cell, index ){

              var width = cell.offsetWidth;

              if( width > oldWidth[index] ) {
                changeable = false;
                return false;
              }

              newWidth.push( width );

            } );

            var change = changeable ? newWidth : oldWidth;

            utils.each( cells, function( cell, index ){

              cell.width = change[index] - getTabcellSpace();

            } );


          }, 0 );

//                    minWidth -= cellMinWidth;
//
//                    table.removeAttribute("width");
//                    utils.each(cells, function (cell) {
//                        cell.style.width = "";
//                        cell.width -= minWidth;
//                    });

        }
      }
    }
  }

  function tableClickHander( evt ) {

    removeSelectedClass(domUtils.getElementsByTagName(me.body, "td th"));
    //trace:3113
    //选中单元格，点击table外部，不会清掉table上挂的ueTable,会引起getUETableBySelected方法返回值
    utils.each(me.document.getElementsByTagName('table'), function (t) {
      t.ueTable = null;
    });
    startTd = getTargetTd(me, evt);
    if( !startTd ) return;
    var table = domUtils.findParentByTagName(startTd, "table", true);
    ut = getUETable(table);
    ut && ut.clearSelected();

    //判断当前鼠标状态
    if (!onBorder) {
      me.document.body.style.webkitUserSelect = '';
      mousedown = true;
      me.addListener('mouseover', mouseOverEvent);
    } else {
      //边框上的动作处理
      borderActionHandler( evt );
    }


  }

  //处理表格边框上的动作, 这里做延时处理，避免两种动作互相影响
  function borderActionHandler( evt ) {

    if ( browser.ie ) {
      evt = reconstruct(evt );
    }

    clearTableDragTimer();

    //是否正在等待resize的缓冲中
    isInResizeBuffer = true;

    tableDragTimer = setTimeout(function(){
      tableBorderDrag( evt );
    }, dblclickTime);

  }

  function extractArray( originArr, key ) {

    var result = [],
      tmp = null;

    for( var i = 0, len = originArr.length; i<len; i++ ) {

      tmp = originArr[ i ][ key ];

      if( tmp ) {
        result.push( tmp );
      }

    }

    return result;

  }

  function clearTableDragTimer() {
    tableDragTimer && clearTimeout(tableDragTimer);
    tableDragTimer = null;
  }

  function reconstruct( obj ) {

    var attrs = ['pageX', 'pageY', 'clientX', 'clientY', 'srcElement', 'target'],
      newObj = {};

    if( obj ) {

      for( var i = 0, key, val; key = attrs[i]; i++ ) {
        val=obj[ key ];
        val && (newObj[ key ] = val);
      }

    }

    return newObj;

  }

  //边框拖动
  function tableBorderDrag( evt ) {

    isInResizeBuffer = false;

    startTd = evt.target || evt.srcElement;
    if( !startTd ) return;
    var state = getRelation(startTd, mouseCoords(evt));
    if (/\d/.test(state)) {
      state = state.replace(/\d/, '');
      startTd = getUETable(startTd).getPreviewCell(startTd, state == 'v');
    }
    hideDragLine(me);
    getDragLine(me, me.document);
    me.fireEvent('saveScene');
    showDragLineAt(state, startTd);
    mousedown = true;
    //拖动开始
    onDrag = state;
    dragTd = startTd;
  }

  function mouseUpEvent(type, evt) {

    if( isEditorDisabled() ) {
      return ;
    }

    clearTableDragTimer();

    isInResizeBuffer = false;

    if( onBorder ) {
      singleClickState = ++singleClickState % 3;

      userActionStatus = {
        x: evt.clientX,
        y: evt.clientY
      };

      tableResizeTimer = setTimeout(function(){
        singleClickState > 0 && singleClickState--;
      }, dblclickTime );

      if( singleClickState === 2 ) {

        singleClickState = 0;
        tableDbclickHandler(evt);
        return;

      }

    }

    if (evt.button == 2)return;
    var me = this;
    //清除表格上原生跨选问题
    var range = me.selection.getRange(),
      start = domUtils.findParentByTagName(range.startContainer, 'table', true),
      end = domUtils.findParentByTagName(range.endContainer, 'table', true);

    if (start || end) {
      if (start === end) {
        start = domUtils.findParentByTagName(range.startContainer, ['td', 'th', 'caption'], true);
        end = domUtils.findParentByTagName(range.endContainer, ['td', 'th', 'caption'], true);
        if (start !== end) {
          me.selection.clearRange()
        }
      } else {
        me.selection.clearRange()
      }
    }
    mousedown = false;
    me.document.body.style.webkitUserSelect = '';
    //拖拽状态下的mouseUP
    if ( onDrag && dragTd ) {

      me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();

      singleClickState = 0;
      dragLine = me.document.getElementById('ue_tableDragLine');

      // trace 3973
      if (dragLine) {
        var dragTdPos = domUtils.getXY(dragTd),
          dragLinePos = domUtils.getXY(dragLine);

        switch (onDrag) {
          case "h":
            changeColWidth(dragTd, dragLinePos.x - dragTdPos.x);
            break;
          case "v":
            changeRowHeight(dragTd, dragLinePos.y - dragTdPos.y - dragTd.offsetHeight);
            break;
          default:
        }
        onDrag = "";
        dragTd = null;

        hideDragLine(me);
        me.fireEvent('saveScene');
        return;
      }
    }
    //正常状态下的mouseup
    if (!startTd) {
      var target = domUtils.findParentByTagName(evt.target || evt.srcElement, "td", true);
      if (!target) target = domUtils.findParentByTagName(evt.target || evt.srcElement, "th", true);
      if (target && (target.tagName == "TD" || target.tagName == "TH")) {
        if (me.fireEvent("excludetable", target) === true) return;
        range = new dom.Range(me.document);
        range.setStart(target, 0).setCursor(false, true);
      }
    } else {
      var ut = getUETable(startTd),
        cell = ut ? ut.selectedTds[0] : null;
      if (cell) {
        range = new dom.Range(me.document);
        if (domUtils.isEmptyBlock(cell)) {
          range.setStart(cell, 0).setCursor(false, true);
        } else {
          range.selectNodeContents(cell).shrinkBoundary().setCursor(false, true);
        }
      } else {
        range = me.selection.getRange().shrinkBoundary();
        if (!range.collapsed) {
          var start = domUtils.findParentByTagName(range.startContainer, ['td', 'th'], true),
            end = domUtils.findParentByTagName(range.endContainer, ['td', 'th'], true);
          //在table里边的不能清除
          if (start && !end || !start && end || start && end && start !== end) {
            range.setCursor(false, true);
          }
        }
      }
      startTd = null;
      me.removeListener('mouseover', mouseOverEvent);
    }
    me._selectionChange(250, evt);
  }

  function mouseOverEvent(type, evt) {

    if( isEditorDisabled() ) {
      return;
    }

    var me = this,
      tar = evt.target || evt.srcElement;
    currentTd = domUtils.findParentByTagName(tar, "td", true) || domUtils.findParentByTagName(tar, "th", true);
    //需要判断两个TD是否位于同一个表格内
    if (startTd && currentTd &&
      ((startTd.tagName == "TD" && currentTd.tagName == "TD") || (startTd.tagName == "TH" && currentTd.tagName == "TH")) &&
      domUtils.findParentByTagName(startTd, 'table') == domUtils.findParentByTagName(currentTd, 'table')) {
      var ut = getUETable(currentTd);
      if (startTd != currentTd) {
        me.document.body.style.webkitUserSelect = 'none';
        me.selection.getNative()[browser.ie9below ? 'empty' : 'removeAllRanges']();
        var range = ut.getCellsRange(startTd, currentTd);
        ut.setSelected(range);
      } else {
        me.document.body.style.webkitUserSelect = '';
        ut.clearSelected();
      }

    }
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
  }

  function setCellHeight(cell, height, backHeight) {
    var lineHight = parseInt(domUtils.getComputedStyle(cell, "line-height"), 10),
      tmpHeight = backHeight + height;
    height = tmpHeight < lineHight ? lineHight : tmpHeight;
    if (cell.style.height) cell.style.height = "";
    cell.rowSpan == 1 ? cell.setAttribute("height", height) : (cell.removeAttribute && cell.removeAttribute("height"));
  }

  function getWidth(cell) {
    if (!cell)return 0;
    return parseInt(domUtils.getComputedStyle(cell, "width"), 10);
  }

  function changeColWidth(cell, changeValue) {

    var ut = getUETable(cell);
    if (ut) {

      //根据当前移动的边框获取相关的单元格
      var table = ut.table,
        cells = getCellsByMoveBorder( cell, table );

      table.style.width = "";
      table.removeAttribute("width");

      //修正改变量
      changeValue = correctChangeValue( changeValue, cell, cells );

      if (cell.nextSibling) {

        var i=0;

        utils.each( cells, function( cellGroup ){

          cellGroup.left.width = (+cellGroup.left.width)+changeValue;
          cellGroup.right && ( cellGroup.right.width = (+cellGroup.right.width)-changeValue );

        } );

      } else {

        utils.each( cells, function( cellGroup ){
          cellGroup.left.width -= -changeValue;
        } );

      }
    }

  }

  function isEditorDisabled() {
    return me.body.contentEditable === "false";
  }

  function changeRowHeight(td, changeValue) {
    if (Math.abs(changeValue) < 10) return;
    var ut = getUETable(td);
    if (ut) {
      var cells = ut.getSameEndPosCells(td, "y"),
      //备份需要连带变化的td的原始高度，否则后期无法获取正确的值
        backHeight = cells[0] ? cells[0].offsetHeight : 0;
      for (var i = 0, cell; cell = cells[i++];) {
        setCellHeight(cell, changeValue, backHeight);
      }
    }

  }

  /**
   * 获取调整单元格大小的相关单元格
   * @isContainMergeCell 返回的结果中是否包含发生合并后的单元格
   */
  function getCellsByMoveBorder( cell, table, isContainMergeCell ) {

    if( !table ) {
      table = domUtils.findParentByTagName( cell, 'table' );
    }

    if( !table ) {
      return null;
    }

    //获取到该单元格所在行的序列号
    var index = domUtils.getNodeIndex( cell ),
      temp = cell,
      rows = table.rows,
      colIndex = 0;

    while( temp ) {
      //获取到当前单元格在未发生单元格合并时的序列
      if( temp.nodeType === 1 ) {
        colIndex += (temp.colSpan || 1);
      }
      temp = temp.previousSibling;
    }

    temp = null;

    //记录想关的单元格
    var borderCells = [];

    utils.each(rows, function( tabRow ){

      var cells = tabRow.cells,
        currIndex = 0;

      utils.each( cells, function( tabCell ){

        currIndex += (tabCell.colSpan || 1);

        if( currIndex === colIndex ) {

          borderCells.push({
            left: tabCell,
            right: tabCell.nextSibling || null
          });

          return false;

        } else if( currIndex > colIndex ) {

          if( isContainMergeCell ) {
            borderCells.push({
              left: tabCell
            });
          }

          return false;
        }


      } );

    });

    return borderCells;

  }


  /**
   * 通过给定的单元格集合获取最小的单元格width
   */
  function getMinWidthByTableCells( cells ) {

    var minWidth = Number.MAX_VALUE;

    for( var i = 0, curCell; curCell = cells[ i ] ; i++ ) {

      minWidth = Math.min( minWidth, curCell.width || getTableCellWidth( curCell ) );

    }

    return minWidth;

  }

  function correctChangeValue( changeValue, relatedCell, cells ) {

    //为单元格的paading预留空间
    changeValue -= getTabcellSpace();

    if( changeValue < 0 ) {
      return 0;
    }

    changeValue -= getTableCellWidth( relatedCell );

    //确定方向
    var direction = changeValue < 0 ? 'left':'right';

    changeValue = Math.abs(changeValue);

    //只关心非最后一个单元格就可以
    utils.each( cells, function( cellGroup ){

      var curCell = cellGroup[direction];

      //为单元格保留最小空间
      if( curCell ) {
        changeValue = Math.min( changeValue, getTableCellWidth( curCell )-cellMinWidth );
      }


    } );


    //修正越界
    changeValue = changeValue < 0 ? 0 : changeValue;

    return direction === 'left' ? -changeValue : changeValue;

  }

  function getTableCellWidth( cell ) {

    var width = 0,
    //偏移纠正量
      offset = 0,
      width = cell.offsetWidth - getTabcellSpace();

    //最后一个节点纠正一下
    if( !cell.nextSibling ) {

      width -= getTableCellOffset( cell );

    }

    width = width < 0 ? 0 : width;

    try {
      cell.width = width;
    } catch(e) {
    }

    return width;

  }

  /**
   * 获取单元格所在表格的最末单元格的偏移量
   */
  function getTableCellOffset( cell ) {

    tab = domUtils.findParentByTagName( cell, "table", false);

    if( tab.offsetVal === undefined ) {

      var prev = cell.previousSibling;

      if( prev ) {

        //最后一个单元格和前一个单元格的width diff结果 如果恰好为一个border width， 则条件成立
        tab.offsetVal = cell.offsetWidth - prev.offsetWidth === UT.borderWidth ? UT.borderWidth : 0;

      } else {
        tab.offsetVal = 0;
      }

    }

    return tab.offsetVal;

  }

  function getTabcellSpace() {

    if( UT.tabcellSpace === undefined ) {

      var cell = null,
        tab = me.document.createElement("table"),
        tbody = me.document.createElement("tbody"),
        trow = me.document.createElement("tr"),
        tabcell = me.document.createElement("td"),
        mirror = null;

      tabcell.style.cssText = 'border: 0;';
      tabcell.width = 1;

      trow.appendChild( tabcell );
      trow.appendChild( mirror = tabcell.cloneNode( false ) );

      tbody.appendChild( trow );

      tab.appendChild( tbody );

      tab.style.cssText = "visibility: hidden;";

      me.body.appendChild( tab );

      UT.paddingSpace = tabcell.offsetWidth - 1;

      var tmpTabWidth = tab.offsetWidth;

      tabcell.style.cssText = '';
      mirror.style.cssText = '';

      UT.borderWidth = ( tab.offsetWidth - tmpTabWidth ) / 3;

      UT.tabcellSpace = UT.paddingSpace + UT.borderWidth;

      me.body.removeChild( tab );

    }

    getTabcellSpace = function(){ return UT.tabcellSpace; };

    return UT.tabcellSpace;

  }

  function getDragLine(editor, doc) {
    if (mousedown)return;
    dragLine = editor.document.createElement("div");
    domUtils.setAttributes(dragLine, {
      id:"ue_tableDragLine",
      unselectable:'on',
      contenteditable:false,
      'onresizestart':'return false',
      'ondragstart':'return false',
      'onselectstart':'return false',
      style:"background-color:blue;position:absolute;padding:0;margin:0;background-image:none;border:0px none;opacity:0;filter:alpha(opacity=0)"
    });
    editor.body.appendChild(dragLine);
  }

  function hideDragLine(editor) {
    if (mousedown)return;
    var line;
    while (line = editor.document.getElementById('ue_tableDragLine')) {
      domUtils.remove(line)
    }
  }

  /**
   * 依据state（v|h）在cell位置显示横线
   * @param state
   * @param cell
   */
  function showDragLineAt(state, cell) {
    if (!cell) return;
    var table = domUtils.findParentByTagName(cell, "table"),
      caption = table.getElementsByTagName('caption'),
      width = table.offsetWidth,
      height = table.offsetHeight - (caption.length > 0 ? caption[0].offsetHeight : 0),
      tablePos = domUtils.getXY(table),
      cellPos = domUtils.getXY(cell), css;
    switch (state) {
      case "h":
        css = 'height:' + height + 'px;top:' + (tablePos.y + (caption.length > 0 ? caption[0].offsetHeight : 0)) + 'px;left:' + (cellPos.x + cell.offsetWidth);
        dragLine.style.cssText = css + 'px;position: absolute;display:block;background-color:blue;width:1px;border:0; color:blue;opacity:.3;filter:alpha(opacity=30)';
        break;
      case "v":
        css = 'width:' + width + 'px;left:' + tablePos.x + 'px;top:' + (cellPos.y + cell.offsetHeight );
        //必须加上border:0和color:blue，否则低版ie不支持背景色显示
        dragLine.style.cssText = css + 'px;overflow:hidden;position: absolute;display:block;background-color:blue;height:1px;border:0;color:blue;opacity:.2;filter:alpha(opacity=20)';
        break;
      default:
    }
  }

  /**
   * 当表格边框颜色为白色时设置为虚线,true为添加虚线
   * @param editor
   * @param flag
   */
  function switchBorderColor(editor, flag) {
    var tableArr = domUtils.getElementsByTagName(editor.body, "table"), color;
    for (var i = 0, node; node = tableArr[i++];) {
      var td = domUtils.getElementsByTagName(node, "td");
      if (td[0]) {
        if (flag) {
          color = (td[0].style.borderColor).replace(/\s/g, "");
          if (/(#ffffff)|(rgb\(255,255,255\))/ig.test(color))
            domUtils.addClass(node, "noBorderTable")
        } else {
          domUtils.removeClasses(node, "noBorderTable")
        }
      }

    }
  }

  function getTableWidth(editor, needIEHack, defaultValue) {
    var body = editor.body;
    return body.offsetWidth - (needIEHack ? parseInt(domUtils.getComputedStyle(body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (editor.options.offsetWidth || 0);
  }

  /**
   * 获取当前拖动的单元格
   */
  function getTargetTd(editor, evt) {

    var target = domUtils.findParentByTagName(evt.target || evt.srcElement, ["td", "th"], true),
      dir = null;

    if( !target ) {
      return null;
    }

    dir = getRelation( target, mouseCoords( evt ) );

    //如果有前一个节点， 需要做一个修正， 否则可能会得到一个错误的td

    if( !target ) {
      return null;
    }

    if( dir === 'h1' && target.previousSibling ) {

      var position = domUtils.getXY( target),
        cellWidth = target.offsetWidth;

      if( Math.abs( position.x + cellWidth - evt.clientX ) > cellWidth / 3 ) {
        target = target.previousSibling;
      }

    } else if( dir === 'v1' && target.parentNode.previousSibling ) {

      var position = domUtils.getXY( target),
        cellHeight = target.offsetHeight;

      if( Math.abs( position.y + cellHeight - evt.clientY ) > cellHeight / 3 ) {
        target = target.parentNode.previousSibling.firstChild;
      }

    }


    //排除了非td内部以及用于代码高亮部分的td
    return target && !(editor.fireEvent("excludetable", target) === true) ? target : null;
  }

};


// plugins/table.sort.js
/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-10-12
 * Time: 上午10:20
 * To change this template use File | Settings | File Templates.
 */

UE.UETable.prototype.sortTable = function (sortByCellIndex, compareFn) {
  var table = this.table,
    rows = table.rows,
    trArray = [],
    flag = rows[0].cells[0].tagName === "TH",
    lastRowIndex = 0;
  if(this.selectedTds.length){
    var range = this.cellsRange,
      len = range.endRowIndex + 1;
    for (var i = range.beginRowIndex; i < len; i++) {
      trArray[i] = rows[i];
    }
    trArray.splice(0,range.beginRowIndex);
    lastRowIndex = (range.endRowIndex +1) === this.rowsNum ? 0 : range.endRowIndex +1;
  }else{
    for (var i = 0,len = rows.length; i < len; i++) {
      trArray[i] = rows[i];
    }
  }

  var Fn = {
    'reversecurrent': function(td1,td2){
      return 1;
    },
    'orderbyasc': function(td1,td2){
      var value1 = td1.innerText||td1.textContent,
        value2 = td2.innerText||td2.textContent;
      return value1.localeCompare(value2);
    },
    'reversebyasc': function(td1,td2){
      var value1 = td1.innerHTML,
        value2 = td2.innerHTML;
      return value2.localeCompare(value1);
    },
    'orderbynum': function(td1,td2){
      var value1 = td1[browser.ie ? 'innerText':'textContent'].match(/\d+/),
        value2 = td2[browser.ie ? 'innerText':'textContent'].match(/\d+/);
      if(value1) value1 = +value1[0];
      if(value2) value2 = +value2[0];
      return (value1||0) - (value2||0);
    },
    'reversebynum': function(td1,td2){
      var value1 = td1[browser.ie ? 'innerText':'textContent'].match(/\d+/),
        value2 = td2[browser.ie ? 'innerText':'textContent'].match(/\d+/);
      if(value1) value1 = +value1[0];
      if(value2) value2 = +value2[0];
      return (value2||0) - (value1||0);
    }
  };

  //对表格设置排序的标记data-sort-type
  table.setAttribute('data-sort-type', compareFn && typeof compareFn === "string" && Fn[compareFn] ? compareFn:'');

  //th不参与排序
  flag && trArray.splice(0, 1);
  trArray = utils.sort(trArray,function (tr1, tr2) {
    var result;
    if (compareFn && typeof compareFn === "function") {
      result = compareFn.call(this, tr1.cells[sortByCellIndex], tr2.cells[sortByCellIndex]);
    } else if (compareFn && typeof compareFn === "number") {
      result = 1;
    } else if (compareFn && typeof compareFn === "string" && Fn[compareFn]) {
      result = Fn[compareFn].call(this, tr1.cells[sortByCellIndex], tr2.cells[sortByCellIndex]);
    } else {
      result = Fn['orderbyasc'].call(this, tr1.cells[sortByCellIndex], tr2.cells[sortByCellIndex]);
    }
    return result;
  });
  var fragment = table.ownerDocument.createDocumentFragment();
  for (var j = 0, len = trArray.length; j < len; j++) {
    fragment.appendChild(trArray[j]);
  }
  var tbody = table.getElementsByTagName("tbody")[0];
  if(!lastRowIndex){
    tbody.appendChild(fragment);
  }else{
    tbody.insertBefore(fragment,rows[lastRowIndex- range.endRowIndex + range.beginRowIndex - 1])
  }
};

UE.plugins['tablesort'] = function () {
  var me = this,
    UT = UE.UETable,
    getUETable = function (tdOrTable) {
      return UT.getUETable(tdOrTable);
    },
    getTableItemsByRange = function (editor) {
      return UT.getTableItemsByRange(editor);
    };


  me.ready(function () {
    //添加表格可排序的样式
    utils.cssRule('tablesort',
        'table.sortEnabled tr.firstRow th,table.sortEnabled tr.firstRow td{padding-right:20px;background-repeat: no-repeat;background-position: center right;' +
        '   background-image:url(' + me.options.themePath + me.options.theme + '/images/sortable.png);}',
      me.document);

    //做单元格合并操作时,清除可排序标识
    me.addListener("afterexeccommand", function (type, cmd) {
      if( cmd == 'mergeright' || cmd == 'mergedown' || cmd == 'mergecells') {
        this.execCommand('disablesort');
      }
    });
  });



  //表格排序
  UE.commands['sorttable'] = {
    queryCommandState: function () {
      var me = this,
        tableItems = getTableItemsByRange(me);
      if (!tableItems.cell) return -1;
      var table = tableItems.table,
        cells = table.getElementsByTagName("td");
      for (var i = 0, cell; cell = cells[i++];) {
        if (cell.rowSpan != 1 || cell.colSpan != 1) return -1;
      }
      return 0;
    },
    execCommand: function (cmd, fn) {
      var me = this,
        range = me.selection.getRange(),
        bk = range.createBookmark(true),
        tableItems = getTableItemsByRange(me),
        cell = tableItems.cell,
        ut = getUETable(tableItems.table),
        cellInfo = ut.getCellInfo(cell);
      ut.sortTable(cellInfo.cellIndex, fn);
      range.moveToBookmark(bk);
      try{
        range.select();
      }catch(e){}
    }
  };

  //设置表格可排序,清除表格可排序
  UE.commands["enablesort"] = UE.commands["disablesort"] = {
    queryCommandState: function (cmd) {
      var table = getTableItemsByRange(this).table;
      if(table && cmd=='enablesort') {
        var cells = domUtils.getElementsByTagName(table, 'th td');
        for(var i = 0; i<cells.length; i++) {
          if(cells[i].getAttribute('colspan')>1 || cells[i].getAttribute('rowspan')>1) return -1;
        }
      }

      return !table ? -1: cmd=='enablesort' ^ table.getAttribute('data-sort')!='sortEnabled' ? -1:0;
    },
    execCommand: function (cmd) {
      var table = getTableItemsByRange(this).table;
      table.setAttribute("data-sort", cmd == "enablesort" ? "sortEnabled" : "sortDisabled");
      cmd == "enablesort" ? domUtils.addClass(table,"sortEnabled"):domUtils.removeClasses(table,"sortEnabled");
    }
  };
};
