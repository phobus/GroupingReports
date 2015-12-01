(function(window, document, undefined) {
  'use strict';



  if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = (function() {

      return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

          window.setTimeout(callback, 1000 / 60);

        };

    })();

  }

  function animate() {
    requestAnimationFrame(animate);
    doChunk();
  }

  function draw() {
    // Put your code here
  }


  // last two args are optional
  function loopInterval(array, fn, maxTimePerChunk, context) {
    context = context || window;
    maxTimePerChunk = maxTimePerChunk || 200;
    var index = 0;

    function now() {
      return new Date().getTime();
    }
    var _this = this;



    function doChunk() {
      var startTime = now();
      while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
        // callback called with args (value, index, array)
        fn.call(context, array[index], index, array);
        ++index;
      }
      if (index < array.length) {
        // set Timeout for async iteration
        setTimeout(doChunk, 1);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      doChunk();
    }
    animate();
  }
  window['loopInterval'] = loopInterval;

  var GList = function(config) {}
  window['GList'] = GList;

  GList.prototype = {
    render: function(data, fn) {
      //var gd = Object.create(GData.prototype);
      //data = gd.groupBy(data, fn);
      var ul = document.createElement('ul');
    }
  }

  var crono = {
    start: function() {
      this.init = new Date().getTime();
    },
    log: function(text) {
      console.log(text + ' time= ' + (new Date().getTime() - this.init));
    }
  }
  window['crono'] = crono;
})(window, document);
