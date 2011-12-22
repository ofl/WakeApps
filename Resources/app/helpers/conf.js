exports.conf = {
  isIpad: Ti.Platform.displayCaps.platformWidth === 768 || Ti.Platform.model.indexOf('iPad') > -1 ? true : false,
  repeats: [L('conf.none'), L('conf.daily'), L('conf.weekly'), L('conf.monthly'), L('conf.yearly')]
};