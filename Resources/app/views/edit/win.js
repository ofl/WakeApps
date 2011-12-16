var createWindow;
createWindow = function(tab) {
  var $$, Schedule, activeRow, activeSwitch, confirm, copyBtn, datePicker, datePickerContainer, datePickerPopOver, dateRow, dateToString, doneBtn, fs, isIpad, kbdDoneBtn, mix, pickerToolbar, refresh, repeatPicker, repeatPickerContainer, repeatRow, repeatTablePopOver, repeatTableView, repeats, rows, saveBtn, schedule, schemeField, schemeRow, soundPicker, soundPickerContainer, soundRow, soundTablePopOver, soundTableView, sounds, tableView, testRow, titleField, titleRow, trace, trashBtn, window, _blur, _scheduleDataWasChanged, _textFieldHandler;
  Schedule = app.models.Schedule;
  mix = app.helpers.util.mix;
  dateToString = app.helpers.util.dateToString;
  trace = app.helpers.util.trace;
  isIpad = app.properties.isIpad;
  $$ = app.helpers.style.views.edit;
  repeats = app.properties.repeats;
  sounds = [L('edit.alert'), L('edit.default'), L('conf.none')];
  schedule = null;
  trashBtn = Ti.UI.createButton($$.trashBtn);
  copyBtn = Ti.UI.createButton($$.copyBtn);
  saveBtn = Ti.UI.createButton($$.saveBtn);
  fs = Ti.UI.createButton($$.fs);
  window = Ti.UI.createWindow(mix($$.window, {
    toolbar: [trashBtn, fs, copyBtn],
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
    idx: 1
  }));
  activeRow.add(Ti.UI.createLabel(mix($$.activeLabel, {
    text: L('edit.active'),
    font: {
      fontWeight: 'bold',
      fontSize: 16
    }
  })));
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
    title: L('edit.test'),
    color: '#1e90ff',
    hasChild: true,
    idx: 3
  }));
  dateRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: L('edit.date'),
    hasChild: true,
    idx: 4
  }));
  repeatRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: L('edit.repeat'),
    hasChild: true,
    idx: 5
  }));
  soundRow = Ti.UI.createTableViewRow(mix($$.tableViewRow, {
    header: L('edit.sound'),
    hasChild: true,
    idx: 6
  }));
  rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow, soundRow];
  tableView = Ti.UI.createTableView($$.tableView);
  tableView.data = rows;
  window.add(tableView);
  datePicker = Ti.UI.createPicker($$.datePicker);
  if (isIpad) {
    dateRow.add(Ti.UI.createView($$.dummyView));
    repeatRow.add(Ti.UI.createView($$.dummyView));
    repeatTableView = Ti.UI.createTableView();
    soundRow.add(Ti.UI.createView($$.dummyView));
    soundTableView = Ti.UI.createTableView();
    (function() {
      var choice, repeat, _i, _len;
      choice = [];
      for (_i = 0, _len = repeats.length; _i < _len; _i++) {
        repeat = repeats[_i];
        choice.push({
          title: repeat
        });
      }
      repeatTableView.setData(choice);
    })();
    (function() {
      var choice, sound, _i, _len;
      choice = [];
      for (_i = 0, _len = sounds.length; _i < _len; _i++) {
        sound = sounds[_i];
        choice.push({
          title: sound
        });
      }
      soundTableView.setData(choice);
    })();
    datePickerPopOver = Ti.UI.iPad.createPopover(mix($$.popOver, {
      title: L('edit.date'),
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    }));
    datePickerPopOver.add(datePicker);
    repeatTablePopOver = Ti.UI.iPad.createPopover(mix($$.popOver, {
      title: L('edit.repeat'),
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    }));
    repeatTablePopOver.add(repeatTableView);
    soundTablePopOver = Ti.UI.iPad.createPopover(mix($$.popOver, {
      title: L('edit.sound'),
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    }));
    soundTablePopOver.add(soundTableView);
  } else {
    doneBtn = Ti.UI.createButton($$.doneBtn);
    kbdDoneBtn = Ti.UI.createButton($$.doneBtn);
    repeatPicker = Ti.UI.createPicker($$.picker);
    soundPicker = Ti.UI.createPicker($$.picker);
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
      repeatPicker.add(choice);
    })();
    (function() {
      var choice, sound, _i, _len;
      choice = [];
      for (_i = 0, _len = sounds.length; _i < _len; _i++) {
        sound = sounds[_i];
        choice.push(Ti.UI.createPickerRow({
          title: sound
        }));
      }
      soundPicker.add(choice);
    })();
    datePickerContainer = Ti.UI.createView($$.pickerContainer);
    datePickerContainer.add(datePicker);
    repeatPickerContainer = Ti.UI.createView($$.pickerContainer);
    repeatPickerContainer.add(repeatPicker);
    soundPickerContainer = Ti.UI.createView($$.pickerContainer);
    soundPickerContainer.add(soundPicker);
    window.add(datePickerContainer);
    window.add(repeatPickerContainer);
    window.add(soundPickerContainer);
  }
  refresh = function(data) {
    schedule = data;
    window.title = data.title;
    activeSwitch.value = data.active ? true : false;
    schemeField.value = data.scheme;
    titleField.value = data.title;
    dateRow.title = dateToString(new Date(data.date));
    repeatRow.title = repeats[data.repeat];
    soundRow.title = sounds[data.sound];
    saveBtn.enabled = false;
    copyBtn.enabled = true;
  };
  confirm = function(data) {
    var dialog;
    if (saveBtn.enabled) {
      dialog = Ti.UI.createAlertDialog({
        title: L('root.confirm'),
        buttonNames: [L('root.save'), L('root.cancel')]
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
    copyBtn.enabled = false;
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
            window.setToolbar([trashBtn, fs, copyBtn], {
              animated: true
            });
            datePickerContainer.remove(pickerToolbar);
          });
        }
      }
      if (index !== 5) {
        if (repeatPickerContainer.visible) {
          repeatPickerContainer.animate($$.closePickerAnimation, function() {
            repeatPickerContainer.visible = false;
            window.setToolbar([trashBtn, fs, copyBtn], {
              animated: true
            });
            repeatPickerContainer.remove(pickerToolbar);
          });
        }
      }
      if (index !== 6) {
        if (soundPickerContainer.visible) {
          soundPickerContainer.animate($$.closePickerAnimation, function() {
            soundPickerContainer.visible = false;
            window.setToolbar([trashBtn, fs, copyBtn], {
              animated: true
            });
            soundPickerContainer.remove(pickerToolbar);
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
        view: dateRow.getChildren()[0],
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
        view: repeatRow.getChildren()[0],
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
  soundRow.addEventListener('click', function(e) {
    _blur(e.source.idx);
    if (isIpad) {
      soundTableView.data[0].rows[schedule.sound].hasCheck = true;
      soundTablePopOver.show({
        view: soundRow.getChildren()[0],
        animate: true
      });
    } else if (!soundPickerContainer.visible) {
      window.setToolbar(null, {
        animated: false
      });
      soundPicker.setSelectedRow(0, schedule.sound);
      soundPickerContainer.add(pickerToolbar);
      soundPickerContainer.visible = true;
      soundPickerContainer.animate($$.openPickerAnimation);
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
    soundTableView.addEventListener('click', function(e) {
      var row, _i, _len, _ref;
      _ref = soundTableView.data[0].rows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        row.hasCheck = false;
      }
      soundRow.title = sounds[e.index];
      schedule.sound = e.index;
      _scheduleDataWasChanged();
      soundTablePopOver.hide();
    });
  } else {
    repeatPicker.addEventListener('change', function(e) {
      repeatRow.title = repeats[e.rowIndex];
      schedule.repeat = e.rowIndex;
      _scheduleDataWasChanged();
    });
    soundPicker.addEventListener('change', function(e) {
      soundRow.title = sounds[e.rowIndex];
      schedule.sound = e.rowIndex;
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
        alert(L('edit.over'));
      }
    }
  });
  saveBtn.addEventListener('click', function() {
    schedule.save();
    app.views.windowStack[0].refresh();
    app.views.windowStack[0].showMessage(L('edit.saved'));
    saveBtn.enabled = false;
    copyBtn.enabled = true;
  });
  trashBtn.addEventListener('click', function() {
    var dialog;
    dialog = Ti.UI.createOptionDialog({
      title: L('edit.confirm'),
      options: [L('edit.delete'), L('root.cancel')],
      destructive: 0,
      cancel: 1
    });
    dialog.addEventListener('click', function(e) {
      var newSchedule;
      if (e.index === 0) {
        schedule.del();
        app.views.windowStack[0].refresh();
        if (isIpad) {
          app.views.windowStack[0].showMessage(L('root.deleted'));
          newSchedule = Schedule.findLastUpdated();
          if (newSchedule === null) {
            newSchedule = new Schedule(L('root.newschedule'));
          }
          refresh(newSchedule);
        } else {
          window.close();
        }
      }
    });
    dialog.show();
  });
  copyBtn.addEventListener('click', function() {
    var data;
    data = new Schedule(schedule.title, schedule.active, schedule.date, schedule.scheme, schedule.repeat, schedule.sound, schedule.options);
    schedule = data;
    app.views.windowStack[0].showMessage(L('edit.copied'));
    saveBtn.enabled = true;
    copyBtn.enabled = false;
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