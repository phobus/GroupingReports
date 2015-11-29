(function(window, document, undefined) {
  'use strict';

  var GTable = function(element, config) {
    this.container = document.getElementById(element);

    config = config || {};

    this.granTotal = config.granTotal;
    this.tableCssClass = config.tableCssClass || this.CssClasses.TABLE;

    this.columns = config.columns || {};

    this.grouping = config.grouping || [];
  }
  window['GTable'] = GTable;

  GTable.prototype = {
    Constant: {
      TREE_PADDING: 12,
      TREE_PADDING_U: "px"
    },
    CssClasses: {
      TABLE: 'gtable',
      HIDDEN: 'hidden',
      TOTAL: 'total',
      CTRL: 'ctrl',
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
      } else {
        return data.key;
      }
    },
    render: function(data) {
      this._aggregate = this.columns.filter(function(o, i) {
        return o.aggregate || false;
      });
      var gd = Object.create(GData.prototype);
      data = gd.grouping(data, this.grouping, this._aggregate);

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
    renderDataRow: function(tbody, data, lvl) {
      var row;
      if (data.values) {
        // grouping rows
        row = this.createRow(data, this.columns, lvl, this._onCreateCellGroup, lvl);
        row.classList.add(this.CssClasses.TOTAL);

        // grouping rows event
        row.addEventListener('click', this.dataRowClickHandler.bind(this));
        row.dataset.grouping = data.grouping;
        tbody.appendChild(row);

        // grouping values
        var l = data.values.length;
        for (var k = 0; k < l; k++) {
          this.renderDataRow(tbody, data.values[k], lvl + 1);
        }
      } else {
        // Data rows
        row = this.createRow(data, this.columns, lvl, this._onCreateCellData);
        tbody.appendChild(row);
      }

    },
    createRow: function(data, columns, lvl, fn) {
      var row = document.createElement('tr'),
        ctrl = document.createElement('span'),
        l = columns.length,
        s = this.grouping.length,
        w = lvl * this.Constant.TREE_PADDING + this.Constant.TREE_PADDING_U,
        tag = lvl ? 'td' : 'th',
        cell, text;

      for (var i = 0; i < l; i++) {
        cell = document.createElement(tag);
        if (i == 0 && lvl >= 0) {
          ctrl.classList.add(this.CssClasses.CTRL);
          if (lvl <= s) {
            ctrl.classList.add(this.CssClasses.ARROW_BOTTOM);
          }
          ctrl.style['padding-left'] = w;
          cell.appendChild(ctrl);
        }
        text = document.createTextNode(fn(i, columns[i], data));
        cell.appendChild(text);

        if (columns[i].cssClass) {
          cell.classList.add(columns[i].cssClass);
        }
        row.appendChild(cell);
      }
      //tree ctrl
      /*var ctrl = document.createElement('span');
      ctrl.classList.add(this.CssClasses.CTRL);
      ctrl.classList.add(this.CssClasses.ARROW_BOTTOM);
      row.firstChild.insertBefore(ctrl, row.firstChild.childNodes[0]);*/

      return row;
    },
    dataRowClickHandler: function(event) {
      // element.closest(selectors); ie??? Not supported
      // console.log(event.target.closest('tr'));
      // https://github.com/jonathantneal/closest
      var row = event.target.closest('tr'),
        ctrl = row.getElementsByClassName('ctrl')[0],
        nextRow = row.nextSibling;
      if (nextRow) {
        ctrl.classList.toggle(this.CssClasses.ARROW_BOTTOM);
        ctrl.classList.toggle(this.CssClasses.ARROW_RIGHT);

        var data = row.dataset;
        var collapse = !nextRow.classList.contains(this.CssClasses.HIDDEN);
        while (nextRow) {
          if (nextRow.dataset.grouping == data.grouping) {
            break;
          }
          if (collapse) {
            nextRow.classList.add(this.CssClasses.HIDDEN);
          } else {
            nextRow.classList.remove(this.CssClasses.HIDDEN);
          }
          nextRow = nextRow.nextSibling;
        }
      }
    }
  }

})(window, document);
