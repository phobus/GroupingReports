(function(window, document, undefined) {
  'use strict';

  var GTable = function(element, config) {
    this.container = document.getElementById(element);

    config = config || {};

    this.granTotal = config.granTotal;
    this.tableCssClass = config.tableCssClass || 'gtable';

    this.columns = config.columns || {};

    this.grouping = config.grouping || [];
  }
  window['GTable'] = GTable;

  GTable.prototype = {
    _onCreateRowHeader: function(i, column, data) {
      return column.alias;
    },
    _onCreateRowData: function(i, column, data) {
      return data[column.name]
    },
    _onCreateRowGroup: function(i, column, data) {
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

      table.className = this.tableCssClass;
      table.appendChild(thead);
      table.appendChild(tbody);

      //create table header
      thead.appendChild(this.createRow(null, this.columns, 'th', this._onCreateRowHeader));

      //create table body
      this.renderDataRow(tbody, data);

      return table;
    },
    renderDataRow: function(tbody, node) {
      var row;
      if (node.values) {
        row = this.createRow(node, this.columns, 'td', this._onCreateRowGroup);
        row.classList.add('total');

        // grouping rows event
        row.addEventListener('click', this.dataRowClickHandler.bind(this));
        row.dataset.grouping = node.grouping;

        // grouping values
        var l = node.values.length;
        for (var k = 0; k < l; k++) {
          this.renderDataRow(tbody, node.values[k]);
        }
      } else {
        // Data rows
        row = this.createRow(node, this.columns, 'td', this._onCreateRowData);

      }
      tbody.appendChild(row);
    },
    createRow: function(data, columns, tag, fn) {
      var cell, row = document.createElement('tr'),
        l = columns.length;

      var ctrl = document.createElement('td');
      row.appendChild(ctrl);
      ctrl.style.width = "20px";

      for (var i = 0; i < l; i++) {
        cell = document.createElement(tag);
        cell.innerHTML = fn(i, columns[i], data);
        if (columns[i].cssClass) {
          cell.classList.add(columns[i].cssClass);
        }
        row.appendChild(cell);
      }
      return row;
    },
    dataRowClickHandler: function(event) {
      var row = event.target.parentNode.nextSibling;
      var data = event.target.parentNode.dataset;
      var collapse = !row.classList.contains('hidden');
      while (row) {
        if (row.dataset.grouping == data.grouping) {
          break;
        }
        if (collapse) {
          row.classList.add('hidden');
        } else {
          row.classList.remove('hidden');
        }

        row = row.nextSibling;
      }
    }
  }

})(window, document);
