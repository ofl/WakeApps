(function() {
  var Schedule, schedules, _setNotifications;
  Ti.API.info('kita');
  Ti.App.iOS.cancelAllLocalNotifications();
  Schedule = (require('app/models/Schedule')).Schedule;
  schedules = Schedule.findAllActive();
  _setNotifications = function() {
    var d, ima, now, schedule, _i, _len;
    now = (new Date()).getTime() - 60000;
    ima = (new Date()).toLocaleString();
    for (_i = 0, _len = schedules.length; _i < _len; _i++) {
      schedule = schedules[_i];
      d = (new Date(schedule.date)).toLocaleString();
      if (schedule.repeat > 0) {
        Ti.API.info('Set repeat schedule' + d);
        Ti.App.iOS.scheduleLocalNotification({
          date: new Date(schedule.date),
          repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat],
          alertBody: schedule.title + ima,
          alertAction: 'Launch!',
          sound: 'sounds/Alarm0014.wav',
          userInfo: {
            scheme: schedule.scheme,
            title: schedule.title,
            date: schedule.date
          }
        });
      } else if (schedule.date > now) {
        Ti.API.info('Set one time schedule' + d);
        Ti.App.iOS.scheduleLocalNotification({
          date: new Date(schedule.date),
          alertBody: schedule.title + ima,
          alertAction: 'Launch!',
          sound: 'sounds/Alarm0014.wav',
          userInfo: {
            scheme: schedule.scheme,
            title: schedule.title,
            date: schedule.date
          }
        });
      }
    }
  };
  setTimeout(_setNotifications, 1000);
})();