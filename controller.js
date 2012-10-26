window.Controller = function(options) {
  options = options || {};
  var settings = {
    debug: options.debug || false,
    changeCallback: options.changeCallback || undefined
  };

  var lastMotion = {};
  var debugScreen;


  // returns if the current device supports orientation changes and device motion
  function supported() {
    return !!(window.DeviceOrientationEvent && window.DeviceMotionEvent);
  }

  function onMotionChange(e) {
    lastMotion = normalizeAcceleration(e.accelerationIncludingGravity);
    settings.debug && outputDebug();
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
  // uses Y for X and flips it depending on the orientation
  // -- this is basically emulating a steering wheel --
  function normalizeAcceleration(acceleration) {
    var isVertical = (window.orientation == 0 || window.orientation == 180);
    return {
      x: (isVertical ? acceleration.x : acceleration.y),
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