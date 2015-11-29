(function(window, document, undefined) {
  'use strict';

  QUnit.module('GData');
  QUnit.test('GData groupig', function(assert) {
    assert.ok(window.GData, 'GData is ok');

    var gd = Object.create(GData.prototype);
    var obj = {
      text: 'testing'
    };
    var arr = ['testing'];
    assert.deepEqual(gd.arrayFromObject(obj), arr, "GData.arrayFromObject {text:'testing'} to ['testing']");

    var data = [{
      id1: 1,
      id2: 1,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 1,
      id2: 2,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 1,
      id2: 3,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 2,
      id2: 4,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 3,
      id2: 5,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 4,
      id2: 6,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }];
    var group = [{
      "grouping": "id1",
      "key": 1,
      "values": [{
        "colum1": 1,
        "colum2": 10,
        "colum3": 100,
        "id1": 1,
        "id2": 1
      }, {
        "colum1": 1,
        "colum2": 10,
        "colum3": 100,
        "id1": 1,
        "id2": 2
      }, {
        "colum1": 1,
        "colum2": 10,
        "colum3": 100,
        "id1": 1,
        "id2": 3
      }]
    }, {
      "grouping": "id1",
      "key": 2,
      "values": [{
        "colum1": 1,
        "colum2": 10,
        "colum3": 100,
        "id1": 2,
        "id2": 4
      }]
    }, {
      "grouping": "id1",
      "key": 3,
      "values": [{
        "colum1": 1,
        "colum2": 10,
        "colum3": 100,
        "id1": 3,
        "id2": 5
      }]
    }, {
      "grouping": "id1",
      "key": 4,
      "values": [{
        "colum1": 1,
        "colum2": 10,
        "colum3": 100,
        "id1": 4,
        "id2": 6
      }]
    }];
    assert.deepEqual(gd.groupBy(data, 'id1'), group, 'GData.groupBy "id1"');

    var aggregate = [{
      name: 'column1',
      aggregate: 'sum'
    }, {
      name: 'column1',
      aggregate: 'sum'
    }, {
      name: 'column1',
      aggregate: 'sum'
    }];
    assert.deepEqual(gd.groupAndAggregateBy(data, 'id1', aggregate), group, 'GData.groupBy "id1"');
  });

})(window, document);
