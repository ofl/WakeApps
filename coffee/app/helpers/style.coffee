mix = (require 'app/helpers/util').mix
isIpad = (require 'app/helpers/conf').isIpad


theme = 
  textColor: '#000000'
  barColor: '#666'
  backgroundColor: '#fff'
  blueText: '#336699'
  darkBlue: '#93caed'
  fontFamily: 'Helvetica Neue'

if Ti.Platform.displayCaps.dpi > 300
  images = 
    grayclock: 'images/grayclock@2x.png'
    silverclock: 'images/silverclock@2x.png'
    redclock: 'images/redclock@2x.png'
    yellowclock: 'images/yellowclock@2x.png'
    aquaclock: 'images/aquaclock@2x.png'
else
  images = 
    grayclock: 'images/grayclock.png'
    silverclock: 'images/silverclock.png'
    redclock: 'images/redclock.png'
    yellowclock: 'images/yellowclock.png'
    aquaclock: 'images/aquaclock.png'

style = 
  window: 
    barColor: theme.barColor
    backgroundColor: theme.backgroundColor
    tabBarHidden: true
    orientationModes: if isIpad then [
        Ti.UI.PORTRAIT
        Ti.UI.LANDSCAPE_LEFT
        Ti.UI.LANDSCAPE_RIGHT ] 
      else [Ti.UI.PORTRAIT]  
  label: 
    color: theme.textColor
    font: 
      fontFamily: theme.fontFamily
      fontSize: 18  
    height: 'auto'
  
  tableView: 
    backgroundColor: theme.backgroundColor
  
  tableViewRow: 
    selectedBackgroundColor: theme.darkBlue
    backgroundSelectedColor: theme.darkBlue
    hasChild: true
    className: 'tvRow'
  
  groupedTableView: 
    style: Ti.UI.iPhone.TableViewStyle.GROUPED
    rowHeight:44
  
  groupedTableViewRow: 
    selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
  
  textField: 
    borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    appearance:Ti.UI.KEYBOARD_APPEARANCE_DEFAULT       
    clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
    autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    keyboardType:Ti.UI.KEYBOARD_DEFAULT
    returnKeyType:Ti.UI.RETURNKEY_DEFAULT
    suppressReturn: false
    height:30
  
  textArea: 
    top: 0
    font:{fontSize:16}
    textAlign:'left'
    autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    backgroundColor: theme.backgroundColor
    appearance:Ti.UI.KEYBOARD_APPEARANCE_DEFAULT       
    keyboardType:Ti.UI.KEYBOARD_DEFAULT
    returnKeyType:Ti.UI.RETURNKEY_DEFAULT
    suppressReturn: false

  doneBtn: 
    systemButton: Ti.UI.iPhone.SystemButton.DONE

  fs:
    systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE

if isIpad
  style.groupedTableView.backgroundColor = '#eee'    
  style.groupedTableViewRow.backgroundColor =  '#fff'  

exports = 
  style: style
  theme: theme
  images: images