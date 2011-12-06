var createWindow;
createWindow = function(tab) {
  var $$, Schedule, activeRow, activeSwitch, confirm, datePicker, datePickerContainer, datePickerPopOver, dateRow, dateToString, doneBtn, dummyView1, dummyView2, fs, isIpad, kbdDoneBtn, mix, pickerToolbar, refresh, repeatPicker, repeatPickerContainer, repeatRow, repeatTablePopOver, repeatTableView, repeats, rows, saveBtn, schedule, schemeField, schemeRow, tableView, testRow, timerId, titleField, titleRow, trace, trashBtn, window, _blur, _scheduleDataWasChanged, _textFieldHandler;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  dateToString = app.helpers.util.dateToString;
  trace = app.helpers.util.trace;
  isIpad = app.properties.isIpad;
  $$ = app.helpers.style.views.edit;
  repeats = app.properties.repeats;
  schedule = null;
  timerId = null;
  trashBtn = Ti.UI.createButton($$.trashBtn);
  saveBtn = Ti.UI.createButton($$.saveBtn);
  fs = Ti.UI.createButton($$.fs);
  window = Ti.UI.createWindow(mix($$.window, {
    toolbar: [trashBtn, fs],
    rightNavButton: saveBtn
  }));
  titleRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    idx: 0
  }));
  titleField = Ti.UI.createTextField(mix($$.textField, {
    fieldName: 'title'
  }));
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
  schemeField = Ti.UI.createTextField(mix($$.textField, {
    fieldName: 'scheme'
  }));
  schemeRow.add(schemeField);
  testRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    title: 'Test Action',
    color: '#1e90ff',
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
  tableView = Ti.UI.createTableView(mix($$.tableView, {
    data: rows
  }));
  window.add(tableView);
  datePicker = Ti.UI.createPicker($$.datePicker);
  if (isIpad) {
    dummyView1 = Ti.UI.createView($$.dummyView);
    dateRow.add(dummyView1);
    dummyView2 = Ti.UI.createView($$.dummyView);
    repeatRow.add(dummyView2);
    repeatTableView = Ti.UI.createTableView();
    (function() {
      var choice, repeat, _i, _len;
      choice = [];
      for (_i = 0, _len = repeats.length; _i < _len; _i++) {
        repeat = repeats[_i];
        choice.push({
          title: repeat
        });
      }
      return repeatTableView.setData(choice);
    })();
    datePickerPopOver = Ti.UI.iPad.createPopover(mix($$.popOver, {
      title: 'Date',
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    }));
    datePickerPopOver.add(datePicker);
    repeatTablePopOver = Ti.UI.iPad.createPopover(mix($$.popOver, {
      title: 'Repeat',
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    }));
    repeatTablePopOver.add(repeatTableView);
  } else {
    doneBtn = Ti.UI.createButton($$.doneBtn);
    kbdDoneBtn = Ti.UI.createButton($$.doneBtn);
    repeatPicker = Ti.UI.createPicker($$.repeatPicker);
    titleField.keyboardToolbar = [fs, kbdDoneBtn];
    schemeField.keyboardToolbar = [fs, kbdDoneBtn];
    pickerToolbar = Ti.UI.iOS.createToolbar(mix($$.toolbar, {
      items: [fs, doneBtn]
    }));
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
    datePickerContainer = Ti.UI.createView($$.pickerContainer);
    datePickerContainer.add(datePicker);
    repeatPickerContainer = Ti.UI.createView($$.pickerContainer);
    repeatPickerContainer.add(repeatPicker);
    window.add(datePickerContainer);
    window.add(repeatPickerContainer);
  }
  refresh = function(data) {
    schedule = data;
    window.title = data.title;
    activeSwitch.value = data.active ? true : false;
    schemeField.value = data.scheme;
    titleField.value = data.title;
    dateRow.title = dateToString(new Date(data.date));
    repeatRow.title = repeats[data.repeat];
    saveBtn.enabled = false;
  };
  confirm = function(data) {
    var dialog;
    if (saveBtn.enabled) {
      dialog = Ti.UI.createAlertDialog({
        title: 'Your changes have not been saved. Discard changes?',
        buttonNames: ['Save changes', 'Cancel']
      });
      dialog.addEventListener('click', function(e) {
        if (e.index === 0) {
          schedule.save();
          app.views.windowStack[0].refresh();
          refresh(data);
        } else {
          refresh(data);
        }
      });
      dialog.show();
    } else {
      refresh(data);
    }
  };
  _scheduleDataWasChanged = function() {
    saveBtn.enabled = true;
  };
  _blur = function(index) {
    if (index !== 0) {
      titleField.blur();
    }
    if (index !== 2) {
      schemeField.blur();
    }
    if (!isIpad) {
      if (index !== 4) {
        if (datePickerContainer.visible) {
          datePickerContainer.animate($$.closePickerAnimation, function() {
            datePickerContainer.visible = false;
            window.setToolbar([trashBtn, fs], {
              animated: true
            });
            return datePickerContainer.remove(pickerToolbar);
          });
        }
      }
      if (index !== 5) {
        if (repeatPickerContainer.visible) {
          repeatPickerContainer.animate($$.closePickerAnimation, function() {
            repeatPickerContainer.visible = false;
            window.setToolbar([trashBtn, fs], {
              animated: true
            });
            return repeatPickerContainer.remove(pickerToolbar);
          });
        }
      }
    }
  };
  _textFieldHandler = function(e) {
    switch (e.type) {
      case 'focus':
        _blur(e.source.parent.idx);
        break;
      case 'return':
        rows[e.source.parent.idx + 2].fireEvent('click');
        break;
      case 'change':
        if (schedule[e.source.fieldName] !== e.source.value) {
          schedule[e.source.fieldName] = e.source.value;
        }
        _scheduleDataWasChanged();
    }
  };
  testRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    Ti.Platform.openURL(schemeField.value);
  });
  dateRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    if (schedule.date === null) {
      datePicker.value = new Date();
    } else {
      datePicker.value = new Date(schedule.date);
    }
    if (isIpad) {
      datePickerPopOver.show({
        view: dummyView1,
        animate: true
      });
    } else if (!datePickerContainer.visible) {
      window.setToolbar(null, {
        animated: false
      });
      datePickerContainer.add(pickerToolbar);
      datePickerContainer.visible = true;
      datePickerContainer.animate($$.openPickerAnimation);
    }
  });
  repeatRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    if (isIpad) {
      repeatTableView.data[0].rows[schedule.repeat].hasCheck = true;
      repeatTablePopOver.show({
        view: dummyView2,
        animate: true
      });
    } else if (!repeatPickerContainer.visible) {
      window.setToolbar(null, {
        animated: false
      });
      repeatPicker.setSelectedRow(0, schedule.repeat);
      repeatPickerContainer.add(pickerToolbar);
      repeatPickerContainer.visible = true;
      repeatPickerContainer.animate($$.openPickerAnimation);
    }
  });
  datePicker.addEventListener('change', function(e) {
    var date;
    date = dateToString(e.value);
    dateRow.title = date;
    schedule.date = (new Date(date)).getTime();
    _scheduleDataWasChanged();
  });
  if (isIpad) {
    repeatTableView.addEventListener('click', function(e) {
      var row, _i, _len, _ref;
      _ref = repeatTableView.data[0].rows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        row.hasCheck = false;
      }
      repeatRow.title = repeats[e.index];
      schedule.repeat = e.index;
      _scheduleDataWasChanged();
      repeatTablePopOver.hide();
    });
  } else {
    repeatPicker.addEventListener('change', function(e) {
      repeatRow.title = repeats[e.rowIndex];
      schedule.repeat = e.rowIndex;
      _scheduleDataWasChanged();
    });
    kbdDoneBtn.addEventListener('click', function() {
      _blur(-1);
    });
    doneBtn.addEventListener('click', function() {
      _blur(-1);
    });
  }
  titleRow.addEventListener('click', function() {
    titleField.focus();
  });
  schemeRow.addEventListener('click', function() {
    schemeField.focus();
  });
  titleField.addEventListener('return', _textFieldHandler);
  titleField.addEventListener('focus', _textFieldHandler);
  titleField.addEventListener('change', _textFieldHandler);
  schemeField.addEventListener('return', _textFieldHandler);
  schemeField.addEventListener('focus', _textFieldHandler);
  schemeField.addEventListener('change', _textFieldHandler);
  activeSwitch.addEventListener('change', function(e) {
    var value;
    _blur(e.source.idx);
    value = e.value ? 1 : 0;
    if (schedule.active !== value) {
      _scheduleDataWasChanged();
      schedule.active = value;
      if (Schedule.countAllActive() > 60) {
        alert('Schedule can be activate up to 60. Please Turn off unnecessary schedule');
      }
    }
  });
  saveBtn.addEventListener('click', function() {
    schedule.save();
    app.views.windowStack[0].refresh();
    saveBtn.enabled = false;
  });
  trashBtn.addEventListener('click', function() {
    var dialog;
    dialog = Ti.UI.createOptionDialog({
      title: 'Are you sure delete this schedule?',
      options: ['Delete', 'Cancel'],
      destructive: 0,
      cancel: 1
    });
    dialog.addEventListener('click', function(e) {
      var newSchedule;
      if (e.index === 0) {
        schedule.del();
        app.views.windowStack[0].refresh();
        if (isIpad) {
          app.views.windowStack[0].showMessage('The schedule was successfully deleted.');
          newSchedule = Schedule.findLastUpdated();
          if (newSchedule === null) {
            newSchedule = new Schedule('Open Google in Safari');
          }
          refresh(newSchedule);
        } else {
          window.close();
        }
      }
    });
    dialog.show();
  });
  window.addEventListener('close', function() {
    var stack;
    stack = app.views.windowStack;
    stack.pop();
    if (stack.length > 0 && saveBtn.enabled) {
      stack[stack.length - 1].confirm(schedule);
    }
  });
  window.refresh = refresh;
  window.confirm = confirm;
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