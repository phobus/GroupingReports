(function(window, document, undefined) {
  'use strict';

  var GTable = function(element, config) {
    this.container = document.getElementById(element);

    config = config || {};

    this.granTotal = config.granTotal;
    this.tableCssClass = config.tableCssClass || this.CssClasses.TABLE;

    this.columns = config.columns || {};

    this.groupBy = config.groupBy || [];
  }
  window['GTable'] = GTable;

  GTable.prototype = {

    Constant: {
      TREE_PADDING: 24,
      TREE_PADDING_U: "px"
    },

    CssClasses: {
      TABLE: 'gtable shadow-2dp',
      HIDDEN: 'hidden',
      TOTAL: 'total',
      CONTROL: 'control',
      ARROW_BOTTOM: 'arrow-bottom',
      ARROW_RIGHT: 'arrow-right'
    },

    _onCreateCellHeader: function(i, column) {
      return column.alias;
    },

    _onCreateCellData: function(i, column, data) {
      return data[column.name]
    },

    _onCreateCellGroup: function(i, column, data) {
      if (column.aggregate && data.aggregate) {
        return data.aggregate[column.name];
      } else if (column.virtual) {
        return data.aggregate[column.name];
      } else {
        return data.key;
      }
    },

    render: function(data) {
      crono.start();
      var aggregate = this.columns.filter(function(o, i) {
        return o.aggregate || o.virtual || false;
      });

      var gd = Object.create(GData.prototype);
      data = gd.grouping(data, this.groupBy, aggregate);
      var table = this.renderTable(data);
      this.container.appendChild(table);
      crono.log('render');
    },

    renderTable: function(data) {
      var table = document.createElement('table'),
        thead = document.createElement('thead'),
        tbody = document.createElement('tbody');

      //table attributes
      table.className = this.tableCssClass;
      table.appendChild(thead);
      table.appendChild(tbody);

      //Base row for cloning
      this.createBaseRow();

      //create table header
      this.createHeader(thead);

      //create table body
      this.createBody(tbody, data, 0);

      return table;
    },

    createBaseRow() {
      var cell, control = document.createElement('span');
      control.classList.add(this.CssClasses.CONTROL);
      this._baseDataRow = document.createElement('tr');

      for (var i = 0, l = this.columns.length; i < l; i++) {
        cell = document.createElement('td');
        if (this.columns[i].cssClass) {
          cell.classList.add(this.columns[i].cssClass);
        }
        this._baseDataRow.appendChild(cell);
      }
      this._baseDataRow.firstChild.appendChild(control);
    },

    createHeader(thead) {
      var text, cell, row = document.createElement('tr')
      for (var i = 0, l = this.columns.length; i < l; i++) {
        cell = document.createElement('th')
        text = document.createTextNode(this._onCreateCellHeader(i, this.columns[i]));
        cell.appendChild(text);
        row.appendChild(cell);
      }
      thead.appendChild(row);
    },

    createBody: function(tbody, data, level) {
      var row;
      if (data.values) {
        // groupBy rows
        row = this.createDataRow(this.columns, this._onCreateCellGroup, data, level);
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
        row = this.createDataRow(this.columns, this._onCreateCellData, data, level);
        tbody.appendChild(row);
      }
    },

    createDataRow: function(columns, fn, data, level) {
      var row = this._baseDataRow.cloneNode(true),
        groupByLength = this.groupBy.length,
        cssPadding = level * this.Constant.TREE_PADDING + this.Constant.TREE_PADDING_U,
        cell, text, control = row.firstChild.firstChild;

      //tree control
      if (level == 0) {
        control.classList.add(this.CssClasses.ARROW_BOTTOM);
      } else if (level == 1) {
        control.classList.add(this.CssClasses.ARROW_RIGHT);
        row.dataset.collapse = true;
      } else if (level <= groupByLength) {
        control.classList.add(this.CssClasses.ARROW_RIGHT);
        row.dataset.collapse = true;
        row.classList.add(this.CssClasses.HIDDEN);
      } else {
        row.classList.add(this.CssClasses.HIDDEN);
      }
      control.style['padding-left'] = cssPadding;

      //cells
      for (var i = 0, l = columns.length; i < l; i++) {
        cell = row.childNodes[i];
        text = document.createTextNode(fn(i, columns[i], data));
        cell.appendChild(text);
      }
      return row;
    },

    closestRow: function(e) {
      while (e) {
        if (e.tagName == 'TR') {
          return e;
        }
        e = e.parentElement;
      }
    },

    dataRowClickHandler: function(event) {
      crono.start();
      // element.closest(selectors); ie??? Not supported
      // var row = event.target.closest('TR');
      // https://github.com/jonathantneal/closest
      var row = this.closestRow(event.target);

      if (row) {
        var rows = this.selectRows(row);
        if (row.dataset.collapse) {
          delete row.dataset.collapse;
          this.expandRows(row);
        } else {
          row.dataset.collapse = true;
          this.collapseRows(row);
        }
        var control = row.getElementsByClassName('control')[0];
        control.classList.toggle(this.CssClasses.ARROW_BOTTOM);
        control.classList.toggle(this.CssClasses.ARROW_RIGHT);
      }
      crono.log('dataRowClickHandler');
    },

    collapseRows: function(row) {
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
    },

    expandRows: function(row) {
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
    },

    selectRows: function(row) {
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
    }

  }

})(window, document);
