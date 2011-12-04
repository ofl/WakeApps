createWindow = (tab) ->
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  dateToString = app.helpers.util.dateToString
  trace = app.helpers.util.trace
  isiPad = app.properties.isiPad
  $$ = app.helpers.style.views.edit
  
  schedule = null
  repeats = app.properties.repeats
  timerId = null
  
  trashBtn =  Ti.UI.createButton $$.trashBtn
  saveBtn =  Ti.UI.createButton $$.saveBtn
  fs = Ti.UI.createButton $$.fs
  window = Ti.UI.createWindow mix $$.window,
    toolbar: [trashBtn, fs]
    rightNavButton: saveBtn
      
  titleRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    idx: 0
  titleField = Ti.UI.createTextField mix $$.textField,
    fieldName: 'title'
  titleRow.add titleField
  
  activeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Active'
    idx: 1
  activeSwitch = Ti.UI.createSwitch $$.switches
  activeRow.add activeSwitch
  
  schemeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'URL Scheme'
    idx: 2
  schemeField = Ti.UI.createTextField mix $$.textField,
    fieldName: 'scheme'
  schemeRow.add schemeField
  
  testRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Test Action'
    color: '#f00'
    hasChild: true
    idx: 3
  
  dateRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Date'
    hasChild: true
    idx: 4
    
  repeatRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Repeat'    
    hasChild: true
    idx: 5
  
  rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow]
  tableView = Ti.UI.createTableView mix $$.tableView, 
    data: rows
  window.add tableView
  
  datePicker = Ti.UI.createPicker $$.datePicker    

  if isiPad
    dummyView1 = Ti.UI.createView $$.dummyView
    dateRow.add dummyView1    
    dummyView2 = Ti.UI.createView $$.dummyView
    repeatRow.add dummyView2
    repeatTableView = Ti.UI.createTableView()
    do ()->
      choice = []
      for repeat in repeats
        choice.push title: repeat
      repeatTableView.setData choice
    datePickerPopOver = Ti.UI.iPad.createPopover mix $$.popOver,
      title: 'Date'
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    datePickerPopOver.add datePicker
    repeatTablePopOver = Ti.UI.iPad.createPopover mix $$.popOver,
      title: 'Repeat'
      arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
    repeatTablePopOver.add repeatTableView
  else
    doneBtn = Ti.UI.createButton $$.doneBtn
    kbdDoneBtn = Ti.UI.createButton $$.doneBtn
    repeatPicker = Ti.UI.createPicker $$.repeatPicker
    titleField.keyboardToolbar = [fs, kbdDoneBtn]
    schemeField.keyboardToolbar = [fs, kbdDoneBtn]
    pickerToolbar = Ti.UI.iOS.createToolbar mix $$.toolbar,
      items: [fs, doneBtn]
    do ()->
      choice = []
      for repeat in repeats
        choice.push Ti.UI.createPickerRow
          title: repeat
      repeatPicker.add choice
    datePickerContainer = Ti.UI.createView $$.pickerContainer
    datePickerContainer.add datePicker
    repeatPickerContainer = Ti.UI.createView $$.pickerContainer
    repeatPickerContainer.add repeatPicker  
    window.add datePickerContainer
    window.add repeatPickerContainer      
  
  refresh = (data)->
    schedule = data
    activeSwitch.value = if data.active then true else false 
    schemeField.value = data.scheme
    titleField.value = data.title
    dateRow.title = dateToString(new Date(data.date))
    repeatRow.title = repeats[data.repeat]
    return
  
  _scheduleDataWasChanged = ()->
    saveBtn.enabled = true
    return

  _blur = (index)->
    if index isnt 0
      titleField.blur()
    if index isnt 2
      schemeField.blur()
    if !isiPad
      if index isnt 4
        if datePickerContainer.visible
          datePickerContainer.animate $$.closePickerAnimation, ()->
            datePickerContainer.visible = false
            window.setToolbar [trashBtn, fs],{animated:true}
            datePickerContainer.remove pickerToolbar
      if index isnt 5
        if repeatPickerContainer.visible
          repeatPickerContainer.animate $$.closePickerAnimation, ()->
            repeatPickerContainer.visible = false            
            window.setToolbar [trashBtn, fs],{animated:true}
            repeatPickerContainer.remove pickerToolbar
    return        

  _textFieldHandler = (e)->
    switch e.type
      when 'focus'
        _blur(e.source.parent.idx)
      when 'return'
        rows[e.source.parent.idx + 2].fireEvent 'click'
      when 'change'
        schedule[e.source.fieldName] = e.source.value
        trace schedule.title
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
    if isiPad
      datePickerPopOver.show
        view: dummyView1
        animate: true
    else if !datePickerContainer.visible
      window.setToolbar null,{animated:false}
      datePickerContainer.add pickerToolbar
      datePickerContainer.visible = true
      datePickerContainer.animate $$.openPickerAnimation
    return
  repeatRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    if isiPad
      repeatTableView.data[0].rows[schedule.repeat].hasCheck = true
      repeatTablePopOver.show
        view: dummyView2
        animate: true
    else if !repeatPickerContainer.visible
      window.setToolbar null,{animated:false}
      repeatPicker.setSelectedRow 0, schedule.repeat
      repeatPickerContainer.add pickerToolbar
      repeatPickerContainer.visible = true
      repeatPickerContainer.animate $$.openPickerAnimation
    return
  datePicker.addEventListener 'change' , (e)->
    date = dateToString e.value
    dateRow.title = date
    schedule.date = (new Date(date)).getTime()
    _scheduleDataWasChanged()
    return
  
  if isiPad
    repeatTableView.addEventListener 'click' , (e)->
      for row in repeatTableView.data[0].rows
        row.hasCheck = false
      repeatRow.title = repeats[e.index]
      schedule.repeat = e.index
      _scheduleDataWasChanged()
      repeatTablePopOver.hide()
      return
  else
    repeatPicker.addEventListener 'change' , (e)->
      repeatRow.title = repeats[e.rowIndex]
      schedule.repeat = e.rowIndex
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
    if e.value
      schedule.active = 1
      if Schedule.countAllActive() > 60
        alert 'Schedule can be activate up to 60. Please Turn off unnecessary schedule'
    else
      schedule.active = 0
    _scheduleDataWasChanged()
    return
  
  saveBtn.addEventListener 'click' , ()->
    schedule.save()
    app.views.windowStack[0].refresh()
    saveBtn.enabled = false
    return
  
  trashBtn.addEventListener 'click' , ()->
    dialog = Ti.UI.createOptionDialog
      title: 'Are you sure delete this schedule?'
      options: ['Delete','Cancel']
      destructive: 0
      cancel: 1
    dialog.addEventListener 'click', (e)->
      if e.index is 0
        schedule.del()
        app.views.windowStack[0].refresh()
        if isiPad
          app.views.windowStack[0].showMessage 'The schedule was successfully deleted.'
          newSchedule = Schedule.findLastUpdated()
          if newSchedule is null
             newSchedule = new Schedule 'Open Google in Safari'
          refresh newSchedule            
        else
          window.close()
      return        
    dialog.show()
    return
  
  window.addEventListener 'close' , ()->
    stack = app.views.windowStack
    stack.pop()
    if stack.length > 0 and saveBtn.enabled
      stack[stack.length - 1].confirm schedule
    return
    
  window.refresh = refresh  
  
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
