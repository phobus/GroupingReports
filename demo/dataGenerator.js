(function(window, document, undefined) {
  'use strict';

  var dataGenerator = {
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    randomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomAmount: function() {
      return Math.floor(Math.random() * 100000) / 100;
    },

    create: function(args) {
      args = args || [
        [6, 9],
        [10, 18],
        [1, 10]
      ];
      var data = [],
        j, k, l,
        id1 = 0,
        id2 = 0,
        id3 = 0,
        nid1 = this.randomNumber(args[0][0], args[0][1]),
        nid2,
        nid3;
      for (var j = 0; j < nid1; j++) {
        nid2 = this.randomNumber(args[1][0], args[1][1]);
        for (var k = 0; k < nid2; k++) {
          nid3 = this.randomNumber(args[2][0], args[2][1]);;
          for (var l = 0; l < nid3; l++) {
            data.push({
              category: id1,
              txt_category: 'Category ' + id1,
              subcategory: id2,
              txt_subcategory: 'Subcategory ' + id2,
              product: id3,
              txt_product: 'Product ' + id3,
              column1: this.randomAmount(),
              column2: this.randomAmount(),
              column3: this.randomAmount(),
              column4: this.randomAmount()
            });
            id3++;
          }
          id2++;
        }
        id1++;
      }
      return data;
    }
  }

  window['dataGenerator'] = dataGenerator;

})(window, document);
