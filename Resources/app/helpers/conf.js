exports.conf = {
  isIpad: Ti.Platform.displayCaps.platformWidth === 768 || Ti.Platform.model.indexOf('iPad') > -1 ? true : false,
  platformWidth: Ti.Platform.displayCaps.platformWidth,
  platformHeight: Ti.Platform.displayCaps.platformHeight
};