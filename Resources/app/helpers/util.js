var dateformat, escapeHTML, exports;
dateformat = function(format, date) {
  var d, dateFormat;
  if (date == null) {
    date = null;
  }
  dateFormat = new app.lib.DateFormat(format);
  d = date === null ? new Date() : date;
  return dateFormat.format(d);
};
escapeHTML = function(string) {
  return string.replace(/[&<>\n]/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\n": "<br>"
    }[m];
  });
};
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
  escapeHTML: escapeHTML,
  toHTML: function(template, data) {
    var arg, arr, choice, choices, html, itype, key, keys, remain, size, text, value, _i, _j, _len, _len2;
    if (template == null) {
      template = '';
    }
    html = '';
    keys = template.match(/<@.+?>/g);
    if (keys && keys.length > 0) {
      remain = template.split(/<@.+?>/);
      for (_i = 0, _len = remain.length; _i < _len; _i++) {
        text = remain[_i];
        html += escapeHTML(text);
        if (_i < _len - 1) {
          arr = keys[_i].slice(2, -1).split(':');
          key = arr.shift();
          arg = arr.join(':');
          value = data[key] || '';
          itype = key.split('_')[0].toLowerCase();
          size = '';
          if (itype === 'select') {
            choices = arg.split(',');
            if (choices.length > 0) {
              html += "<select name='" + key + "'>";
              for (_j = 0, _len2 = choices.length; _j < _len2; _j++) {
                choice = choices[_j];
                if (choice === value) {
                  html += "<option value='" + choice + "' selected>" + choice + "</option>";
                } else {
                  html += "<option value='" + choice + "'>" + choice + "</option>";
                }
              }
              html += "</select>";
            }
          } else if (itype === 'textarea') {
            if (arg.match(/(\d+):(\d+)/)) {
              size = ' cols=' + RegExp.$1 + ' rows=' + RegExp.$2;
            }
            html += "<textarea name='" + key + "' " + size + ">" + value + "</textarea>";
          } else {
            if (arg.match(/(\d+)/)) {
              size = ' size=' + arg;
            }
            html += "<input type='" + itype + "' name='" + key + "' value='" + value + "' " + size + ">";
          }
        }
      }
    } else {
      html += escapeHTML(template);
    }
    return html;
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
  prettyDate: function(now) {
    var cday, cmonth, cyear, deltaToday, timeNow, week;
    timeNow = now.getTime();
    cyear = now.getFullYear();
    cmonth = now.getMonth();
    cday = now.getDate();
    deltaToday = parseInt((timeNow - (new Date(cyear, cmonth, cday)).getTime()) / 1000, 10);
    week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return function(date) {
      var d, day, dayOfWeek, delta, month, result, year;
      delta = parseInt((timeNow - date) / 1000, 10);
      d = new Date();
      d.setTime(date);
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
      dayOfWeek = d.getDay();
      result = '';
      if (delta < deltaToday) {
        result = 'Today';
      } else if (delta < deltaToday + 86400) {
        result = 'Yesterday';
      } else if (delta < deltaToday + 518400) {
        result = week[dayOfWeek];
      } else if (date < (new Date(cyear, 0, 1)).getTime()) {
        result = year + '/' + month + '/' + day;
      } else {
        result = month + '/' + day;
      }
      return result;
    };
  },
  dateformat: dateformat,
  convert: function(data, template) {
    var cache, key, keys, remain, result, text, _i, _len, _results;
    result = "";
    cache = {};
    keys = template.match(/<@.+?>/g);
    if (keys && keys.length > 0) {
      remain = template.split(/<@.+?>/);
      _results = [];
      for (_i = 0, _len = remain.length; _i < _len; _i++) {
        text = remain[_i];
        result += text;
        _results.push(_i < _len - 1 ? (key = keys[_i].substring(2, keys[_i].length - 1).toLowerCase(), typeof cache[key] === 'undefined' ? cache[key] = data[key] : void 0, result += cache[key]) : void 0);
      }
      return _results;
    } else {
      return result = template;
    }
  }
};