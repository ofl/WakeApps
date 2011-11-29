var createWindow;
createWindow = function() {
  var $$, Schedule, addBtn, doneBtn, editBtn, editDoneBtn, fs, isiPad, mix, refresh, tableView, trace, window, _tableViewHandler;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  trace = app.helpers.util.trace;
  $$ = app.helpers.style.views.root;
  isiPad = app.properties.isiPad;
  addBtn = Ti.UI.createButton($$.addBtn);
  editBtn = Ti.UI.createButton($$.editBtn);
  editDoneBtn = Ti.UI.createButton($$.doneBtn);
  fs = Ti.UI.createButton($$.fs);
  window = Ti.UI.createWindow(mix($$.window, {
    toolbar: [editBtn, fs]
  }));
  tableView = Ti.UI.createTableView($$.tableView);
  window.setRightNavButton(addBtn);
  if (!isiPad) {
    doneBtn = Ti.UI.createButton($$.doneBtn);
    window.setLeftNavButton(doneBtn);
  }
  window.add(tableView);
  refresh = function() {
    var prettyDate, row, rows, schedule, schedules, _i, _len;
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
    window.title = 'Templates';
  };
  _tableViewHandler = function(e) {
    var data, nextScheduleId, schedule;
    switch (e.type) {
      case 'click':
        Ti.App.fireEvent('root.updateWindow', {
          id: e.row.id
        });
        if (isiPad) {
          Ti.App.fireEvent('root.closeMasterNavigationGroup');
        } else {
          window.close();
        }
        break;
      case 'delete':
        schedule = Schedule.findById(e.row.id);
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
        break;
      case 'move':
        data = Schedule.findById(e.row.id);
        data.move(e.index + 1);
    }
  };
  tableView.addEventListener('click', _tableViewHandler);
  tableView.addEventListener('delete', _tableViewHandler);
  tableView.addEventListener('move', _tableViewHandler);
  addBtn.addEventListener('click', function(e) {
    Ti.App.fireEvent('root.updateWindow', {
      id: null
    });
    if (!isiPad) {
      window.close();
    } else {
      Ti.App.fireEvent('root.closeMasterNavigationGroup');
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
  if (!isiPad) {
    doneBtn.addEventListener('click', function(e) {
      window.close();
    });
  }
  window.refresh = refresh;
  Ti.App.addEventListener('list.refresh', function(e) {
    return refresh();
  });
  return window;
};
exports.win = {
  open: function() {
    var Schedule, detailNavigationGroup, detailView, id, masterNavigationGroup, schedule, splitwin, tab, tabGroup, trace, window;
    trace = app.helpers.util.trace;
    window = createWindow();
    window.refresh();
    if (app.properties.isiPad) {
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
      tab = Ti.UI.createTab({
        window: window
      });
      tabGroup = Ti.UI.createTabGroup();
      tabGroup.addTab(tab);
      tabGroup.open();
    }
  }
};