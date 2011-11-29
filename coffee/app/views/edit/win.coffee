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
  schemeRow = Ti.UI.createTableViewRow $$.tableViewRow
  schemeField = Ti.UI.createTextField $$.textField
  schemeRow.add schemeField
  activeRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    title: 'Active'
  activeSwitch = Ti.UI.createSwitch $$.switches
  activeRow.add activeSwitch
  
  dateRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Date'
    hasChild: true
  repeatRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Repeat'    
    hasChild: true
    
  rows = [titleRow, schemeRow, activeRow, dateRow, repeatRow]
  
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
    lastScheme = data.options.scheme
    schemeField.value = data.options.scheme
    titleField.value = data.title
    date = data.options.date
    if date is null
      date = dateToString(new Date())
    dateRow.title = '' + date
    repeatRow.title = repeats[data.options.repeat]
    return

  dateRow.addEventListener 'click' , ()->
    window.setRightNavButton doneBtn    
    titleField.blur()
    isOpenKeyborad = false
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    if schedule.options.date is null
      dtPicker.value = new Date()
    else
      dtPicker.value = new Date(schedule.options.date)
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
    picker.setSelectedRow 0, schedule.options.repeat
    window.add picker
    isOpenPicker = true
    tableView.height = 200
    return
  dtPicker.addEventListener 'change' , (e)->
    date = dateToString e.value
    dateRow.title = date
    schedule.options.date = date
    schedule.save()
    return
  picker.addEventListener 'change' , (e)->
    repeatRow.title = repeats[e.rowIndex]
    schedule.options.repeat = e.rowIndex
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
    schedule.active = if e.value then 1 else 0
    schedule.save()
  
  window.addEventListener 'close' , ()->
    if lastTitle isnt titleField.value
      schedule.title = titleField.value
      schedule.save()
    stack = app.views.windowStack
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
