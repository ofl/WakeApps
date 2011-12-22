exports =
  isIpad: if Ti.Platform.displayCaps.platformWidth is 768 or Ti.Platform.model.indexOf('iPad') > - 1 then true else false
  platformWidth: Ti.Platform.displayCaps.platformWidth
  platformHeight: Ti.Platform.displayCaps.platformHeight

