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
      tbody = document.createElement('tbody');

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

    if (!this.config.total || this.config.total.position == 'top') {
      //no total or total top
      for (var i = 0, l = data.length; i < l; i++) {
        this.createBody(tbody, data[i], 0);
      }
    } else if (this.config.total && this.config.total.position == 'bottom') {
      //total bottom
      for (var i = 0, l = data[0].values.length; i < l; i++) {
        this.createBody(tbody, data[0].values[i], 0);
      }

      //row foot
      var text, cell, tfoot = document.createElement('tfoot'),
        row = this.createRowAndCells('td');

      //cells
      for (var i = 0, l = this.config.columns.length; i < l; i++) {
        cell = row.childNodes[i];
        text = document.createTextNode(this._onCreateCellGroup(this.config.columns[i], data[0]));
        cell.appendChild(text);
      }
      tfoot.appendChild(row);
      table.appendChild(tfoot);
    }
    //requestAnimationFrame(this.createBody.bind(this, tbody, data[0], 0));

    return table;
  };

  DataTable.prototype.createRowAndCells = function(tag, setWidth, setAlias) {
    var column, cell, row = document.createElement('tr');
    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      column = this.config.columns[i];
      cell = document.createElement(tag);
      //header width
      if (setWidth && column.width) {
        cell.style.width = column.width;
      }

      //text alias
      if (setAlias) {
        var text = document.createTextNode(this._onCreateCellHeader(column));
        cell.appendChild(text);
      }

      //config column styles
      if (column.cssClass) {
        cell.classList.add(column.cssClass);
      }
      row.appendChild(cell);
    }
    return row;
  };

  DataTable.prototype.getMaxLevel = function() {
      return (this.config.total && this.config.total.position == 'top') ?
        this.config.groupBy.length + 1 :
        this.config.groupBy.length;
    },

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

  DataTable.prototype.createBody = function(tbody, data, level) {
    var row, child;
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
      tbody.appendChild(row);

      // groupBy values
      for (var k = 0, l = data.values.length; k < l; k++) {
        child = this.createBody(tbody, data.values[k], level + 1);
        row.rowTree.push(child);
        //requestAnimationFrame(this.createBody.bind(this, tbody, data.values[k], level + 1));
      }
    } else {
      // Data rows
      row = this.cloneRow(this._onCreateCellData, data, level);
      tbody.appendChild(row);
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
