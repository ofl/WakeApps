var dateformat, exports, months, week;
dateformat = function(format, date) {
  var d, dateFormat;
  if (date == null) {
    date = null;
  }
  dateFormat = new app.lib.DateFormat(format);
  d = date === null ? new Date() : date;
  return dateFormat.format(d);
};
week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
exports = {
  trace: function(message) {
    Ti.API.info(message);
    Ti.API.info("Available memory: " + Ti.Platform.availableMemory);
  },
  mix: function() {
    var arg, child, prop, _i, _len;
    child = {};
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      for (prop in arg) {
        if (arg.hasOwnProperty(prop)) {
          child[prop] = arg[prop];
        }
      }
    }
    return child;
  },
  dateToString: function(date) {
    var m, text;
    text = '' + date.getFullYear() + '/';
    m = date.getMonth() + 1;
    text += (m > 9 ? m : '0' + m) + '/';
    text += (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + ' ';
    text += (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':';
    text += (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
    return text;
  },
  timesToGo: function(date, repeat, active) {
    var d, days, milliSec, month, newDate, now, nowGetTime, year;
    now = new Date();
    nowGetTime = now.getTime();
    d = date.getTime();
    milliSec = active > 0 ? d - nowGetTime : -1;
    if (milliSec < 0 && repeat > 0) {
      if (repeat === 1) {
        milliSec = (date.getHours() - now.getHours()) * 3600000 + (date.getMinutes() - now.getMinutes()) * 60000;
        if (milliSec < 0) {
          milliSec = 86400000 + milliSec;
        }
      }
      if (repeat === 2) {
        days = (date.getDay() - now.getDay()) * 86400000;
        if (days < 0) {
          milliSec = 604800000 + days;
        }
      }
      if (repeat === 3) {
        month = now.getMonths();
        year = now.getFullYear();
        if (month < 11) {
          month += 1;
        } else {
          month = 0;
          year += 1;
        }
        newDate = new Date(year, month, date.getDate(), date.getHours(), date.getMinutes(), 0);
        if (newDate.getMonths() !== month) {
          newDate = new Date(year, month + 1, date.getDate(), date.getHours(), date.getMinutes(), 0);
        }
        milliSec = newDate.getTime() - nowGetTime;
      }
      if (repeat === 4) {
        month = date.getMonths();
        year = now.getFullYear() + 1;
        newDate = new Date(year, month, date.getDate(), date.getHours(), date.getMinutes(), 0);
        if (newDate.getMonths() !== month) {
          newDate = new Date(year, month + 1, date.getDate(), date.getHours(), date.getMinutes(), 0);
        }
        milliSec = newDate.getTime() - nowGetTime;
      }
    }
    return milliSec;
  },
  prettyDate: function(date, repeat) {
    var d, text;
    text = (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':';
    text += (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
    if (repeat === 1) {
      text += ' every Day';
    } else if (repeat === 2) {
      text += ' on every ' + week[date.getDay()];
    } else {
      d = date.getDate();
      if (date.getDate() === 1) {
        d += 'st';
      } else if (date.getDate() === 2) {
        d += 'nd';
      } else if (date.getDate() === 3) {
        d += 'rd';
      } else {
        d += 'th';
      }
      if (repeat === 3) {
        text += ' on ' + d + ' every Month';
      }
      if (repeat === 4) {
        text += ' on ' + d + ' every ' + months[date.getMonth()];
      }
    }
    return text;
  },
  dateformat: dateformat
};