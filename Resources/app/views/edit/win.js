var createWindow;
createWindow = function(tab) {
  var $$, Schedule, activeRow, activeSwitch, dateRow, dateToString, doneBtn, dtPicker, isOpenDtPicker, isOpenKeyborad, isOpenPicker, lastScheme, lastTitle, mix, picker, refresh, repeatRow, repeats, rows, schedule, schemeField, schemeRow, tableView, testRow, titleField, titleRow, trace, window;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  dateToString = app.helpers.util.dateToString;
  trace = app.helpers.util.trace;
  $$ = app.helpers.style.views.edit;
  repeats = app.properties.repeats;
  schedule = null;
  lastTitle = null;
  lastScheme = null;
  window = Ti.UI.createWindow($$.window);
  tableView = Ti.UI.createTableView(mix($$.tableView));
  window.add(tableView);
  isOpenKeyborad = false;
  isOpenPicker = false;
  isOpenDtPicker = false;
  doneBtn = Ti.UI.createButton($$.doneBtn);
  titleRow = Ti.UI.createTableViewRow($$.tableViewRow);
  titleField = Ti.UI.createTextField($$.textField);
  titleRow.add(titleField);
  activeRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    title: 'Active'
  }));
  activeSwitch = Ti.UI.createSwitch($$.switches);
  activeRow.add(activeSwitch);
  schemeRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'URL Scheme'
  }));
  schemeField = Ti.UI.createTextField($$.textField);
  schemeRow.add(schemeField);
  testRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    title: 'Test action',
    color: '#090',
    backgroundColor: '#ddc',
    hasChild: true
  }));
  dateRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Date',
    hasChild: true
  }));
  repeatRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Repeat',
    hasChild: true
  }));
  rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow];
  dtPicker = Ti.UI.createPicker($$.dtPicker);
  picker = Ti.UI.createPicker($$.picker);
  (function() {
    var choice, repeat, _i, _len;
    choice = [];
    for (_i = 0, _len = repeats.length; _i < _len; _i++) {
      repeat = repeats[_i];
      choice.push(Ti.UI.createPickerRow({
        title: repeat
      }));
    }
    return picker.add(choice);
  })();
  tableView.setData(rows);
  refresh = function(data) {
    schedule = data;
    activeSwitch.value = data.active ? true : false;
    window.title = data.title || 'Schedule';
    lastTitle = data.title;
    lastScheme = data.scheme;
    schemeField.value = data.scheme;
    titleField.value = data.title;
    dateRow.title = dateToString(new Date(data.date));
    repeatRow.title = repeats[data.repeat];
  };
  testRow.addEventListener('click', function() {
    Ti.Platform.openURL(schemeField.value);
  });
  dateRow.addEventListener('click', function() {
    window.setRightNavButton(doneBtn);
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    if (schedule.date === null) {
      dtPicker.value = new Date();
    } else {
      dtPicker.value = new Date(schedule.date);
    }
    window.add(dtPicker);
    isOpenDtPicker = true;
    tableView.height = 200;
  });
  repeatRow.addEventListener('click', function() {
    window.setRightNavButton(doneBtn);
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenDtPicker) {
      window.remove(dtPicker);
      isOpenDtPicker = false;
    }
    picker.setSelectedRow(0, schedule.repeat);
    window.add(picker);
    isOpenPicker = true;
    tableView.height = 200;
  });
  dtPicker.addEventListener('change', function(e) {
    var date;
    date = dateToString(e.value);
    dateRow.title = date;
    schedule.date = (new Date(date)).getTime();
    schedule.save();
  });
  picker.addEventListener('change', function(e) {
    repeatRow.title = repeats[e.rowIndex];
    schedule.repeat = e.rowIndex;
    schedule.save();
  });
  titleField.addEventListener('return', function() {
    schemeRow.fireEvent('click');
  });
  titleField.addEventListener('focus', function() {
    window.setRightNavButton(doneBtn);
    isOpenKeyborad = true;
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    if (isOpenDtPicker) {
      window.remove(dtPicker);
      isOpenDtPicker = false;
    }
  });
  schemeField.addEventListener('return', function() {
    dateRow.fireEvent('click');
  });
  schemeField.addEventListener('focus', function() {
    window.setRightNavButton(doneBtn);
    isOpenKeyborad = true;
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    if (isOpenDtPicker) {
      window.remove(dtPicker);
      isOpenDtPicker = false;
    }
  });
  doneBtn.addEventListener('click', function() {
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenDtPicker) {
      window.remove(dtPicker);
      isOpenDtPicker = false;
    }
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    tableView.height = 416;
    window.setRightNavButton(null);
  });
  activeSwitch.addEventListener('change', function(e) {
    if (e.value) {
      schedule.active = 1;
      if (Schedule.countAllActive() > 60) {
        alert('Schedule can be activate up to 60. Please Turn off unnecessary schedule');
      }
    } else {
      schedule.active = 0;
    }
    schedule.save();
  });
  window.addEventListener('close', function() {
    var stack;
    if (lastTitle !== titleField.value || lastScheme !== schemeField.value) {
      schedule.title = titleField.value;
      schedule.scheme = schemeField.value;
      schedule.save();
    }
    stack = app.views.windowStack;
    stack.pop();
    if (stack.length > 0 && schedule.saved) {
      stack[stack.length - 1].refresh(schedule);
    }
  });
  window.refresh = refresh;
  return window;
};
exports.win = {
  open: function(tab, data) {
    var trace, window;
    trace = app.helpers.util.trace;
    window = createWindow(tab);
    window.refresh(data);
    app.views.windowStack.push(window);
    tab.open(window);
  },
  createWindow: createWindow
};