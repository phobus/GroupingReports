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

    _onCreateCellHeader: function(i, column, data) {
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
      var aggregate = this.columns.filter(function(o, i) {
        return o.aggregate || o.virtual || false;
      });

      var gd = Object.create(GData.prototype);
      data = gd.grouping(data, this.groupBy, aggregate);
      var table = this.renderTable(data);
      this.container.appendChild(table);
    },

    renderTable: function(data) {
      var table = document.createElement('table'),
        thead = document.createElement('thead'),
        tbody = document.createElement('tbody');

      //table attributes
      table.className = this.tableCssClass;
      table.appendChild(thead);
      table.appendChild(tbody);

      //create table header
      thead.appendChild(this.createRow(undefined, this.columns, undefined, this._onCreateCellHeader));

      //create table body
      this.renderDataRow(tbody, data, 0);

      return table;
    },

    renderDataRow: function(tbody, data, level) {
      var row;
      if (data.values) {
        // groupBy rows
        row = this.createRow(data, this.columns, level, this._onCreateCellGroup, level);
        row.classList.add(this.CssClasses.TOTAL);

        // groupBy rows event
        row.addEventListener('click', this.dataRowClickHandler.bind(this));
        row.dataset.level = level;
        tbody.appendChild(row);

        // groupBy values
        for (var k = 0, l = data.values.length; k < l; k++) {
          this.renderDataRow(tbody, data.values[k], level + 1);
        }
      } else {
        // Data rows
        row = this.createRow(data, this.columns, level, this._onCreateCellData);
        tbody.appendChild(row);
      }
    },

    createRow: function(data, columns, level, fn) {
      var row = document.createElement('tr'),
        control = document.createElement('span'),
        groupByLength = this.groupBy.length,
        cssPadding = level * this.Constant.TREE_PADDING + this.Constant.TREE_PADDING_U,
        tag = level ? 'td' : 'th',
        cell, text;

      for (var i = 0, l = columns.length; i < l; i++) {
        cell = document.createElement(tag);
        if (i == 0 && level >= 0) {
          control.classList.add(this.CssClasses.CONTROL);
          if (level <= groupByLength) {
            control.classList.add(this.CssClasses.ARROW_BOTTOM);
          }
          control.style['padding-left'] = cssPadding;
          cell.appendChild(control);
        }
        text = document.createTextNode(fn(i, columns[i], data));
        cell.appendChild(text);

        if (columns[i].cssClass) {
          cell.classList.add(columns[i].cssClass);
        }
        row.appendChild(cell);
      }

      return row;
    },

    dataRowClickHandler: function(event) {
      // element.closest(selectors); ie??? Not supported
      // console.log(event.target.closest('tr'));
      // https://github.com/jonathantneal/closest
      var row = event.target.closest('tr');
      if (row) {
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
    },
    collapseRows: function(row) {
      var nextRow = row.nextSibling;
      while (nextRow) {
        if (nextRow.dataset.level && nextRow.dataset.level <= row.dataset.level) {
          break;
        }
        nextRow.classList.add(this.CssClasses.HIDDEN);
        nextRow = nextRow.nextSibling;
      }
    },
    expandRows: function(row) {
      var nextRow = row.nextSibling,
        data = row.dataset,
        skip = false,
        skipLevel;

      while (nextRow) {
        if (nextRow.dataset.level) {
          if (nextRow.dataset.level <= row.dataset.level) {
            break;
          }

          if (skipLevel === undefined || nextRow.dataset.level <= skipLevel) {
            if (nextRow.dataset.collapse) {
              nextRow.classList.remove(this.CssClasses.HIDDEN);
              skip = true;
              skipLevel = nextRow.dataset.level;
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
    }
  }

})(window, document);
