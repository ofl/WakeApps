do ()->
  Ti.API.info 'kita'
  # Ti.App.iOS.cancelAllLocalNotifications()
  
  Schedule = (require 'app/models/Schedule').Schedule
  schedules = Schedule.findAllActive()
  
  rand = Math.floor(Math.random()*100000)
  now = (new Date()).getTime() - 60000
  ima = (new Date()).toLocaleString()
  for schedule in schedules
    # Ti.App.iOS.cancelLocalNotification {userInfo:{'id': schedule.id}}
    d = (new Date(schedule.date)).toLocaleString()
    Ti.API.info 'Set repeat schedule'  + d
    Ti.API.info rand
    Ti.API.info schedule.title 
    Ti.App.iOS.scheduleLocalNotification
      date: new Date(schedule.date)
      repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat]
      alertBody: schedule.title + ima
      alertAction: 'Launch!'
      sound: 'sounds/Alarm0014.wav'
      userInfo: 
        scheme: schedule.scheme
        title: schedule.title
        date: schedule.date
        'id': schedule.id +  rand

  
  # rand = Math.floor(Math.random()*100000)
#   
  # _setNotifications = ()->
    # now = (new Date()).getTime() - 60000
    # ima = (new Date()).toLocaleString()
    # for schedule in schedules
      # # Ti.App.iOS.cancelLocalNotification {userInfo:{'id': schedule.id}}
      # d = (new Date(schedule.date)).toLocaleString()
      # Ti.API.info 'Set repeat schedule'  + d
      # Ti.API.info rand
      # Ti.API.info schedule.title 
      # Ti.App.iOS.scheduleLocalNotification
        # date: new Date(schedule.date)
        # repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat]
        # alertBody: schedule.title + ima
        # alertAction: 'Launch!'
        # sound: 'sounds/Alarm0014.wav'
        # userInfo: 
          # scheme: schedule.scheme
          # title: schedule.title
          # date: schedule.date
          # 'id': schedule.id +  rand
          
      # if schedule.repeat > 0 or schedule.date > now
        # Ti.API.info 'Set repeat schedule'  + d
        # Ti.API.info schedule.id
        # Ti.App.iOS.scheduleLocalNotification
          # date: new Date(schedule.date)
          # repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat]
          # alertBody: schedule.title + ima
          # alertAction: 'Launch!'
          # sound: 'sounds/Alarm0014.wav'
          # userInfo: 
            # scheme: schedule.scheme
            # title: schedule.title
            # date: schedule.date
            # 'id': schedule.id +  rand
            
    # Ti.App.currentService.stop()
    # return
  
  # setTimeout _setNotifications, 1000
  # setTimeout '_setNotifications()', 1000
  
  
  
  Ti.App.currentService.stop()

  return