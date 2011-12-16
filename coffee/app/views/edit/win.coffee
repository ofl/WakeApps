createWindow = (tab) ->
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  dateToString = app.helpers.util.dateToString
  trace = app.helpers.util.trace
  isIpad = app.properties.isIpad
  $$ = app.helpers.style.views.edit
  repeats = app.properties.repeats
  sounds = [L('edit.alert'), L('edit.default'), L('conf.none')]
  
  schedule = null
  
  trashBtn =  Ti.UI.createButton $$
  .trashBtn
  copyBtn =  Ti.UI.createButton $$.copyBtn
  saveBtn =  Ti.UI.createButton $$.saveBtn
  fs = Ti.UI.createButton $$.fs
  
  window = Ti.UI.createWindow mix $$.window,
    toolbar: [trashBtn, fs, copyBtn]
    rightNavButton: saveBtn
      
  titleRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    idx: 0
  titleField = Ti.UI.createTextField mix $$.textField,
    fieldName: 'title'
  titleRow.add titleField
  
  activeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    idx: 1
  activeRow.add Ti.UI.createLabel mix $$.activeLabel,
    text : L('edit.active')
    font: 
      fontWeight: 'bold'
      fontSize: 16
  activeSwitch = Ti.UI.createSwitch $$.switches
  activeRow.add activeSwitch
  
  schemeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'URL Scheme'
    idx: 2
  schemeField = Ti.UI.createTextField mix $$.textField,
    fieldName: 'scheme'
  schemeRow.add schemeField
  
  testRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: L 'edit.test'
    color: '#1e90ff'
    hasChild: true
    idx: 3
  
  dateRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: L 'edit.date'
    hasChild: true
    idx: 4
    
  repeatRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: L 'edit.repeat'
    hasChild: true
    idx: 5
    
  soundRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: L 'edit.sound'
    hasChild: true
    idx: 6
  
  rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow, soundRow]
  # tableView = Ti.UI.createTableView mix $$.tableView, 
    # data: rows
  tableView = Ti.UI.createTableView $$.tableView 
  tableView.data = rows
  window.add tableView
  
  datePicker = Ti.UI.createPicker $$.datePicker    

  if isIpad
    dateRow.add Ti.UI.createView $$.dummyView
    repeatRow.add Ti.UI.createView $$.dummyView
    repeatTableView = Ti.UI.createTableView()
    soundRow.add Ti.UI.createView $$.dummyView
    soundTableView = Ti.UI.createTableView()
    do ()->
      choice = []
      for repeat in repeats
        choice.push title: repeat
      repeatTableView.setData choice
      return
    do ()->
      choice = []
      for sound in sounds
        choice.push title: sound
      soundTableView.setData choice      
      return
    datePickerPopOver = Ti.UI.iPad.createPopover mix $$.popOver,
      title: L 'edit.date'
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    datePickerPopOver.add datePicker
    repeatTablePopOver = Ti.UI.iPad.createPopover mix $$.popOver,
      title: L 'edit.repeat'
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    repeatTablePopOver.add repeatTableView
    soundTablePopOver = Ti.UI.iPad.createPopover mix $$.popOver,
      title: L 'edit.sound'
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    soundTablePopOver.add soundTableView
  else
    doneBtn = Ti.UI.createButton $$.doneBtn
    kbdDoneBtn = Ti.UI.createButton $$.doneBtn
    repeatPicker = Ti.UI.createPicker $$.picker
    soundPicker = Ti.UI.createPicker $$.picker
    titleField.keyboardToolbar = [fs, kbdDoneBtn]
    schemeField.keyboardToolbar = [fs, kbdDoneBtn]
    pickerToolbar = Ti.UI.iOS.createToolbar mix $$.toolbar,
      items: [fs, doneBtn]
    # pickerToolbar = Ti.UI.createToolbar mix $$.toolbar,
      # items: [fs, doneBtn]
    do ()->
      choice = []
      for repeat in repeats
        choice.push Ti.UI.createPickerRow
          title: repeat
      repeatPicker.add choice
      return
    do ()->
      choice = []
      for sound in sounds
        choice.push Ti.UI.createPickerRow
          title: sound
      soundPicker.add choice
      return
    datePickerContainer = Ti.UI.createView $$.pickerContainer
    datePickerContainer.add datePicker
    repeatPickerContainer = Ti.UI.createView $$.pickerContainer
    repeatPickerContainer.add repeatPicker  
    soundPickerContainer = Ti.UI.createView $$.pickerContainer
    soundPickerContainer.add soundPicker  
    window.add datePickerContainer
    window.add repeatPickerContainer      
    window.add soundPickerContainer      
  
  refresh = (data)->
    schedule = data
    window.title = data.title
    activeSwitch.value = if data.active then true else false 
    schemeField.value = data.scheme
    titleField.value = data.title
    dateRow.title = dateToString(new Date(data.date))
    repeatRow.title = repeats[data.repeat]
    soundRow.title = sounds[data.sound]
    saveBtn.enabled = false
    copyBtn.enabled = true
    return

  confirm = (data)->
    if saveBtn.enabled
      dialog = Ti.UI.createAlertDialog
        title: L 'root.confirm'
        buttonNames: [L('root.save'),L('root.cancel')]
      dialog.addEventListener 'click', (e)->
        if e.index is 0
          schedule.save()
          app.views.windowStack[0].refresh()
          refresh data
        else
          refresh data          
        return        
      dialog.show()
    else
      refresh data
    return    
  
  _scheduleDataWasChanged = ()->
    saveBtn.enabled = true
    copyBtn.enabled = false
    return

  _blur = (index)->
    if index isnt 0
      titleField.blur()
    if index isnt 2
      schemeField.blur()
    if !isIpad
      if index isnt 4
        if datePickerContainer.visible
          datePickerContainer.animate $$.closePickerAnimation, ()->
            datePickerContainer.visible = false
            window.setToolbar [trashBtn, fs, copyBtn],{animated:true}
            datePickerContainer.remove pickerToolbar
            return
      if index isnt 5
        if repeatPickerContainer.visible
          repeatPickerContainer.animate $$.closePickerAnimation, ()->
            repeatPickerContainer.visible = false            
            window.setToolbar [trashBtn, fs, copyBtn],{animated:true}
            repeatPickerContainer.remove pickerToolbar
            return
      if index isnt 6
        if soundPickerContainer.visible
          soundPickerContainer.animate $$.closePickerAnimation, ()->
            soundPickerContainer.visible = false            
            window.setToolbar [trashBtn, fs, copyBtn],{animated:true}
            soundPickerContainer.remove pickerToolbar
            return
    return        

  _textFieldHandler = (e)->
    switch e.type
      when 'focus'
        _blur(e.source.parent.idx)
      when 'return'
        rows[e.source.parent.idx + 2].fireEvent 'click'
      when 'change'
        if schedule[e.source.fieldName] isnt e.source.value
          schedule[e.source.fieldName] = e.source.value
        _scheduleDataWasChanged()
    return    

  testRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    Ti.Platform.openURL schemeField.value    
    return
  dateRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    if schedule.date is null
      datePicker.value = new Date()
    else
      datePicker.value = new Date(schedule.date)
    if isIpad
      datePickerPopOver.show
        view: dateRow.getChildren()[0]
        animate: true
    else if !datePickerContainer.visible
      window.setToolbar null,{animated:false}
      datePickerContainer.add pickerToolbar
      datePickerContainer.visible = true
      datePickerContainer.animate $$.openPickerAnimation
    return
  repeatRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    if isIpad
      repeatTableView.data[0].rows[schedule.repeat].hasCheck = true
      repeatTablePopOver.show
        view: repeatRow.getChildren()[0]
        animate: true
    else if !repeatPickerContainer.visible
      window.setToolbar null,{animated:false}
      repeatPicker.setSelectedRow 0, schedule.repeat
      repeatPickerContainer.add pickerToolbar
      repeatPickerContainer.visible = true
      repeatPickerContainer.animate $$.openPickerAnimation
    return
  soundRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    if isIpad
      soundTableView.data[0].rows[schedule.sound].hasCheck = true
      soundTablePopOver.show
        view: soundRow.getChildren()[0]
        animate: true
    else if !soundPickerContainer.visible
      window.setToolbar null,{animated:false}
      soundPicker.setSelectedRow 0, schedule.sound
      soundPickerContainer.add pickerToolbar
      soundPickerContainer.visible = true
      soundPickerContainer.animate $$.openPickerAnimation
    return
  datePicker.addEventListener 'change' , (e)->
    date = dateToString e.value
    dateRow.title = date
    schedule.date = (new Date(date.replace(/-/g, '/'))).getTime()
    _scheduleDataWasChanged()
    return
  
  if isIpad
    repeatTableView.addEventListener 'click' , (e)->
      for row in repeatTableView.data[0].rows
        row.hasCheck = false
      repeatRow.title = repeats[e.index]
      schedule.repeat = e.index
      _scheduleDataWasChanged()
      repeatTablePopOver.hide()
      return
    soundTableView.addEventListener 'click' , (e)->
      for row in soundTableView.data[0].rows
        row.hasCheck = false
      soundRow.title = sounds[e.index]
      schedule.sound = e.index
      _scheduleDataWasChanged()
      soundTablePopOver.hide()
      return
  else
    repeatPicker.addEventListener 'change' , (e)->
      repeatRow.title = repeats[e.rowIndex]
      schedule.repeat = e.rowIndex
      _scheduleDataWasChanged()
      return
    soundPicker.addEventListener 'change' , (e)->
      soundRow.title = sounds[e.rowIndex]
      schedule.sound = e.rowIndex
      _scheduleDataWasChanged()
      return

    kbdDoneBtn.addEventListener 'click' , ()->
      _blur(-1)
      return

    doneBtn.addEventListener 'click' , ()->
      _blur(-1)
      return
    
  titleRow.addEventListener 'click' , ()->
    titleField.focus()
    return
  
  schemeRow.addEventListener 'click' , ()->
    schemeField.focus()
    return
  
  titleField.addEventListener 'return' ,_textFieldHandler
  titleField.addEventListener 'focus' , _textFieldHandler
  titleField.addEventListener 'change' , _textFieldHandler
  schemeField.addEventListener 'return' , _textFieldHandler
  schemeField.addEventListener 'focus' , _textFieldHandler
  schemeField.addEventListener 'change' , _textFieldHandler

  activeSwitch.addEventListener 'change', (e)->
    _blur(e.source.idx)
    value = if e.value then 1 else 0
    if schedule.active isnt value
      _scheduleDataWasChanged()
      schedule.active = value
      if Schedule.countAllActive() > 60
        alert L('edit.over')
    return
  
  saveBtn.addEventListener 'click' , ()->
    schedule.save()
    app.views.windowStack[0].refresh()
    app.views.windowStack[0].showMessage L('edit.saved')
    saveBtn.enabled = false
    copyBtn.enabled = true
    return
  
  trashBtn.addEventListener 'click' , ()->
    dialog = Ti.UI.createOptionDialog
      title: L 'edit.confirm'
      options: [L('edit.delete'), L('root.cancel')]
      destructive: 0
      cancel: 1
    dialog.addEventListener 'click', (e)->
      if e.index is 0
        schedule.del()
        app.views.windowStack[0].refresh()
        if isIpad
          app.views.windowStack[0].showMessage(L('root.deleted'))
          newSchedule = Schedule.findLastUpdated()
          if newSchedule is null
             newSchedule = new Schedule(L('root.newschedule'))
          refresh newSchedule            
        else
          window.close()
      return        
    dialog.show()
    return
  
  copyBtn.addEventListener 'click' , ()->
    data = new Schedule schedule.title, schedule.active, schedule.date, schedule.scheme, schedule.repeat, schedule.sound, schedule.options
    schedule = data
    app.views.windowStack[0].showMessage L('edit.copied')
    saveBtn.enabled = true
    copyBtn.enabled = false    
    return
  
  window.addEventListener 'close' , ()->
    stack = app.views.windowStack
    stack.pop()
    if stack.length > 0 and saveBtn.enabled
      stack[stack.length - 1].confirm schedule
    return
    
  window.refresh = refresh  
  window.confirm = confirm  
  
  return window
          
exports.win = 
  open: (tab, data) ->
    trace = app.helpers.util.trace    
    window = createWindow tab
    window.refresh data
    app.views.windowStack.push window
    tab.open window
    return
    
  createWindow: createWindow
