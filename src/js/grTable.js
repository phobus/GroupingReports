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
    crono.start('report');

    crono.start('render');
    var l = data.length;


    crono.start('groupBy data');
    data = gr.Data.grouping(this.config.columns, this.config.groupBy, data, this.config.total);
    console.log(data);
    crono.stop('groupBy data');


    crono.start('renderTable');
    this.renderTable(data);
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
    this.rowIndex = [];

    //header row
    thead.appendChild(this.createRowAndCells('th', true, true));

    if (this.config.total) {
      data[0].key = this.config.total.alias;
    }
    //table body
    if (!this.config.total || this.config.total.position == 'top') {
      // table body - no total or total top
      this.createBody(tbody, data, 0);

    } else if (this.config.total && this.config.total.position == 'bottom') {
      // table body - total bottom
      this.createBody(tbody, data[0].values, 0);

      // table foot - total bottom
      var tfoot = document.createElement('tfoot'),
        row = this.createRowAndCells('td', false, false, data[0]);
      row.className = this.CssClasses.TOTAL;
      tfoot.appendChild(row);
      table.appendChild(tfoot);
    }

    //requestAnimationFrame batch rows
    gr.loop(batch, function(item) {
      if (item.total) {
        item.row = this.cloneRow(this._onCreateCellGroup, item.data, item.level);
        item.row.classList.add(this.CssClasses.TOTAL);
        // groupBy rows event
        item.row.addEventListener('click', this.dataRowClickHandler.bind(this));
      } else {
        item.row = this.cloneRow(this._onCreateCellData, item.data, item.level);
      }
      tbody.appendChild(item.row);
    }, this);

    return table;
  };

  DataTable.prototype.createRowAndCells = function(tag, setWidth, setAlias, total) {
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
      if (total) {
        text = document.createTextNode(this._onCreateCellGroup(column, total));
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

  DataTable.prototype.createNode = function(data, level) {
    return {
      data: data,
      level: level
    };
  };

  DataTable.prototype.createBody = function(batch, data, level) {
    var nextLevel = level + 1,
      childs = [],
      node;
    for (var i = 0, l = data.length; i < l; i++) {
      if (data[i].values) {
        node = this.createNode(data[i], level);
        node.total = true;
        batch.push(node);
        childs.push(node);
        this.rowIndex.push(node);

        if (level >= this.config.collapseLevel) {
          node.collapse = true;
        }

        node.childs = this.createBody(batch, data[i].values, nextLevel);
      } else {
        node = this.createNode(data[i], level);
        batch.push(node);
        childs.push(node);
      }
    }
    return childs;
  };

  DataTable.prototype._onCreateCellHeader = function(column) {
    return column.alias;
  };

  DataTable.prototype._onCreateCellData = function(column, data) {
    /*if (column. != '') {
      return data[column.name].toFixed(2).toLocaleString();
    }*/
    return data[column.name];
  };

  DataTable.prototype._onCreateCellGroup = function(column, data) {
    if (column.aggregate && data.aggregate) {
      return data.aggregate[column.name];
    } else if (column.virtual) {
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
        for (var i = 0, l = this.rowIndex.length; i < l; i++) {
          if (this.rowIndex[i].row == e) {
            return this.rowIndex[i];
          }
        }
      }
      e = e.parentElement;
    }
  };

  DataTable.prototype.dataRowClickHandler = function(event) {
    var node = this.closestRow(event.target);
    if (node) {
      if (node.collapse) {
        crono.start('expandRows');
        node.collapse = false;
        this.expandRows(node);
        crono.stop('expandRows');
      } else {
        crono.start('collapseRows');
        node.collapse = true;
        this.collapseRows(node);
        crono.stop('collapseRows');
      }
      var control = node.row.firstChild.firstChild;
      control.classList.toggle(this.CssClasses.ARROW_BOTTOM);
      control.classList.toggle(this.CssClasses.ARROW_RIGHT);
    }
  };

  DataTable.prototype.collapseRows = function(node) {
    if (node.childs) {
      for (var i = 0, l = node.childs.length; i < l; i++) {
        node.childs[i].row.classList.add(this.CssClasses.HIDDEN);
        this.collapseRows(node.childs[i]);
      }
    }
  };

  DataTable.prototype.expandRows = function(node) {
    if (node.childs) {
      for (var i = 0, l = node.childs.length; i < l; i++) {
        node.childs[i].row.classList.remove(this.CssClasses.HIDDEN);
        if (!node.childs[i].collapse) {
          this.expandRows(node.childs[i]);
        }
      }
    }
  };

})(window, document, window.gr = window.gr || {});
