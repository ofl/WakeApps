createWindow = (tab) ->
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  dateToString = app.helpers.util.dateToString
  trace = app.helpers.util.trace
  $$ = app.helpers.style.views.edit
  
  repeats = app.properties.repeats
  schedule = null
  lastTitle = null
  lastScheme = null  
          
  window = Ti.UI.createWindow $$.window
  tableView = Ti.UI.createTableView mix $$.tableView
  window.add tableView

  doneBtn = Ti.UI.createButton $$.doneBtn
      
  titleRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    idx: 0
  titleField = Ti.UI.createTextField $$.textField
  titleRow.add titleField
  
  activeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Active'
    idx: 1
  activeSwitch = Ti.UI.createSwitch $$.switches
  activeRow.add activeSwitch
  
  schemeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'URL Scheme'
    idx: 2
  schemeField = Ti.UI.createTextField $$.textField
  schemeRow.add schemeField
  
  testRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Test action'
    color: '#090'
    backgroundColor: '#ddc'
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
  
  datePicker = Ti.UI.createPicker $$.datePicker    
  repeatPicker = Ti.UI.createPicker $$.repeatPicker

  datePickerContainer = Ti.UI.createView $$.pickerContainer
  datePickerContainer.add datePicker
  repeatPickerContainer = Ti.UI.createView $$.pickerContainer
  repeatPickerContainer.add repeatPicker  
  window.add datePickerContainer
  window.add repeatPickerContainer
  
  do ()->
    choice = []
    for repeat in repeats
      choice.push Ti.UI.createPickerRow
        title: repeat
    repeatPicker.add choice
    
  tableView.setData rows
  
  refresh = (data)->
    schedule = data
    activeSwitch.value = if data.active then true else false 
    lastTitle = data.title
    lastScheme = data.scheme
    schemeField.value = data.scheme
    titleField.value = data.title
    dateRow.title = dateToString(new Date(data.date))
    repeatRow.title = repeats[data.repeat]
    return

  _blur = (index)->
    if index isnt 0
      titleField.blur()
    if index isnt 2
      schemeField.blur()
    if index isnt 4
      if datePickerContainer.visible
        datePickerContainer.animate $$.closePickerAnimation, ()->
          datePickerContainer.visible = false
    if index isnt 5
      if repeatPickerContainer.visible
        repeatPickerContainer.animate $$.closePickerAnimation, ()->
          repeatPickerContainer.visible = false
    return        

  testRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    Ti.Platform.openURL schemeField.value    
    return
  dateRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    window.setRightNavButton doneBtn    
    if schedule.date is null
      datePicker.value = new Date()
    else
      datePicker.value = new Date(schedule.date)      
    if !datePickerContainer.visible
      datePickerContainer.visible = true
      datePickerContainer.animate $$.openPickerAnimation, ()->
        tableView.height = 200
    return
  repeatRow.addEventListener 'click' , (e)->
    _blur(e.source.idx)
    window.setRightNavButton doneBtn    
    repeatPicker.setSelectedRow 0, schedule.repeat
    if !repeatPickerContainer.visible
      repeatPickerContainer.visible = true
      repeatPickerContainer.animate $$.openPickerAnimation, ()->
        tableView.height = 200
    return
  datePicker.addEventListener 'change' , (e)->
    date = dateToString e.value
    dateRow.title = date
    schedule.date = (new Date(date)).getTime()
    schedule.save()
    return
  repeatPicker.addEventListener 'change' , (e)->
    repeatRow.title = repeats[e.rowIndex]
    schedule.repeat = e.rowIndex
    schedule.save()
    return
  titleField.addEventListener 'return' , (e)->
    schemeRow.fireEvent 'click'
    return  
  titleField.addEventListener 'focus' , (e)->
    _blur(e.source.parent.idx)
    window.setRightNavButton doneBtn    
    return

  schemeField.addEventListener 'return' , (e)->
    dateRow.fireEvent 'click'
    return  
  schemeField.addEventListener 'focus' , (e)->
    _blur(e.source.parent.idx)
    window.setRightNavButton doneBtn    
    return

  doneBtn.addEventListener 'click' , ()->
    _blur(-1)
    tableView.height = 416
    window.setRightNavButton null    
    return

  activeSwitch.addEventListener 'change', (e)->
    _blur(e.source.idx)
    if e.value
      schedule.active = 1
      if Schedule.countAllActive() > 60
        alert 'Schedule can be activate up to 60. Please Turn off unnecessary schedule'
    else
      schedule.active = 0
    schedule.save()
    return
  
  window.addEventListener 'close' , ()->
    if lastTitle isnt titleField.value or lastScheme isnt schemeField.value
      schedule.title = titleField.value
      schedule.scheme = schemeField.value
      schedule.save()
    stack = app.views.windowStack
    stack.pop()
    if stack.length > 0 and schedule.isChanged
      stack[stack.length - 1].refresh schedule
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
