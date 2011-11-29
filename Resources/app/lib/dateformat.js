/*
--------------------------------------------------------
dateformat.js - Simple date formatter
Version 1.1 (Update 2008/04/02)

Copyright (c) 2007-2008 onozaty (http://www.enjoyxstudy.com)

Released under an MIT-style license.

For details, see the web site:
 http://www.enjoyxstudy.com/javascript/dateformat/

--------------------------------------------------------
*/
var exports;
var DateFormat = function(pattern) {
  this._init(pattern);
};

DateFormat.prototype = {
  _init: function(pattern) {

    this.pattern = pattern;
    this._patterns = [];

    var i, len;
    for (i = 0, len = pattern.length; i < len; i++){
      var ch = pattern.charAt(i);
      if (this._patterns.length == 0) {
        this._patterns[0] = ch;
      } else {
        var index = this._patterns.length - 1;
        if (this._patterns[index].charAt(0) == "'") {
          if (this._patterns[index].length == 1 || this._patterns[index].charAt(this._patterns[index].length - 1) != "'") {
            this._patterns[index] += ch;
          } else {
            this._patterns[index + 1] = ch;
          }
        } else if (this._patterns[index].charAt(0) == ch) {
          this._patterns[index] += ch;
        } else {
          this._patterns[index + 1] = ch;
        }
      }
    }
  },

  format: function(date) {

    var result = [];
    for (var i = 0; i < this._patterns.length; i++) {
      result[i] = this._formatWord(date, this._patterns[i]);
    }
    return result.join('');
  },
  _formatWord: function(date, pattern) {

    var formatter = this._formatter[pattern.charAt(0)];
    if (formatter) {
      return formatter.apply(this, [date, pattern]);
    } else {
      return pattern;
    }
  },
  _formatter: {
    "y": function(date, pattern) {
      // Year
      var year = String(date.getFullYear());
      if (pattern.length <= 2) {
        year = year.substring(2, 4);
      } else {
        year = this._zeroPadding(year, pattern.length);
      }
      return year;
    },
    "M": function(date, pattern) {
      // Month in year
      if (pattern.length < 3){
          return this._zeroPadding(String(date.getMonth() + 1), pattern.length);
      }else{
          var k = 'MMMMMM'.substring(-1,pattern.length);
          return Ti.App.Properties.getList(k)[date.getMonth()];
      }
    },
    "d": function(date, pattern) {
      // Day in month
      return this._zeroPadding(String(date.getDate()), pattern.length);
    },
    "H": function(date, pattern) {
      // Hour in day (0-23)
      return this._zeroPadding(String(date.getHours()), pattern.length);
    },
    "h": function(date, pattern) {
      // Hour in day (0-12)
      return this._zeroPadding(String(date.getHours() % 12), pattern.length);
    },
    "m": function(date, pattern) {
      // Minute in hour
      return this._zeroPadding(String(date.getMinutes()), pattern.length);
    },
    "s": function(date, pattern) {
      // Second in minute
      return this._zeroPadding(String(date.getSeconds()), pattern.length);
    },
    "S": function(date, pattern) {
      // Millisecond
      return this._zeroPadding(String(date.getMilliseconds()), pattern.length);
    },
    "a": function(date, pattern) {
      // Millisecond
      var k = 'aa'.substring(-1,pattern.length);
      var a = Ti.App.Properties.getList(k);
      return date.getHours() < 12 ? a[0] : a[1];
    },
    "w": function(date, pattern) {
      // Month in year
      if (pattern.length < 3){
          return this._zeroPadding(String(date.getDay()), pattern.length);
      }else{
          var k = 'wwww'.substring(-1,pattern.length);
          return Ti.App.Properties.getList(k)[date.getDay()];
      }
    },
    "W": function(date, pattern) {
      // Millisecond
          var k = 'WWWW'.substring(-1,pattern.length);
          return Ti.App.Properties.getList(k)[date.getDay()];
    },
    "'": function(date, pattern) {
      // escape
      if (pattern == "''") {
        return "'";
      } else {
        return pattern.replace(/'/g, '');
      }
    }
  },

  _zeroPadding: function(str, length) {
    if (str.length >= length) {
      return str;
    }

    return new Array(length - str.length + 1).join("0") + str;
  }
};
//--------------------------------------------------------

exports.DateFormat = DateFormat;

//if(true){
//    (function(){
//        var f = "MMMM dd,yyyy HH:mm:ss";
//        var dateFormat = new DateFormat(f);
//        var minDate = new Date(2000, 0, 1);
//        var maxDate = new Date(2020, 11, 31);
//        Ti.App.Properties.setString('minDate', dateFormat.format(minDate));
//        Ti.App.Properties.setString('maxDate', dateFormat.format(maxDate));
//    })();
//}
