/**
 *
 *
 */
(function(window, document, gr, undefined) {
  'use strict';

  var baseConfig = {
    /** @type {String} table css classes */
    cssClass: 'gr-table gr-shadow-2dp',

    /** @type {Number} collapse level */
    collapseLevel: 1,

    /** @type {Object} tree left padding */
    tree: {
      padding: 24,
      unit: 'px'
    },

    /** @type {Object} gran total: top or bottom. False to hide */
    total: {
      alias: 'Total',
      position: 'bottom'
    },

    /** @type {Array} [description] */
    columns: [],

    /** @type {Array} [description] */
    groupBy: []
  };

  /**
   * Hierarchy Table
   * @constructor
   * @param  string element id name for container DOM element
   * @param  json config
   */
  var DataTable = function(element, config) {
    this.container = element;

    var defaultConfig = gr.clone(baseConfig);
    gr.extend(defaultConfig, config);

    this.config = defaultConfig;
  };
  gr.DataTable = DataTable;

  DataTable.prototype.CssClasses = {
    HIDDEN: 'gr-hidden',
    TOTAL: 'gr-total',
    CONTROL: 'gr-control',
    ARROW_BOTTOM: 'gr-arrow-bottom',
    ARROW_RIGHT: 'gr-arrow-right'
  };

  DataTable.prototype.render = function(data) {

    crono.start('render');
    var l = data.length;


    crono.start('groupBy data');
    data = gr.Data.grouping(this.config.columns, this.config.groupBy, data, this.config.total);
    console.log(data);
    crono.stop('groupBy data');


    crono.start('renderTable');
    var table = this.renderTable(data);
    crono.stop('renderTable');


    crono.stop('render', l);
  };

  DataTable.prototype.renderTable = function(data) {
    var table = document.createElement('table'),
      thead = document.createElement('thead'),
      tbody = document.createElement('tbody'),
      batch = [];

    //table attributes
    table.className = this.config.cssClass;
    table.appendChild(thead);
    table.appendChild(tbody);
    //put the table in DOM
    this.container.appendChild(table);

    // cache for cloning rows :D
    this.buildCache();

    //header row
    thead.appendChild(this.createRowAndCells('th', true, true));

    if (this.config.total) {
      data[0].key = this.config.total.alias;
    }

    if (!this.config.total || this.config.total.position == 'top') {
      //no total or total top
      for (var i = 0, l = data.length; i < l; i++) {
        this.createBody(tbody, data[i], 0);
        //this.createBody(batch, data[i], 0);
      }
    } else if (this.config.total && this.config.total.position == 'bottom') {
      //total bottom
      for (var j = 0, m = data[0].values.length; j < m; j++) {
        this.createBody(tbody, data[0].values[j], 0);
        //this.createBody(batch, data[0].values[j], 0);
      }
      //row foot
      var tfoot = document.createElement('tfoot'),
        row = this.createRowAndCells('td', false, false, data[0]);
      row.className = this.CssClasses.TOTAL;
      tfoot.appendChild(row);
      table.appendChild(tfoot);
    }
    //this._onDrawTableData(tbody, batch);
    return table;
  };

  DataTable.prototype._onDrawTableData = function(tbody, batch) {
    var index = 0,
      l = batch.length;
    var handle = window.requestInterval(function() {
      //console.log(handle);
      for (var i = 0; i < 10000; i++) {
        if (index < l) {
          tbody.appendChild(batch[index]);
        } else {
          window.clearRequestInterval(handle);
          break;
        }
        ++index;
      }
    }, 1);
  };

  DataTable.prototype.createRowAndCells = function(tag, setWidth, setAlias, data) {
    var text, column, cell, row = document.createElement('tr');
    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      column = this.config.columns[i];
      cell = document.createElement(tag);
      //header width
      if (setWidth && column.width) {
        cell.style.width = column.width;
      }
      if (setAlias) {
        //text alias
        text = document.createTextNode(this._onCreateCellHeader(column));
        cell.appendChild(text);
      }

      //footer
      if (data) {
        text = document.createTextNode(this._onCreateCellGroup(column, data));
        cell.appendChild(text);
      }

      //styles
      if (column.cssClass) {
        cell.className = column.cssClass;
      }
      row.appendChild(cell);
    }
    return row;
  };

  DataTable.prototype.getMaxLevel = function() {
    return (this.config.total && this.config.total.position == 'top') ?
      this.config.groupBy.length + 1 :
      this.config.groupBy.length;
  };

  DataTable.prototype.buildCache = function() {
    var row, control,
      maxLevel = this.getMaxLevel(),
      collapse = false;
    this._baseRows = [];

    for (var level = 0; level <= maxLevel; level++) {
      //tree control
      control = document.createElement('span');
      control.className = this.CssClasses.CONTROL;

      //Arrows
      if (level < maxLevel) {
        if (level < this.config.collapseLevel) {
          control.classList.add(this.CssClasses.ARROW_BOTTOM);
        } else {
          control.classList.add(this.CssClasses.ARROW_RIGHT);
        }
      }

      //padding
      if (level !== 0) {
        control.style.padding = '0 0 0 ' + (level * this.config.tree.padding) + this.config.tree.unit;
      }

      //level data row
      row = this.createRowAndCells('td');
      row.firstChild.appendChild(control);

      //collapseLevel
      if (level > this.config.collapseLevel) {
        row.classList.add(this.CssClasses.HIDDEN);
      }

      this._baseRows.push(row);
    }
  };

  DataTable.prototype.cloneRow = function(fn, data, level) {
    var text, cell, row = this._baseRows[level].cloneNode(true);
    //cells
    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      cell = row.childNodes[i];
      text = document.createTextNode(fn(this.config.columns[i], data));
      cell.appendChild(text);
    }
    return row;
  };

  DataTable.prototype.createBody2 = function(batch, data, level) {
    var row, child, nextLevel = level + 1;
    if (data.values) {
      // groupBy rows
      /*row = {
        addEventListener: function() {},
        appendChild: function() {},
        classList: {
          add: function() {}
        }
      };*/
      row = this.cloneRow(this._onCreateCellGroup, data, level);
      row.classList.add(this.CssClasses.TOTAL);

      // groupBy rows event
      row.addEventListener('click', this.dataRowClickHandler.bind(this));
      row.level = level;
      row.rowTree = [];
      if (level >= this.config.collapseLevel) {
        row.collapse = true;
      }
      batch.appendChild(row);
      //batch.push(row);

      // groupBy values
      if (data.values[0].values) {
        for (var i = 0, l = data.values.length; i < l; i++) {
          child = this.createBody(batch, data.values[i], nextLevel);
          row.rowTree.push(child);
        }
      } else {
        // Data rows
        for (var i = 0, l = data.values.length; i < l; i++) {
          /*child = {
            addEventListener: function() {},
            appendChild: function() {}
          };*/
          child = this.cloneRow(this._onCreateCellData, data.values[i], nextLevel);
          batch.appendChild(child);
          //batch.push(child);
          row.rowTree.push(child);
        }
        //window.requestAnimFrame(function() {batch.appendChild(row);});
      }
    }
    return row;

  };

  DataTable.prototype.createBody = function(batch, data, level) {
    var row, child, nextLevel = level + 1;
    if (data.values) {
      // groupBy rows
      row = this.cloneRow(this._onCreateCellGroup, data, level);
      row.classList.add(this.CssClasses.TOTAL);

      // groupBy rows event
      row.addEventListener('click', this.dataRowClickHandler.bind(this));
      row.level = level;
      row.rowTree = [];
      if (level >= this.config.collapseLevel) {
        row.collapse = true;
      }
      batch.appendChild(row);
      // groupBy values
      for (var i = 0, l = data.values.length; i < l; i++) {
        child = this.createBody(batch, data.values[i], nextLevel);
        row.rowTree.push(child);
      }
    } else {
      // Data rows
      row = this.cloneRow(this._onCreateCellData, data, level);
      batch.appendChild(row);
      //window.requestAnimFrame(function() {batch.appendChild(row);});
    }

    return row;
  };

  DataTable.prototype._onCreateCellHeader = function(column) {
    return column.alias;
  };

  DataTable.prototype._onCreateCellData = function(column, data) {
    /*if (column.name != 'txt_id2') {
      return data[column.name].toFixed(2).toLocaleString();
    }*/
    return data[column.name];
  };

  DataTable.prototype._onCreateCellGroup = function(column, data) {
    if (column.aggregate && data.aggregate) {
      /*return data.aggregate[column.name].toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });*/
      return data.aggregate[column.name];
    } else if (column.virtual) {
      /*return data.aggregate[column.name].toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });*/
      return data.aggregate[column.name];
    } else {
      return data.key;
    }
  };

  /**
   * handling ui
   */
  DataTable.prototype.closestRow = function(e) {
    while (e) {
      if (e.tagName == 'TR') {
        return e;
      }
      e = e.parentElement;
    }
  };

  DataTable.prototype.dataRowClickHandler = function(event) {
    var row = this.closestRow(event.target);
    if (row) {
      if (row.collapse) {
        crono.start('expandRows');
        row.collapse = false;
        this.expandRows(row);
        crono.stop('expandRows');
      } else {
        crono.start('collapseRows');
        row.collapse = true;
        this.collapseRows(row, 0);
        crono.stop('collapseRows');
      }
      var control = row.firstChild.firstChild;
      control.classList.toggle(this.CssClasses.ARROW_BOTTOM);
      control.classList.toggle(this.CssClasses.ARROW_RIGHT);
    }
  };

  DataTable.prototype.collapseRows = function(row, isChild) {
    if (row.rowTree) {
      for (var i = 0, l = row.rowTree.length; i < l; i++) {
        row.rowTree[i].classList.add(this.CssClasses.HIDDEN);
        this.collapseRows(row.rowTree[i]);
      }
    }
  };

  DataTable.prototype.expandRows = function(row) {
    if (row.rowTree) {
      for (var i = 0, l = row.rowTree.length; i < l; i++) {
        row.rowTree[i].classList.remove(this.CssClasses.HIDDEN);
        if (!row.rowTree[i].collapse) {
          this.expandRows(row.rowTree[i]);
        }
      }
    }
  };

})(window, document, window.gr = window.gr || {});
