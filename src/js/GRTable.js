/**
 *
 *
 */
(function(window, document, undefined) {
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
  var GTable = function(element, config) {
    this.container = element;

    var defaultConfig = Gr.clone(baseConfig);
    Gr.extend(defaultConfig, config);

    this.config = defaultConfig;
  };
  window['GRTable'] = GTable;

  GTable.prototype.CssClasses = {
    HIDDEN: 'gr-hidden',
    TOTAL: 'gr-total',
    CONTROL: 'gr-control',
    ARROW_BOTTOM: 'gr-arrow-bottom',
    ARROW_RIGHT: 'gr-arrow-right'
  };

  GTable.prototype._onCreateCellHeader = function(column) {
    return column.alias;
  };
  GTable.prototype._onCreateCellData = function(column, data) {
    return data[column.name];
  };

  GTable.prototype._onCreateCellGroup = function(column, data) {
    if (column.aggregate && data.aggregate) {
      return data.aggregate[column.name];
    } else if (column.virtual) {
      return data.aggregate[column.name];
    } else {
      return data.key;
    }
  };

  GTable.prototype.render = function(data) {
    var gd = Object.create(GRData.prototype);
    data = gd.grouping(data, this.config.groupBy, this.config.columns);
    /*var aggregate = this.config.columns.filter(function(o, i) {
      return o.aggregate || o.virtual || false;
    });
    var grd = new GrData();
    var data = grd.grouping(data, this.config.groupBy, aggregate, 0);*/
    console.log(data);
    var table = this.renderTable(data);
    this.container.appendChild(table);
  };

  GTable.prototype.renderTable = function(data) {
    var table = document.createElement('table'),
      thead = document.createElement('thead'),
      tbody = document.createElement('tbody');

    //table attributes
    table.className = this.config.cssClass;
    table.appendChild(thead);
    table.appendChild(tbody);

    this.buildCache();

    //Base row for cloning
    this.createBaseRow();

    // table
    this.createHeader(thead);

    if (this.config.total && this.config.total.position == 'top') {
      this.createBody(tbody, data, 0);
    } else {
      this._maxLevel--;
      for (var i = 0, l = data.values.length; i < l; i++) {
        this.createBody(tbody, data.values[i], 0);
      }
      if (this.config.total && this.config.total.position == 'bottom') {
        this.createFoot(table, data);
      }
    }
    return table;
  };

  GTable.prototype.buildCache = function() {
    this._maxLevel = this.config.groupBy.length + 1;
    this._paddings = [];
    var value;
    for (var i = 0; i < this._maxLevel; i++) {
      value = (i * this.config.tree.padding) + this.config.tree.unit;
      value = '0 0 0 ' + value;
      this._paddings.push(value);
    }
  };

  GTable.prototype.createBaseRow = function() {
    this._baseDataRow = document.createElement('tr');
    var cell, control = document.createElement('span');

    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      cell = document.createElement('td');
      if (this.config.columns[i].cssClass) {
        cell.classList.add(this.config.columns[i].cssClass);
      }
      this._baseDataRow.appendChild(cell);
    }
    control.classList.add(this.CssClasses.CONTROL);
    control.style.padding = this._paddings[this.config.groupBy.length];
    this._baseDataRow.firstChild.appendChild(control);
  };

  GTable.prototype.createHeader = function(thead) {
    var text, cell, row = document.createElement('tr');
    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      cell = document.createElement('th');
      text = document.createTextNode(this._onCreateCellHeader(this.config.columns[i]));
      cell.appendChild(text);
      if (this.config.columns[i].cssClass) {
        cell.classList.add(this.config.columns[i].cssClass);
      }
      row.appendChild(cell);
    }
    thead.appendChild(row);
  };

  GTable.prototype.createFoot = function(table, data) {
    var text, cell, row = document.createElement('tr'),
      tfoot = document.createElement('tfoot');
    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      cell = document.createElement('td');
      if (this.config.columns[i].cssClass) {
        cell.classList.add(this.config.columns[i].cssClass);
      }
      text = document.createTextNode(this._onCreateCellGroup(this.config.columns[i], data));
      cell.appendChild(text);
      row.appendChild(cell);
    }
    row.classList.add(this.CssClasses.TOTAL);
    tfoot.appendChild(row);
    table.appendChild(tfoot);
  };

  GTable.prototype.createBody = function(tbody, data, level) {
    var row;
    if (data.values) {
      // groupBy rows
      row = this.createDataRow(this._onCreateCellGroup, data, level);
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
      row = this.createDataRow(this._onCreateCellData, data, level);
      tbody.appendChild(row);
    }
  };

  GTable.prototype.createDataRow = function(fn, data, level) {
    var row = this._baseDataRow.cloneNode(true),
      control = row.firstChild.firstChild,
      cell,
      text;

    //tree control
    if (level >= this._maxLevel) {
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
      control.style.padding = this._paddings[level];
    }

    //cells
    for (var i = 0, l = this.config.columns.length; i < l; i++) {
      cell = row.childNodes[i];
      text = document.createTextNode(fn(this.config.columns[i], data));
      cell.appendChild(text);
    }
    return row;
  };

  /**
   * handling ui
   */
  GTable.prototype.closestRow = function(e) {
    while (e) {
      if (e.tagName == 'TR') {
        return e;
      }
      e = e.parentElement;
    }
  };

  GTable.prototype.dataRowClickHandler = function(event) {
    crono.start('dataRowClickHandler');
    // element.closest(selectors); ie??? Not supported
    // var row = event.target.closest('TR');
    // https://github.com/jonathantneal/closest
    var row = this.closestRow(event.target);
    if (row) {
      if (row.dataset.collapse) {
        delete row.dataset.collapse;
        this.expandRows(row);
      } else {
        row.dataset.collapse = true;
        this.collapseRows(row);
      }
      var control = row.firstChild.firstChild;
      control.classList.toggle(this.CssClasses.ARROW_BOTTOM);
      control.classList.toggle(this.CssClasses.ARROW_RIGHT);
    }
    crono.stop('dataRowClickHandler');
  };

  GTable.prototype.collapseRows = function(row) {
    var level,
      clickRowLevel = row.dataset.level,
      nextRow = row.nextSibling;
    while (nextRow) {
      level = nextRow.dataset.level;
      if (level <= clickRowLevel) {
        break;
      }
      nextRow.classList.add(this.CssClasses.HIDDEN);
      nextRow = nextRow.nextSibling;
    }
  };

  GTable.prototype.expandRows = function(row) {
    var level, clickRowLevel = row.dataset.level,
      nextRow = row.nextSibling,
      skip = false,
      skipLevel;

    var i = 0;
    while (nextRow) {
      level = nextRow.dataset.level;
      if (level <= clickRowLevel) {
        break;
      }
      if (level) {
        if (skipLevel === undefined || level <= skipLevel) {
          if (nextRow.dataset.collapse) {
            nextRow.classList.remove(this.CssClasses.HIDDEN);
            skip = true;
            skipLevel = level;
          } else {
            skip = false;
          }
        }
      }

      if (!skip) {
        nextRow.classList.remove(this.CssClasses.HIDDEN);
      }
      nextRow = nextRow.nextSibling;
    }
  };

  GTable.prototype.selectRows = function(row) {
    var level, clickRowLevel = row.dataset.level,
      nextRow = row.nextSibling,
      arr = [];
    while (nextRow) {
      level = nextRow.dataset.level;
      if (level <= clickRowLevel) {
        break;
      }
      arr.push(nextRow);
      nextRow = nextRow.nextSibling;
    }
    return arr;
  };

})(window, document);
