/**
 *
 *
 */
(function(window, document, Gr, undefined) {
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

    /** @type {Object} gran total: top or bottom */
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

    var defaultConfig = Gr.clone(baseConfig);
    Gr.extend(defaultConfig, config);

    this.config = defaultConfig;
  };
  Gr.DataTable = DataTable;

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

    var aggregateColumns = this.config.columns.filter(function(o, i) {
      return o.aggregate || o.virtual || false;
    });
    this.config.groupBy.unshift('__ALL__');
    data = Gr.Data.grouping(aggregateColumns, data, this.config.groupBy, 0);
    console.log(data);

    crono.stop('groupBy data');


    crono.start('renderTable');

    var table = this.renderTable(data);
    this.container.appendChild(table);

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

    // cache for cloning rows :D
    this.buildCache();

    thead.appendChild(this.createRow('th', true, true));

    this.createBody(tbody, data[0], 0);

    return table;
  };

  DataTable.prototype.createRow = function(tag, setWidth, setAlias) {
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

  DataTable.prototype.buildCache = function() {
    var row, control, maxLevel = this.config.groupBy.length + 1;
    this._baseRows = [];

    for (var level = 0; level < maxLevel; level++) {
      row = this.createRow('td');
      control = document.createElement('span');
      control.className = this.CssClasses.CONTROL;
      if (level != 0) {
        control.style.padding = '0 0 0 ' + (level * this.config.tree.padding) + this.config.tree.unit;
      }
      row.firstChild.appendChild(control);

      //tree control
      if (level >= maxLevel) {
        //data rows
        row.classList.add(this.CssClasses.HIDDEN);
      } else {
        if (level === 0) {
          //rows groupby
          control.classList.add(this.CssClasses.ARROW_BOTTOM);
        } else if (level == 1) {
          control.classList.add(this.CssClasses.ARROW_RIGHT);
          row.dataset.collapse = true;
        } else {
          control.classList.add(this.CssClasses.ARROW_RIGHT);
          row.dataset.collapse = true;
          row.classList.add(this.CssClasses.HIDDEN);
        }
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
    var row;
    if (data.values) {
      // groupBy rows
      row = this.cloneRow(this._onCreateCellGroup, data, level);
      row.classList.add(this.CssClasses.TOTAL);

      // groupBy rows event
      row.addEventListener('click', this.dataRowClickHandler.bind(this));
      row.dataset.level = level;
      tbody.appendChild(row);

      // groupBy values
      for (var k = 0, l = data.values.length; k < l; k++) {
        this.createBody(tbody, data.values[k], level + 1);
      }
    } else {
      // Data rows
      row = this.cloneRow(this._onCreateCellData, data, level);
      tbody.appendChild(row);
    }
  };

  DataTable.prototype._onCreateCellHeader = function(column) {
    return column.alias;
  };

  DataTable.prototype._onCreateCellData = function(column, data) {
    if (column.name != 'txt_id2') {
      return data[column.name].toFixed(2);
    }
    return data[column.name];
  };

  DataTable.prototype._onCreateCellGroup = function(column, data) {
    if (column.aggregate && data.aggregate) {
      return data.aggregate[column.name].toFixed(2);
    } else if (column.virtual) {
      return data.aggregate[column.name].toFixed(2);
    } else {
      return data.key;
    }
  };

  DataTable.prototype.dataRowClickHandler = function(event) {
    console.log(event);
  };

})(window, document, window.Gr = window.Gr || {});
