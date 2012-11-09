window.Controller = function(options) {
  options = options || {};
  var settings = {
    debug: options.debug || false,
    changeCallback: options.changeCallback || function(){}
  };

  var lastMotion = {};
  var debugScreen;


  // returns if the current device supports orientation changes and device motion
  function supported() {
    return !!(window.DeviceMotionEvent);
  }

  function onMotionChange(e) {
    lastMotion = normalizeAcceleration(e.accelerationIncludingGravity);
    settings.debug && outputDebug();
    settings.changeCallback && settings.changeCallback(lastMotion);
  }

  function outputDebug() {
    if (debugScreen) {
      debugScreen.innerHTML = stringifyObject(lastMotion);
    } else {
      debugScreen = document.createElement("pre");
      document.body.appendChild(debugScreen);
      outputDebug();
    }
  }

  function stringifyObject(obj) {
    var toReturn = "";
    for(var i = 0; i < Object.keys(obj).length; ++i) {
      var key = Object.keys(obj)[i];
      toReturn +=  key + ": " + obj[key] + "</br>";
    }
    return toReturn;
  }

  // inverts the Z axis
  // uses Y for X and flips it and inverts it depending on the orientation
  // so it maps to left and right
  // -- this is basically emulating a steering wheel --
  function normalizeAcceleration(acceleration) {
    var isVertical = (window.orientation == 0 || window.orientation == 180);
    return {
      x: (isVertical ? window.orientation ? acceleration.x : acceleration.x * -1 : window.orientation == -90 ? acceleration.y * -1 : acceleration.y),
      z: acceleration.z * -1,
      orientation: window.orientation
    }
  }

  (function init() {
    supported && window.addEventListener("devicemotion", onMotionChange);
  }())

  return {
    'supported': supported()
  }
};