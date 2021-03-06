var $$, Schedule, Window, dateToString, isIpad, mix, trace, util;
util = require('app/helpers/util');
Schedule = require('app/models/Schedule');
trace = util.trace;
mix = util.mix;
dateToString = util.dateToString;
isIpad = (require('app/helpers/conf')).isIpad;
$$ = (require('app/views/list/edit/style')).style;
Window = (function() {
  function Window(app) {
    var activeRow, activeSwitch, confirm, copyBtn, datePicker, datePickerContainer, datePickerPopOver, dateRow, doneBtn, fs, kbdDoneBtn, open, pickerToolbar, refresh, repeatPicker, repeatPickerContainer, repeatRow, repeatTablePopOver, repeatTableView, repeats, rows, saveBtn, schedule, schemeField, schemeRow, soundRow, soundSwitch, tableView, testRow, titleField, titleRow, trashBtn, window, _blur, _scheduleDataWasChanged, _textFieldHandler;
    repeats = [L('conf.none'), L('conf.daily'), L('conf.weekly'), L('conf.monthly'), L('conf.yearly')];
    schedule = null;
    trashBtn = Ti.UI.createButton($$.trashBtn);
    copyBtn = Ti.UI.createButton($$.copyBtn);
    saveBtn = Ti.UI.createButton($$.saveBtn);
    fs = Ti.UI.createButton($$.fs);
    window = Ti.UI.createWindow(mix($$.window, {
      toolbar: [trashBtn, fs, copyBtn],
      rightNavButton: saveBtn
    }));
    titleRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      idx: 0
    }));
    titleField = Ti.UI.createTextField(mix($$.textField, {
      fieldName: 'title'
    }));
    titleRow.add(titleField);
    activeRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      idx: 1
    }));
    activeRow.add(Ti.UI.createLabel(mix($$.rowLabel, {
      text: L('edit.active')
    })));
    activeSwitch = Ti.UI.createSwitch($$.switches);
    activeRow.add(activeSwitch);
    schemeRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      header: 'URL Scheme',
      idx: 2
    }));
    schemeField = Ti.UI.createTextField(mix($$.textField, {
      fieldName: 'scheme'
    }));
    schemeRow.add(schemeField);
    testRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      title: L('edit.test'),
      color: '#1e90ff',
      hasChild: true,
      idx: 3
    }));
    dateRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      header: L('edit.date'),
      hasChild: true,
      idx: 4
    }));
    repeatRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      header: L('edit.repeat'),
      hasChild: true,
      idx: 5
    }));
    soundRow = Ti.UI.createTableViewRow(mix($$.groupedTableViewRow, {
      header: L('edit.sound'),
      idx: 6
    }));
    soundRow.add(Ti.UI.createLabel(mix($$.rowLabel, {
      text: L('edit.sound')
    })));
    soundSwitch = Ti.UI.createSwitch($$.switches);
    soundRow.add(soundSwitch);
    rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow, soundRow];
    tableView = Ti.UI.createTableView($$.groupedTableView);
    tableView.data = rows;
    window.add(tableView);
    datePicker = Ti.UI.createPicker($$.datePicker);
    if (isIpad) {
      dateRow.add(Ti.UI.createView($$.dummyView));
      repeatRow.add(Ti.UI.createView($$.dummyView));
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
        repeatTableView.setData(choice);
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
    } else {
      doneBtn = Ti.UI.createButton($$.doneBtn);
      kbdDoneBtn = Ti.UI.createButton($$.doneBtn);
      repeatPicker = Ti.UI.createPicker($$.picker);
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
      soundSwitch.value = data.sound ? true : false;
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
    open = function(data) {
      refresh(data);
      app.views.windowStack.push(window);
      app.views.tab.open(this.window);
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
    datePicker.addEventListener('change', function(e) {
      var date;
      date = dateToString(e.value);
      dateRow.title = date;
      schedule.date = (new Date(date.replace(/-/g, '/'))).getTime();
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
      value = e.value ? 1 : 0;
      if (schedule.active !== value) {
        _scheduleDataWasChanged();
        schedule.active = value;
        if (Schedule.countAllActive() > 60) {
          alert(L('edit.over'));
        }
      }
    });
    soundSwitch.addEventListener('change', function(e) {
      var value;
      value = e.value ? 1 : 0;
      if (schedule.sound !== value) {
        _scheduleDataWasChanged();
        schedule.sound = value;
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
    this.window = window;
    this.refresh = refresh;
    this.confirm = confirm;
    this.open = open;
  }
  return Window;
})();
exports.Window = Window;