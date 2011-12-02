var exports, images, mix, properties, theme, views;
mix = app.helpers.util.mix;
theme = {
  textColor: '#000000',
  barColor: '#333333',
  backgroundColor: '#fff',
  blueText: '#336699',
  darkBlue: '#93caed',
  fontFamily: 'Helvetica Neue'
};
if (Ti.Platform.displayCaps.dpi > 300) {
  images = {
    email: 'image/021-Email@2x.png',
    photos: 'image/161-Photos@2x.png'
  };
} else {
  images = {
    email: 'image/021-Email.png',
    photos: 'image/161-Photos.png'
  };
}
app.properties.platformWidth = Ti.Platform.displayCaps.platformWidth;
app.properties.platformHeight = Ti.Platform.displayCaps.platformHeight;
app.properties.navToolHeight = 108;
app.properties.navHeight = 64;
properties = {
  Window: {
    barColor: theme.barColor,
    backgroundColor: theme.backgroundColor,
    tabBarHidden: true,
    orientationModes: app.properties.isiPad ? [Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT] : [Ti.UI.PORTRAIT]
  },
  Label: {
    color: theme.textColor,
    font: {
      fontFamily: theme.fontFamily,
      fontSize: 18
    },
    height: 'auto'
  },
  TableView: {
    backgroundColor: theme.backgroundColor
  },
  TableViewRow: {
    selectedBackgroundColor: theme.darkBlue,
    backgroundSelectedColor: theme.darkBlue,
    hasChild: true,
    className: 'tvRow'
  },
  GroupedTableView: {
    style: Ti.UI.iPhone.TableViewStyle.GROUPED,
    rowHeight: 44
  },
  GroupedTableViewRow: {
    selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
  },
  TextField: {
    borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    appearance: Ti.UI.KEYBOARD_APPEARANCE_DEFAULT,
    clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
    autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
    keyboardType: Ti.UI.KEYBOARD_DEFAULT,
    returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
    suppressReturn: false,
    height: 30
  },
  TextArea: {
    top: 0,
    font: {
      fontSize: 16
    },
    textAlign: 'left',
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    backgroundColor: theme.backgroundColor,
    appearance: Ti.UI.KEYBOARD_APPEARANCE_DEFAULT,
    keyboardType: Ti.UI.KEYBOARD_DEFAULT,
    returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
    suppressReturn: false
  }
};
views = {
  root: {
    window: mix(properties.Window, {
      title: 'Edit Schedule'
    }),
    tableView: mix(properties.TableView, {
      editable: true,
      allowsSelectionDuringEditing: false
    }),
    tableViewRow: mix(properties.TableViewRow, {
      editable: true
    }),
    editBtn: {
      systemButton: Ti.UI.iPhone.SystemButton.EDIT
    },
    doneBtn: {
      systemButton: Ti.UI.iPhone.SystemButton.DONE
    },
    addBtn: {
      systemButton: Ti.UI.iPhone.SystemButton.ADD
    },
    fs: {
      systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    },
    titleLabel: mix(properties.Label, {
      left: 5,
      top: 12,
      width: 200,
      color: '#8b4513',
      height: 20
    }),
    dateLabel: mix(properties.Label, {
      right: 20,
      top: 15,
      width: 60,
      height: 20,
      textAlign: 'right',
      font: {
        fontFamily: theme.fontFamily,
        fontSize: 14
      },
      color: '#669'
    }),
    messageWindow: {
      height: 80,
      width: 200,
      touchEnabled: false
    },
    messageView: {
      height: 80,
      width: 200,
      backgroundColor: '#000',
      borderRadius: 10,
      opacity: 0.8,
      touchEnabled: false
    },
    messageLabel: {
      text: 'Schedule updated',
      color: '#fff',
      textAlign: 'center',
      font: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      height: 'auto',
      width: 'auto'
    },
    messageAnimation: {
      delay: 1500,
      duration: 1000,
      opacity: 0.1
    }
  },
  edit: {
    window: mix(properties.Window, {
      title: 'Edit template'
    }),
    doneBtn: {
      systemButton: Ti.UI.iPhone.SystemButton.DONE
    },
    trashBtn: {
      systemButton: Ti.UI.iPhone.SystemButton.TRASH
    },
    saveBtn: {
      systemButton: Ti.UI.iPhone.SystemButton.SAVE,
      enabled: false
    },
    fs: {
      systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    },
    textField: mix(properties.TextField, {
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
      returnKeyType: Ti.UI.RETURNKEY_NEXT,
      color: theme.blueText,
      height: 35,
      left: 10,
      right: 10
    }),
    tableView: mix(properties.GroupedTableView, {
      top: 0
    }),
    tableViewRow: properties.GroupedTableViewRow,
    repeatPicker: {
      bottom: 0
    },
    pickerContainer: {
      width: 320,
      height: 216,
      bottom: -216,
      visible: false
    },
    openPickerAnimation: {
      bottom: 0,
      duration: 300
    },
    closePickerAnimation: {
      bottom: -216,
      duration: 300
    },
    datePicker: {
      type: Ti.UI.PICKER_TYPE_DATE_AND_TIME,
      bottom: 0
    },
    popOver: {
      width: 320,
      height: 216
    },
    dummyView: {
      height: 20,
      width: 1,
      top: 0,
      right: 50
    },
    switches: {
      right: 10
    }
  }
};
exports = {
  views: views
};