var exports;
(function() {
  app.properties.isiPad = Ti.Platform.displayCaps.platformWidth === 768 ? true : false;
  app.properties.isPortrait = true;
  return app.properties.repeats = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
})();
exports = {};