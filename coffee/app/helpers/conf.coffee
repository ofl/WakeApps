do ->
  
  app.properties.isiPad = if Ti.Platform.displayCaps.platformWidth is 768 then true else false
  app.properties.isPortrait = true
  app.properties.repeats = [
    'None', 
    'Every Day', 
    'Sunday', 
    'Monday', 
    'Tuesday', 
    'Wendsday', 
    'Thurthday', 
    'Friday', 
    'Saturday'
    'Monthly'
    ]

exports = {}

