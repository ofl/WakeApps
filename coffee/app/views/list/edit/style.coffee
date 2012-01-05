base = (require 'app/helpers/style').style
theme = (require 'app/helpers/style').theme
mix = (require 'app/helpers/util').mix

style = 
    trashBtn: 
      systemButton: Ti.UI.iPhone.SystemButton.TRASH
    copyBtn: 
      style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
      title: L('style.copy')
    saveBtn: 
      systemButton: Ti.UI.iPhone.SystemButton.SAVE
      enabled: false
    textField: mix(base.textField,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
      returnKeyType:Ti.UI.RETURNKEY_NEXT
      color: theme.blueText
      height: 35
      left: 10
      right: 10
      keyboardToolbarColor: theme.barColor
      )       
    picker:
      bottom: 0
    pickerContainer:
      width: 320
      height: 256
      bottom: -256
      visible: false
    openPickerAnimation:
      bottom: 0
      duration: 300
    closePickerAnimation:
      bottom: -256
      duration: 300
    toolbar:
      top: 0
      height: 40
      barColor: theme.barColor
    datePicker:
      type:Ti.UI.PICKER_TYPE_DATE_AND_TIME
      bottom: 0
    popOver:
      width: 320
      height:216
    dummyView:
      height:20
      width:1
      top:0
      right:50
    rowLabel:
      width: 100
      height: 30
      color: '#000'
      left: 10      
      font: 
        fontWeight: 'bold'
        fontSize: 16
    switches:
      right: 10

exports.style = mix base, style
