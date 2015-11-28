(function(window, document, undefined) {
  'use strict';

  QUnit.module('GData');
  QUnit.test('GData groupig', function(assert) {
    assert.ok(window.GData, 'GData is ok');

    var gd = Object.create(GData.prototype);
    var a1_obj = {
      text: 'testing'
    };
    var a1_arr = ['testing'];
    assert.deepEqual(gd.arrayFromObject(a1_obj), a1_arr, "GData.arrayFromObject {text:'testing'} to ['testing']");

    var a2_data = [{
      id1: 1,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 1,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }, {
      id1: 2,
      colum1: 1,
      colum2: 10,
      colum3: 100
    }];
    var a2_group = [
      [{
        'colum1': 1,
        'colum2': 10,
        'colum3': 100,
        'id1': 1
      }, {
        'colum1': 1,
        'colum2': 10,
        'colum3': 100,
        'id1': 1
      }],
      [{
        'colum1': 1,
        'colum2': 10,
        'colum3': 100,
        'id1': 2
      }]
    ];
    assert.deepEqual(gd.groupBy(a2_data, function(item) {
      return item.id1;
    }), a2_group, 'GData.groupBy function(item) {return item.id1;}');
  });

})(window, document);
