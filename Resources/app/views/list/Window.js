var $$, Schedule, Window, dateToString, isIpad, mix, prettyDate, timesToGo, trace, util;
$$ = (require('app/views/list/style')).style;
util = require('app/helpers/util');
trace = util.trace;
mix = util.mix;
prettyDate = util.prettyDate;
dateToString = util.dateToString;
timesToGo = util.timesToGo;
isIpad = (require('app/helpers/conf')).isIpad;
Schedule = require('app/models/Schedule');
Window = (function() {
  function Window(app) {
    var addBtn, confirm, doneEditBtn, editBtn, fs, refresh, refreshBtn, service, showMessage, tableView, updateLabel, window, _registBackgroundService, _tableViewHandler;
    service = null;
    addBtn = Ti.UI.createButton($$.addBtn);
    editBtn = Ti.UI.createButton($$.editBtn);
    doneEditBtn = Ti.UI.createButton($$.doneBtn);
    refreshBtn = Ti.UI.createButton($$.refreshBtn);
    updateLabel = Ti.UI.createLabel($$.updateLabel);
    fs = Ti.UI.createButton($$.fs);
    window = Ti.UI.createWindow(mix($$.window, {
      title: 'WakeApps',
      toolbar: [editBtn, fs, updateLabel, fs, refreshBtn],
      rightNavButton: addBtn
    }));
    tableView = Ti.UI.createTableView($$.tableView);
    window.add(tableView);
    refresh = function() {
      var date, dateString, icon, remain, row, rows, schedule, schedules, ttg, _i, _len;
      schedules = Schedule.all();
      rows = [];
      for (_i = 0, _len = schedules.length; _i < _len; _i++) {
        schedule = schedules[_i];
        date = new Date(schedule.date);
        ttg = timesToGo(date, schedule.repeat, schedule.active);
        remain = ' (';
        if (ttg < 0) {
          remain += '--';
          icon = $$.silverclock;
        } else if (ttg < 3600000) {
          remain += '+' + Math.floor(ttg / 60000) + 'm';
          icon = $$.redclock;
        } else if (ttg < 86400000) {
          remain += '+' + Math.floor(ttg / 3600000) + 'h';
          icon = $$.yellowclock;
        } else {
          remain += '+' + Math.floor(ttg / 86400000) + 'D';
          icon = $$.aquaclock;
        }
        remain += ')';
        row = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
          id: schedule.id,
          text: schedule.text
        }));
        row.add(Ti.UI.createImageView(mix($$.imageView, {
          image: icon
        })));
        row.add(Ti.UI.createLabel(mix($$.titleLabel, {
          text: schedule.title
        })));
        if (schedule.repeat > 0) {
          dateString = prettyDate(date, schedule.repeat) + remain;
          row.add(Ti.UI.createImageView($$.repeatImageView));
          row.add(Ti.UI.createLabel(mix($$.dateLabel, {
            text: dateString
          })));
        } else {
          dateString = dateToString(date) + remain;
          row.add(Ti.UI.createLabel(mix($$.dateLabel, {
            left: 44,
            text: dateString
          })));
        }
        rows.push(row);
      }
      tableView.setData(rows);
      updateLabel.text = L('root.lastUpdate') + dateToString(new Date());
    };
    confirm = function(data) {
      var dialog;
      dialog = Ti.UI.createAlertDialog({
        title: L('root.confirm'),
        buttonNames: [L('root.save'), L('root.cancel')]
      });
      dialog.addEventListener('click', function(e) {
        if (e.index === 0) {
          data.save();
          refresh();
        }
      });
      dialog.show();
    };
    showMessage = function(message) {
      var messageWindow, props;
      messageWindow = Ti.UI.createWindow($$.messageWindow);
      messageWindow.add(Ti.UI.createView($$.messageView));
      messageWindow.add(Ti.UI.createLabel(mix($$.messageLabel, {
        text: message
      })));
      messageWindow.open();
      if (Ti.Platform.osname === "iPhone OS") {
        props = mix($$.messageAnimation, {
          transform: Ti.UI.create2DMatrix().translate(-200, 200).scale(0)
        });
      } else {
        props = $$.messageAnimation;
      }
      messageWindow.animate(props, function() {
        messageWindow.close();
      });
    };
    _registBackgroundService = function() {
      if (service !== null) {
        service.unregister();
      }
      service = Ti.App.iOS.registerBackgroundService({
        url: 'app/helpers/background.js'
      });
    };
    _tableViewHandler = function(e) {
      var isDeleteCurrentSchedule, newSchedule, schedule;
      schedule = Schedule.findById(e.row.id);
      switch (e.type) {
        case 'click':
          if (isIpad) {
            app.views.windowStack[1].confirm(schedule);
          } else {
            (new (require('app/views/list/edit/Window')).Window(app)).open(schedule);
          }
          break;
        case 'delete':
          isDeleteCurrentSchedule = e.row.id === Ti.App.Properties.getInt('lastSchedule') ? true : false;
          schedule.del();
          showMessage(L('root.deleted'));
          if (isIpad && isDeleteCurrentSchedule) {
            newSchedule = Schedule.findLastUpdated();
            if (newSchedule === null) {
              newSchedule = new Schedule(L('root.newschedule'));
            }
            app.views.windowStack[1].refresh(newSchedule);
          }
      }
    };
    tableView.addEventListener('click', _tableViewHandler);
    tableView.addEventListener('delete', _tableViewHandler);
    addBtn.addEventListener('click', function(e) {
      var schedule;
      schedule = new Schedule(L('root.newschedule'));
      showMessage(L('root.newschedule'));
      if (isIpad) {
        app.views.windowStack[1].refresh(schedule);
      } else {
        (new (require('app/views/list/edit/Window')).Window(app)).open(schedule);
      }
    });
    editBtn.addEventListener('click', function(e) {
      window.setRightNavButton(null);
      window.toolbar = [doneEditBtn, fs];
      tableView.editing = true;
      tableView.moving = true;
    });
    doneEditBtn.addEventListener('click', function(e) {
      window.setRightNavButton(addBtn);
      window.toolbar = [editBtn, fs, refreshBtn];
      tableView.editing = false;
      tableView.moving = false;
    });
    refreshBtn.addEventListener('click', function(e) {
      refresh();
      showMessage(L('root.refreshed'));
    });
    Ti.App.iOS.addEventListener('notification', function(e) {
      trace('Fired From Notification');
      _registBackgroundService();
      if (e.userInfo.scheme !== '') {
        Ti.Platform.openURL(e.userInfo.scheme);
      }
    });
    window.addEventListener('open', _registBackgroundService);
    Ti.App.addEventListener('resume', _registBackgroundService);
    this.window = window;
    this.refresh = refresh;
    this.confirm = confirm;
    this.showMessage = showMessage;
  }
  return Window;
})();
exports.Window = Window;