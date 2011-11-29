var createWindow;
createWindow = function(tab) {
  var $$, Schedule, activeRow, activeSwitch, dateRow, dateToString, doneBtn, dtPicker, isOpenDtPicker, isOpenKeyborad, isOpenPicker, lastScheme, lastTitle, mix, picker, refresh, repeatRow, repeats, rows, schedule, schemeField, schemeRow, tableView, titleField, titleRow, trace, window;
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
  schemeRow = Ti.UI.createTableViewRow($$.tableViewRow);
  schemeField = Ti.UI.createTextField($$.textField);
  schemeRow.add(schemeField);
  activeRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    title: 'Active'
  }));
  activeSwitch = Ti.UI.createSwitch($$.switches);
  activeRow.add(activeSwitch);
  dateRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Date',
    hasChild: true
  }));
  repeatRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Repeat',
    hasChild: true
  }));
  rows = [titleRow, schemeRow, activeRow, dateRow, repeatRow];
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
    var date;
    schedule = data;
    activeSwitch.value = data.active ? true : false;
    window.title = data.title || 'Schedule';
    lastTitle = data.title;
    lastScheme = data.options.scheme;
    schemeField.value = data.options.scheme;
    titleField.value = data.title;
    date = data.options.date;
    if (date === null) {
      date = dateToString(new Date());
    }
    dateRow.title = '' + date;
    repeatRow.title = repeats[data.options.repeat];
  };
  dateRow.addEventListener('click', function() {
    window.setRightNavButton(doneBtn);
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    if (schedule.options.date === null) {
      dtPicker.value = new Date();
    } else {
      dtPicker.value = new Date(schedule.options.date);
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
    picker.setSelectedRow(0, schedule.options.repeat);
    window.add(picker);
    isOpenPicker = true;
    tableView.height = 200;
  });
  dtPicker.addEventListener('change', function(e) {
    var date;
    date = dateToString(e.value);
    dateRow.title = date;
    schedule.options.date = date;
    schedule.save();
  });
  picker.addEventListener('change', function(e) {
    repeatRow.title = repeats[e.rowIndex];
    schedule.options.repeat = e.rowIndex;
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
    schedule.active = e.value ? 1 : 0;
    return schedule.save();
  });
  window.addEventListener('close', function() {
    var stack;
    if (lastTitle !== titleField.value) {
      schedule.title = titleField.value;
      schedule.save();
    }
    stack = app.views.windowStack;
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