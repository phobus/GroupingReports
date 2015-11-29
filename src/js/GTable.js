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
        tbody = document.createElement('tbody'),
        header;

      table.className = this.tableCssClass;

      //create table header
      header = this.createRow(null, this.columns, 'th', function(i, column, data) {
        return column.alias;
      })
      thead.appendChild(header);
      table.appendChild(thead);

      //create table body
      this.renderDataRow(tbody, data);
      table.appendChild(tbody);

      return table;
    },
    renderDataRow: function(tbody, node) {
      var cell, row = document.createElement('tr'),
        column, l = this.columns.length;
      var ctrl = document.createElement('td');
      row.appendChild(ctrl);
      if (node.values) {
        row = this.createRow(node, this.columns, 'td', function(i, column, data) {
          if (column.aggregate && node.aggregate) {
            return node.aggregate[column.name];
          } else {
            return node.key;
          }
        });
        row.classList.add('total');
        // grouping rows event
        row.addEventListener('click', this.dataRowClickHandler.bind(this));
        row.dataset.grouping = node.grouping;
        tbody.appendChild(row);

        // grouping values
        l = node.values.length;
        for (var k = 0; k < l; k++) {
          this.renderDataRow(tbody, node.values[k]);
        }
      } else {
        // Data rows
        row = this.createRow(node, this.columns, 'td', function(i, column, data) {
          return data[column.name]
        });
        tbody.appendChild(row);
      }
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
