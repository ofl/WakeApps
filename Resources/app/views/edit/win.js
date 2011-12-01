var createWindow;
createWindow = function(tab) {
  var $$, Schedule, activeRow, activeSwitch, datePicker, datePickerContainer, dateRow, dateToString, doneBtn, lastScheme, lastTitle, mix, refresh, repeatPicker, repeatPickerContainer, repeatRow, repeats, rows, schedule, schemeField, schemeRow, tableView, testRow, titleField, titleRow, trace, window, _blur;
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
  doneBtn = Ti.UI.createButton($$.doneBtn);
  titleRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    idx: 0
  }));
  titleField = Ti.UI.createTextField($$.textField);
  titleRow.add(titleField);
  activeRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    title: 'Active',
    idx: 1
  }));
  activeSwitch = Ti.UI.createSwitch($$.switches);
  activeRow.add(activeSwitch);
  schemeRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'URL Scheme',
    idx: 2
  }));
  schemeField = Ti.UI.createTextField($$.textField);
  schemeRow.add(schemeField);
  testRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    title: 'Test action',
    color: '#090',
    backgroundColor: '#ddc',
    hasChild: true,
    idx: 3
  }));
  dateRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Date',
    hasChild: true,
    idx: 4
  }));
  repeatRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Repeat',
    hasChild: true,
    idx: 5
  }));
  rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow];
  datePicker = Ti.UI.createPicker($$.datePicker);
  repeatPicker = Ti.UI.createPicker($$.repeatPicker);
  datePickerContainer = Ti.UI.createView($$.pickerContainer);
  datePickerContainer.add(datePicker);
  repeatPickerContainer = Ti.UI.createView($$.pickerContainer);
  repeatPickerContainer.add(repeatPicker);
  window.add(datePickerContainer);
  window.add(repeatPickerContainer);
  (function() {
    var choice, repeat, _i, _len;
    choice = [];
    for (_i = 0, _len = repeats.length; _i < _len; _i++) {
      repeat = repeats[_i];
      choice.push(Ti.UI.createPickerRow({
        title: repeat
      }));
    }
    return repeatPicker.add(choice);
  })();
  tableView.setData(rows);
  refresh = function(data) {
    schedule = data;
    activeSwitch.value = data.active ? true : false;
    lastTitle = data.title;
    lastScheme = data.scheme;
    schemeField.value = data.scheme;
    titleField.value = data.title;
    dateRow.title = dateToString(new Date(data.date));
    repeatRow.title = repeats[data.repeat];
  };
  _blur = function(index) {
    if (index !== 0) {
      titleField.blur();
    }
    if (index !== 2) {
      schemeField.blur();
    }
    if (index !== 4) {
      if (datePickerContainer.visible) {
        datePickerContainer.animate($$.closePickerAnimation, function() {
          return datePickerContainer.visible = false;
        });
      }
    }
    if (index !== 5) {
      if (repeatPickerContainer.visible) {
        repeatPickerContainer.animate($$.closePickerAnimation, function() {
          return repeatPickerContainer.visible = false;
        });
      }
    }
  };
  testRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    Ti.Platform.openURL(schemeField.value);
  });
  dateRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    window.setRightNavButton(doneBtn);
    if (schedule.date === null) {
      datePicker.value = new Date();
    } else {
      datePicker.value = new Date(schedule.date);
    }
    if (!datePickerContainer.visible) {
      datePickerContainer.visible = true;
      datePickerContainer.animate($$.openPickerAnimation, function() {
        return tableView.height = 200;
      });
    }
  });
  repeatRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    window.setRightNavButton(doneBtn);
    repeatPicker.setSelectedRow(0, schedule.repeat);
    if (!repeatPickerContainer.visible) {
      repeatPickerContainer.visible = true;
      repeatPickerContainer.animate($$.openPickerAnimation, function() {
        return tableView.height = 200;
      });
    }
  });
  datePicker.addEventListener('change', function(e) {
    var date;
    date = dateToString(e.value);
    dateRow.title = date;
    schedule.date = (new Date(date)).getTime();
    schedule.save();
  });
  repeatPicker.addEventListener('change', function(e) {
    repeatRow.title = repeats[e.rowIndex];
    schedule.repeat = e.rowIndex;
    schedule.save();
  });
  titleField.addEventListener('return', function(e) {
    schemeRow.fireEvent('click');
  });
  titleField.addEventListener('focus', function(e) {
    _blur(e.source.parent.idx);
    window.setRightNavButton(doneBtn);
  });
  schemeField.addEventListener('return', function(e) {
    dateRow.fireEvent('click');
  });
  schemeField.addEventListener('focus', function(e) {
    _blur(e.source.parent.idx);
    window.setRightNavButton(doneBtn);
  });
  doneBtn.addEventListener('click', function() {
    _blur(-1);
    tableView.height = 416;
    window.setRightNavButton(null);
  });
  activeSwitch.addEventListener('change', function(e) {
    _blur(e.source.idx);
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
    if (stack.length > 0 && schedule.isChanged) {
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