(function(window, document, gr, undefined) {
  'use strict';

  gr.clone = function(obj) {
    var objClone = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        objClone[key] = obj[key];
      }
    }
    return objClone;
  };

  gr.extend = function(base) {
    var extensionObject;
    for (var i = 1, l = arguments.length; i < l; i++) {
      extensionObject = arguments[i];
      for (var key in extensionObject) {
        if (extensionObject.hasOwnProperty(key)) {
          base[key] = extensionObject[key];
        }
      }
    }
  };

  // last two args are optional
  gr.loop = function(array, fn, context) {
    crono.start('loop');
    context = context || window;
    var index = 0,
      maxTimePerChunk = 70,
      l = array.length;

    function now() {
      return new Date().getTime();
    }
    var nchunk = 0;

    function doChunk() {
      crono.start('doChunk');
      nchunk = 0
      var startTime = now();
      while (index < l && (now() - startTime) <= maxTimePerChunk) {
        // callback called with args (value, index, array)
        fn.call(context, array[index], index, array);
        ++nchunk;
        ++index;
      }
      console.log('requestAnimationFrame : nchunk ' + nchunk);
      crono.stop('doChunk');
      if (index < array.length) {
        // set Timeout for async iteration
        //setTimeout(doChunk, 1);
        requestAnimationFrame(doChunk);
      } else {
        crono.stop('loop');
        crono.stop('report');
      }
    }
    doChunk();
  }


  /** https://gist.github.com/joelambert/1002116 */


})(window, document, window.gr = window.gr || {});
