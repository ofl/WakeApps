(function() {
  var Schedule, repeat, schedule, schedules, _i, _len;
  Ti.API.info('kita');
  Ti.App.iOS.cancelAllLocalNotifications();
  Schedule = (require('app/models/Schedule')).Schedule;
  schedules = Schedule.findAllActive();
  for (_i = 0, _len = schedules.length; _i < _len; _i++) {
    schedule = schedules[_i];
    if (schedule.options.repeat > 0) {
      repeat = ['None', 'daily', 'weekly', 'monthly', 'yearly'][schedule.options.repeat];
      Ti.App.iOS.scheduleLocalNotification({
        date: new Date(schedule.options.date),
        repeat: repeat,
        alertBody: schedule.title,
        alertAction: 'Launch!',
        sound: 'sounds/Alarm0014.wav',
        userInfo: {
          scheme: schedule.options.scheme
        }
      });
    } else {
      Ti.App.iOS.scheduleLocalNotification({
        date: new Date(schedule.options.date),
        alertBody: schedule.title,
        alertAction: 'Launch!',
        sound: 'sounds/Alarm0014.wav',
        userInfo: {
          scheme: schedule.options.scheme
        }
      });
    }
  }
  return Ti.App.currentService.stop();
})();