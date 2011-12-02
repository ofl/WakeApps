do ()->
  Ti.API.info 'kita'
  Ti.App.iOS.cancelAllLocalNotifications()
  Schedule = (require 'app/models/Schedule').Schedule
  schedules = Schedule.findAllActive()
  for schedule in schedules
    if schedule.options.repeat > 0
      repeat = ['None', 'daily', 'weekly', 'monthly', 'yearly'][schedule.options.repeat]
      Ti.App.iOS.scheduleLocalNotification
        date: new Date(schedule.options.date)
        repeat: repeat
        alertBody: schedule.title
        alertAction: 'Launch!'
        sound: 'sounds/Alarm0014.wav'
        userInfo: {scheme: schedule.options.scheme}
    else
      Ti.App.iOS.scheduleLocalNotification
        date: new Date(schedule.options.date)
        alertBody: schedule.title
        alertAction: 'Launch!'
        sound: 'sounds/Alarm0014.wav'
        userInfo: {scheme: schedule.options.scheme}
  
  Ti.App.currentService.stop()