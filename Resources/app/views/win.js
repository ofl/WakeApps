var createWindow;
createWindow = function(tab) {
  var $$, Schedule, addBtn, confirm, doneEditBtn, editBtn, fs, isiPad, lastSceduledAt, mix, refresh, service, showMessage, tableView, trace, window, _setNotifications, _tableViewHandler;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  trace = app.helpers.util.trace;
  $$ = app.helpers.style.views.root;
  isiPad = app.properties.isiPad;
  lastSceduledAt = null;
  service = null;
  addBtn = Ti.UI.createButton($$.addBtn);
  editBtn = Ti.UI.createButton($$.editBtn);
  doneEditBtn = Ti.UI.createButton($$.doneBtn);
  fs = Ti.UI.createButton($$.fs);
  window = Ti.UI.createWindow(mix($$.window, {
    toolbar: [editBtn, fs]
  }));
  tableView = Ti.UI.createTableView($$.tableView);
  window.setRightNavButton(addBtn);
  window.add(tableView);
  refresh = function(data) {
    var prettyDate, row, rows, schedule, schedules, _i, _len;
    if (arguments.length > 0) {
      data.save();
      if (service !== null) {
        service.unregister();
      }
      service = Ti.App.iOS.registerBackgroundService({
        url: 'app/lib/background.js'
      });
    }
    schedules = Schedule.all();
    rows = [];
    prettyDate = app.helpers.util.prettyDate(new Date());
    for (_i = 0, _len = schedules.length; _i < _len; _i++) {
      schedule = schedules[_i];
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
  };
  confirm = function(data) {
    var dialog;
    dialog = Ti.UI.createAlertDialog({
      title: 'Your changes have not been saved. Discard changes?',
      buttonNames: ['Save changes', 'Cancel']
    });
    dialog.addEventListener('click', function(e) {
      if (e.index === 0) {
        refresh(data);
      }
    });
    dialog.show();
  };
  _setNotifications = function() {
    var ima, now, schedule, schedules, _i, _len;
    schedules = Schedule.findAllActive();
    now = (new Date()).getTime() - 60000;
    ima = (new Date()).toLocaleString();
    for (_i = 0, _len = schedules.length; _i < _len; _i++) {
      schedule = schedules[_i];
      if (schedule.repeat > 0) {
        trace('Scheduled repeat event');
        Ti.App.iOS.scheduleLocalNotification({
          date: new Date(schedule.date),
          repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.oepeat],
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
        trace('Scheduled One time event');
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
    showMessage();
  };
  showMessage = function() {
    var messageWindow, props;
    messageWindow = Ti.UI.createWindow($$.messageWindow);
    messageWindow.add(Ti.UI.createView($$.messageView));
    messageWindow.add(Ti.UI.createLabel($$.messageLabel));
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
    window.toolbar = [doneEditBtn, fs];
    tableView.editing = true;
    tableView.moving = true;
  });
  doneEditBtn.addEventListener('click', function(e) {
    window.setRightNavButton(addBtn);
    window.toolbar = [editBtn, fs];
    tableView.editing = false;
    tableView.moving = false;
  });
  Ti.App.iOS.addEventListener('notification', function(e) {
    trace('fire notification');
    Ti.Platform.openURL(e.userInfo.scheme);
  });
  window.addEventListener('open', function(e) {
    app.properties.isActive = true;
  });
  Ti.App.addEventListener('pause', function(e) {
    var date;
    date = (new Date()).toLocaleString();
    trace('paused' + date);
    app.properties.isActive = false;
  });
  Ti.App.addEventListener('resume', function(e) {
    var date;
    date = (new Date()).toLocaleString();
    trace('resumed' + date);
    app.properties.isActive = true;
  });
  window.refresh = refresh;
  window.confirm = confirm;
  window.showMessage = showMessage;
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