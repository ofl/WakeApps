do ->
  # Ti.App.Properties.getInt 'dbVersion'
  app.properties.isIpad = if Ti.Platform.displayCaps.platformWidth is 768 or Ti.Platform.model.indexOf('iPad') > - 1 then true else false
  app.properties.isPortrait = true
  app.properties.isActive = false
  app.properties.repeats = [
    'None', 
    'Daily', 
    'Weekly', 
    'Monthly', 
    'Yearly'
    ]

exports = {}

