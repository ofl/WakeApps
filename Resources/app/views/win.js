var createWindow;
createWindow = function(tab) {
  var $$, Schedule, addBtn, confirm, doneEditBtn, editBtn, fs, isIpad, mix, prettyDate, refresh, repeat, service, showMessage, tableView, trace, window, _tableViewHandler;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  trace = app.helpers.util.trace;
  $$ = app.helpers.style.views.root;
  isIpad = app.properties.isIpad;
  prettyDate = app.helpers.util.prettyDate;
  service = null;
  repeat = ['Day', 'Week', 'Month', 'Year'];
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
  refresh = function() {
    var date, dateString, row, rows, schedule, schedules, _i, _len;
    schedules = Schedule.all();
    rows = [];
    for (_i = 0, _len = schedules.length; _i < _len; _i++) {
      schedule = schedules[_i];
      date = new Date(schedule.date);
      if (schedule.repeat > 0) {
        trace('a');
        dateString = prettyDate(date, schedule.repeat);
      } else {
        trace('b');
        dateString = date.toLocaleString();
      }
      row = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
        id: schedule.id,
        text: schedule.text,
        leftImage: $$.grayclock
      }));
      row.add(Ti.UI.createLabel(mix($$.titleLabel, {
        text: schedule.title
      })));
      row.add(Ti.UI.createLabel(mix($$.dateLabel, {
        text: dateString
      })));
      rows.push(row);
    }
    tableView.setData(rows);
  };
  confirm = function(data) {
    var dialog;
    dialog = Ti.UI.createAlertDialog({
      title: 'Your changes have not been saved. Discard changes?',
      buttonNames: ['Save changes', 'Cancel']
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
  _tableViewHandler = function(e) {
    var isDeleteCurrentSchedule, newSchedule, schedule;
    schedule = Schedule.findById(e.row.id);
    switch (e.type) {
      case 'click':
        if (isIpad) {
          app.views.windowStack[1].confirm(schedule);
        } else {
          app.views.edit.win.open(tab, schedule);
        }
        break;
      case 'delete':
        isDeleteCurrentSchedule = e.row.id === Ti.App.Properties.getInt('lastSchedule') ? true : false;
        schedule.del();
        showMessage('The schedule was successfully deleted.');
        if (isIpad && isDeleteCurrentSchedule) {
          newSchedule = Schedule.findLastUpdated();
          if (newSchedule === null) {
            newSchedule = new Schedule('New Schedule');
          }
          app.views.windowStack[1].refresh(newSchedule);
        }
    }
  };
  tableView.addEventListener('click', _tableViewHandler);
  tableView.addEventListener('delete', _tableViewHandler);
  addBtn.addEventListener('click', function(e) {
    var schedule;
    schedule = new Schedule('New Schedule');
    showMessage('New schedule.');
    if (isIpad) {
      app.views.windowStack[1].refresh(schedule);
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
    trace('Fired From Notification');
    if (service !== null) {
      service.unregister();
    }
    service = Ti.App.iOS.registerBackgroundService({
      url: 'app/lib/background.js'
    });
    Ti.Platform.openURL(e.userInfo.scheme);
  });
  window.addEventListener('open', function(e) {
    if (service !== null) {
      service.unregister();
    }
    service = Ti.App.iOS.registerBackgroundService({
      url: 'app/lib/background.js'
    });
  });
  Ti.App.addEventListener('resume', function(e) {
    if (service !== null) {
      service.unregister();
    }
    service = Ti.App.iOS.registerBackgroundService({
      url: 'app/lib/background.js'
    });
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
    if (app.properties.isIpad) {
      Schedule = app.models.Schedule;
      id = Ti.App.Properties.getInt('lastSchedule');
      schedule = null;
      if (id) {
        schedule = Schedule.findById(id);
      }
      if (schedule === null) {
        schedule = new Schedule('New Schedule');
      }
      window = createWindow();
      app.views.windowStack.push(window);
      window.refresh();
      detailView = app.views.edit.win.createWindow();
      app.views.windowStack.push(detailView);
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