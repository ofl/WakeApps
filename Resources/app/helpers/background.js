(function() {
  var Schedule, now, options, schedule, schedules, _i, _len;
  Ti.API.info('Launched Background Serivice');
  Ti.App.iOS.cancelAllLocalNotifications();
  Schedule = (require('app/models/Schedule')).Schedule;
  schedules = Schedule.findAllActive();
  now = (new Date()).getTime();
  for (_i = 0, _len = schedules.length; _i < _len; _i++) {
    schedule = schedules[_i];
    if (schedule.repeat > 0 || schedule.date > now) {
      options = {
        date: new Date(schedule.date),
        repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat],
        alertBody: schedule.title,
        alertAction: 'Launch!',
        userInfo: {
          scheme: schedule.scheme,
          title: schedule.title,
          date: schedule.date,
          id: schedule.id
        }
      };
      if (schedule.sound > 0) {
        options.sound = 'default';
      }
      Ti.App.iOS.scheduleLocalNotification(options);
    }
  }
  Ti.App.currentService.stop();
})();