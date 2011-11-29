do ->
  
  app.properties.isiPad = if Ti.Platform.displayCaps.platformWidth is 768 then true else false
  app.properties.isPortrait = true
  app.properties.repeats = [
    'None', 
    'Daily', 
    'Weekly', 
    'Monthly', 
    'Yearly'
    ]

exports = {}

