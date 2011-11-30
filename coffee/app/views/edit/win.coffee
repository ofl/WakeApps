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
  
  isOpenKeyborad = false
  isOpenPicker = false
  isOpenDtPicker = false

  doneBtn = Ti.UI.createButton $$.doneBtn
      
  titleRow = Ti.UI.createTableViewRow $$.tableViewRow
  titleField = Ti.UI.createTextField $$.textField
  titleRow.add titleField
  activeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Active'
  activeSwitch = Ti.UI.createSwitch $$.switches
  activeRow.add activeSwitch
  schemeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'URL Scheme'
  schemeField = Ti.UI.createTextField $$.textField
  schemeRow.add schemeField
  testRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Test action'
    color: '#090'
    backgroundColor: '#ddc'
    hasChild: true
  
  dateRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Date'
    hasChild: true
  repeatRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Repeat'    
    hasChild: true
    
  rows = [titleRow, activeRow, schemeRow, testRow, dateRow, repeatRow]
  
  dtPicker = Ti.UI.createPicker $$.dtPicker    
  picker = Ti.UI.createPicker $$.picker
  do ()->
    choice = []
    for repeat in repeats
      choice.push Ti.UI.createPickerRow
        title: repeat
    picker.add choice
    
  tableView.setData rows
  
  refresh = (data)->
    schedule = data
    activeSwitch.value = if data.active then true else false 
    window.title =  data.title or 'Schedule'
    lastTitle = data.title
    lastScheme = data.scheme
    schemeField.value = data.scheme
    titleField.value = data.title
    dateRow.title = dateToString(new Date(data.date))
    repeatRow.title = repeats[data.repeat]
    return

  testRow.addEventListener 'click' , ()->
    Ti.Platform.openURL schemeField.value    
    return
  dateRow.addEventListener 'click' , ()->
    window.setRightNavButton doneBtn    
    titleField.blur()
    isOpenKeyborad = false
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    if schedule.date is null
      dtPicker.value = new Date()
    else
      dtPicker.value = new Date(schedule.date)
    window.add dtPicker
    isOpenDtPicker = true
    tableView.height = 200
    return
  repeatRow.addEventListener 'click' , ()->
    window.setRightNavButton doneBtn    
    titleField.blur()
    isOpenKeyborad = false
    if isOpenDtPicker
      window.remove dtPicker
      isOpenDtPicker = false
    picker.setSelectedRow 0, schedule.repeat
    window.add picker
    isOpenPicker = true
    tableView.height = 200
    return
  dtPicker.addEventListener 'change' , (e)->
    date = dateToString e.value
    dateRow.title = date
    schedule.date = e.value.getTime()
    schedule.save()
    return
  picker.addEventListener 'change' , (e)->
    repeatRow.title = repeats[e.rowIndex]
    schedule.repeat = e.rowIndex
    schedule.save()
    return
  titleField.addEventListener 'return' , ()->
    schemeRow.fireEvent 'click'
    return  
  titleField.addEventListener 'focus' , ()->
    window.setRightNavButton doneBtn    
    isOpenKeyborad = true
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    if isOpenDtPicker
      window.remove dtPicker
      isOpenDtPicker = false
    # tableView.height = 200
    return

  schemeField.addEventListener 'return' , ()->
    dateRow.fireEvent 'click'
    return  
  schemeField.addEventListener 'focus' , ()->
    window.setRightNavButton doneBtn    
    isOpenKeyborad = true
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    if isOpenDtPicker
      window.remove dtPicker
      isOpenDtPicker = false
    # tableView.height = 200
    return

  doneBtn.addEventListener 'click' , ()->
    titleField.blur()
    isOpenKeyborad = false
    if isOpenDtPicker
      window.remove dtPicker
      isOpenDtPicker = false
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    tableView.height = 416
    window.setRightNavButton null    
    return

  activeSwitch.addEventListener 'change', (e)->
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
    if stack.length > 0 and schedule.saved
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
