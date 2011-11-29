var createWindow;
createWindow = function() {
  var $$, Schedule, activeRow, activeSwitch, cdPicker, data, doneBtn, isOpenCdPicker, isOpenKeyborad, isOpenPicker, lastScheme, lastTitle, minRow, mix, picker, refresh, repeatRow, repeats, rows, schemeField, schemeRow, tableView, titleField, titleRow, trace, window;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  trace = app.helpers.util.trace;
  $$ = app.helpers.style.views.edit;
  repeats = app.properties.repeats;
  data = null;
  lastTitle = null;
  lastScheme = null;
  window = Ti.UI.createWindow($$.window);
  tableView = Ti.UI.createTableView(mix($$.tableView));
  window.add(tableView);
  isOpenKeyborad = false;
  isOpenPicker = false;
  isOpenCdPicker = false;
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
  minRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Time',
    hasChild: true
  }));
  repeatRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: 'Repeat',
    hasChild: true
  }));
  rows = [titleRow, schemeRow, activeRow, minRow, repeatRow];
  cdPicker = Ti.UI.createPicker($$.cdPicker);
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
    activeSwitch.value = data.active;
    window.title = data.title || 'Schedule';
    lastTitle = data.title;
    lastScheme = data.options.scheme;
    schemeRow.title = data.options.scheme;
    titleField.value = data.title;
    minRow.title = '' + data.options.min + 'min';
    return repeatRow.title = repeats[data.options.repeat];
  };
  minRow.addEventListener('click', function() {
    window.setRightNavButton(doneBtn);
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    window.add(cdPicker);
    isOpenCdPicker = true;
    tableView.height = 200;
  });
  repeatRow.addEventListener('click', function() {
    window.setRightNavButton(doneBtn);
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenCdPicker) {
      window.remove(cdPicker);
      isOpenCdPicker = false;
    }
    window.add(picker);
    isOpenPicker = true;
    tableView.height = 200;
  });
  cdPicker.addEventListener('change', function(e) {
    var minutes;
    minutes = e.value.getDate() * 1440 + e.value.getHours() * 60 + e.value.getMinutes() - 43181;
    minRow.title = '' + minutes + 'min';
    data.options.min = minutes;
    data.save();
  });
  picker.addEventListener('change', function(e) {
    repeatRow.title = repeats[e.rowIndex];
    data.repeat = e.rowIndex;
    data.save();
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
    if (isOpenCdPicker) {
      window.remove(cdPicker);
      isOpenCdPicker = false;
    }
  });
  schemeField.addEventListener('return', function() {
    minRow.fireEvent('click');
  });
  schemeField.addEventListener('focus', function() {
    window.setRightNavButton(doneBtn);
    isOpenKeyborad = true;
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    if (isOpenCdPicker) {
      window.remove(cdPicker);
      isOpenCdPicker = false;
    }
  });
  doneBtn.addEventListener('click', function() {
    titleField.blur();
    isOpenKeyborad = false;
    if (isOpenCdPicker) {
      window.remove(cdPicker);
      isOpenCdPicker = false;
    }
    if (isOpenPicker) {
      window.remove(picker);
      isOpenPicker = false;
    }
    tableView.height = 416;
    window.setRightNavButton(null);
  });
  activeSwitch.addEventListener('change', function(e) {
    data.active = e.value;
    return data.save();
  });
  window.addEventListener('open', function() {
    setTimeout(titleField.focus, 300);
  });
  window.addEventListener('close', function() {
    var stack;
    if (lastTitle !== titleField.value) {
      data.title = titleField.value;
      data.save();
    }
    stack = app.views.windowStack;
    if (stack.length > 0 && data.saved) {
      stack[stack.length - 1].refresh(data);
    }
  });
  window.refresh = refresh;
  return window;
};
exports.win = {
  open: function(data) {
    var trace, window;
    trace = app.helpers.util.trace;
    window = createWindow();
    window.refresh(data);
    window.open({
      modal: true
    });
  },
  createWindow: createWindow
};