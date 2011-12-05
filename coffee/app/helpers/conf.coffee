do ->
  
  app.properties.isIpad = if Ti.Platform.displayCaps.platformWidth is 768 then true else false
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

