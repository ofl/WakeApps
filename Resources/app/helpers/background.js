(function() {
  var Schedule, now, schedule, schedules, _i, _len;
  Ti.API.info('Launched Background Serivice');
  Ti.App.iOS.cancelAllLocalNotifications();
  Schedule = (require('app/models/Schedule')).Schedule;
  schedules = Schedule.findAllActive();
  now = (new Date()).getTime();
  for (_i = 0, _len = schedules.length; _i < _len; _i++) {
    schedule = schedules[_i];
    if (schedule.repeat > 0 || schedule.date > now) {
      Ti.App.iOS.scheduleLocalNotification({
        date: new Date(schedule.date),
        repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat],
        alertBody: schedule.title,
        alertAction: 'Launch!',
        sound: ['sounds/Alarm0014.wav', 'default', 'none'][schedule.sound],
        userInfo: {
          scheme: schedule.scheme,
          title: schedule.title,
          date: schedule.date,
          id: schedule.id
        }
      });
    }
  }
  Ti.App.currentService.stop();
})();