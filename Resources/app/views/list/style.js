var base, images, mix, style, theme;
base = (require('app/helpers/style')).style;
theme = (require('app/helpers/style')).theme;
images = (require('app/helpers/style')).images;
mix = (require('app/helpers/util')).mix;
style = {
  tableView: mix(base.TableView, {
    editable: true,
    allowsSelectionDuringEditing: false,
    backgroundColor: theme.backgroundColor
  }),
  tableViewRow: mix(base.tableViewRow, {
    editable: true,
    height: 46
  }),
  editBtn: {
    systemButton: Ti.UI.iPhone.SystemButton.EDIT
  },
  addBtn: {
    systemButton: Ti.UI.iPhone.SystemButton.ADD
  },
  refreshBtn: {
    systemButton: Ti.UI.iPhone.SystemButton.REFRESH
  },
  titleLabel: mix(base.Label, {
    left: 44,
    top: 4,
    width: 200,
    color: '#000',
    height: 20
  }),
  dateLabel: mix(base.Label, {
    left: 62,
    top: 25,
    width: 250,
    height: 17,
    font: {
      fontFamily: theme.fontFamily,
      fontSize: 14
    },
    color: '#777'
  }),
  imageView: {
    top: 6,
    left: 4,
    height: 32,
    width: 32
  },
  repeatImageView: {
    top: 26,
    left: 44,
    height: 16,
    width: 16,
    image: 'images/imgres.jpeg'
  },
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
  },
  updateLabel: {
    color: '#fff',
    textAlign: 'center',
    font: {
      fontSize: 12
    },
    height: 'auto',
    width: 'auto'
  },
  grayclock: images.grayclock,
  silverclock: images.silverclock,
  aquaclock: images.aquaclock,
  redclock: images.redclock,
  yellowclock: images.yellowclock
};
exports.style = mix(base, style);