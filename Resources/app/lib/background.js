(function() {
  var Schedule, d, ima, now, rand, schedule, schedules, _i, _len;
  Ti.API.info('kita');
  Schedule = (require('app/models/Schedule')).Schedule;
  schedules = Schedule.findAllActive();
  rand = Math.floor(Math.random() * 100000);
  now = (new Date()).getTime();
  ima = (new Date()).toLocaleString();
  for (_i = 0, _len = schedules.length; _i < _len; _i++) {
    schedule = schedules[_i];
    if (schedule.repeat > 0 || schedule.date > now) {
      d = (new Date(schedule.date)).toLocaleString();
      Ti.API.info('Set repeat schedule' + d);
      Ti.API.info(rand);
      Ti.API.info(schedule.title);
      Ti.App.iOS.scheduleLocalNotification({
        date: new Date(schedule.date),
        repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.repeat],
        alertBody: schedule.title + ima,
        alertAction: 'Launch!',
        sound: 'sounds/Alarm0014.wav',
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