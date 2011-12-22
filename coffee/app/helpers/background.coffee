do ()->
  Ti.API.info 'Launched Background Serivice'
  Ti.App.iOS.cancelAllLocalNotifications()
  
  Schedule = (require 'app/models/Schedule').Schedule
  schedules = Schedule.findAllActive()
  
  now = (new Date()).getTime()
  for schedule in schedules
    if schedule.repeat > 0 or schedule.date > now
    # Ti.App.iOS.cancelLocalNotification {userInfo:{'id': schedule.id}}
      options = 
        date: new Date(schedule.date)
        repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat]
        alertBody: schedule.title
        alertAction: 'Launch!'
        userInfo: 
          scheme: schedule.scheme
          title: schedule.title
          date: schedule.date
          id: schedule.id    
      if schedule.sound < 1
        options.sound = 'default'
      Ti.App.iOS.scheduleLocalNotification options

  Ti.App.currentService.stop()
  return