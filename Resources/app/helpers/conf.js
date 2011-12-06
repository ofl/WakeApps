var exports;
(function() {
  app.properties.dbVersion = Ti.App.Properties.getInt('dbVersion');
  app.properties.isIpad = Ti.Platform.displayCaps.platformWidth === 768 || Ti.Platform.model.indexOf('iPad') > -1 ? true : false;
  app.properties.isPortrait = true;
  app.properties.isActive = false;
  return app.properties.repeats = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
})();
exports = {};