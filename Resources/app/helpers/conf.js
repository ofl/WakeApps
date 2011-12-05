var exports;
(function() {
  app.properties.isIpad = Ti.Platform.displayCaps.platformWidth === 768 ? true : false;
  app.properties.isPortrait = true;
  app.properties.isActive = false;
  return app.properties.repeats = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
})();
exports = {};