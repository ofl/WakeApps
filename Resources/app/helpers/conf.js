var exports;
(function() {
  app.properties.isIpad = Ti.Platform.displayCaps.platformWidth === 768 || Ti.Platform.model.indexOf('iPad') > -1 ? true : false;
  app.properties.isPortrait = true;
  app.properties.isActive = false;
  return app.properties.repeats = [L('conf.none'), L('conf.daily'), L('conf.weekly'), L('conf.monthly'), L('conf.yearly')];
})();
exports = {};