exports.conf =
  isIpad: if Ti.Platform.displayCaps.platformWidth is 768 or Ti.Platform.model.indexOf('iPad') > - 1 then true else false
  repeats: [
    L('conf.none'), 
    L('conf.daily'), 
    L('conf.weekly'), 
    L('conf.monthly'), 
    L('conf.yearly') 
    ]

