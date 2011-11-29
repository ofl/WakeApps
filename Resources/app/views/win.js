var createWindow;
createWindow = function(tab) {
  var $$, Schedule, addBtn, editBtn, editDoneBtn, fs, isiPad, mix, refresh, service, tableView, trace, window, _tableViewHandler;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  trace = app.helpers.util.trace;
  $$ = app.helpers.style.views.root;
  isiPad = app.properties.isiPad;
  service = null;
  addBtn = Ti.UI.createButton($$.addBtn);
  editBtn = Ti.UI.createButton($$.editBtn);
  editDoneBtn = Ti.UI.createButton($$.doneBtn);
  fs = Ti.UI.createButton($$.fs);
  window = Ti.UI.createWindow(mix($$.window, {
    toolbar: [editBtn, fs]
  }));
  tableView = Ti.UI.createTableView($$.tableView);
  window.setRightNavButton(addBtn);
  window.add(tableView);
  refresh = function(data) {
    var prettyDate, repeat, row, rows, saved, schedule, schedules, _i, _j, _len, _len2;
    if (data && data.saved) {
      Ti.App.iOS.cancelAllLocalNotifications();
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
    }
    schedules = Schedule.all();
    rows = [];
    prettyDate = app.helpers.util.prettyDate(new Date());
    for (_j = 0, _len2 = schedules.length; _j < _len2; _j++) {
      schedule = schedules[_j];
      row = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
        id: schedule.id,
        text: schedule.text
      }));
      row.add(Ti.UI.createLabel(mix($$.titleLabel, {
        text: schedule.title
      })));
      row.add(Ti.UI.createLabel(mix($$.dateLabel, {
        text: prettyDate(schedule.updated)
      })));
      rows.push(row);
    }
    tableView.setData(rows);
    window.title = 'Schedules';
    saved = false;
  };
  _tableViewHandler = function(e) {
    var nextScheduleId, schedule;
    schedule = Schedule.findById(e.row.id);
    switch (e.type) {
      case 'click':
        if (isiPad) {
          Ti.App.fireEvent('root.closeMasterNavigationGroup');
        } else {
          app.views.edit.win.open(tab, schedule);
        }
        break;
      case 'delete':
        if (Ti.App.Properties.getInt('lastSchedule') === e.row.id) {
          nextScheduleId = null;
          schedule.del(function() {
            nextScheduleId = schedule.nextScheduleId();
          });
          Ti.App.fireEvent('root.updateWindow', {
            id: nextScheduleId
          });
          if (!nextScheduleId) {
            if (isiPad) {
              Ti.App.fireEvent('root.closeMasterNavigationGroup');
            } else {
              window.close();
            }
          }
        } else {
          schedule.del();
        }
    }
  };
  tableView.addEventListener('click', _tableViewHandler);
  tableView.addEventListener('delete', _tableViewHandler);
  addBtn.addEventListener('click', function(e) {
    var schedule;
    schedule = new Schedule('Open Google in Safari');
    if (isiPad) {
      window.close();
    } else {
      app.views.edit.win.open(tab, schedule);
    }
  });
  editBtn.addEventListener('click', function(e) {
    window.setRightNavButton(null);
    window.toolbar = [editDoneBtn, fs];
    tableView.editing = true;
    tableView.moving = true;
  });
  editDoneBtn.addEventListener('click', function(e) {
    window.setRightNavButton(addBtn);
    window.toolbar = [editBtn, fs];
    tableView.editing = false;
    tableView.moving = false;
  });
  Ti.App.iOS.addEventListener('notification', function(e) {
    return Ti.Platform.openURL(e.userInfo.scheme);
  });
  window.refresh = refresh;
  return window;
};
exports.win = {
  open: function() {
    var Schedule, detailNavigationGroup, detailView, id, masterNavigationGroup, schedule, splitwin, tab, trace, window;
    trace = app.helpers.util.trace;
    if (app.properties.isiPad) {
      window = createWindow();
      window.refresh();
      Schedule = app.models.Schedule;
      id = Ti.App.Properties.getInt('lastSchedule');
      schedule = null;
      if (id) {
        schedule = Schedule.findById(id);
      }
      if (schedule === null) {
        schedule = new Schedule('Open Google in Safari');
      }
      detailView = app.views.edit.win.createWindow();
      detailView.refresh(schedule);
      detailNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
        window: detailView
      });
      masterNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
        window: window
      });
      splitwin = Ti.UI.iPad.createSplitWindow({
        showMasterInPortrait: true,
        detailView: detailNavigationGroup,
        masterView: masterNavigationGroup
      });
      splitwin.open();
    } else {
      tab = Ti.UI.createTab();
      tab.window = createWindow(tab);
      app.views.windowStack.push(tab.window);
      tab.window.refresh();
      Ti.UI.createTabGroup({
        tabs: [tab]
      }).open();
    }
  }
};