var exports;
(function() {
  app.properties.isiPad = Ti.Platform.displayCaps.platformWidth === 768 ? true : false;
  app.properties.isPortrait = true;
  return app.properties.repeats = ['None', 'Every Day', 'Sunday', 'Monday', 'Tuesday', 'Wendsday', 'Thurthday', 'Friday', 'Saturday', 'Monthly'];
})();
exports = {};