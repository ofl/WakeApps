createWindow = () ->
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  trace = app.helpers.util.trace
  $$ = app.helpers.style.views.edit
  
  repeats = app.properties.repeats
  data = null
  lastTitle = null
  lastScheme = null  
        
  window = Ti.UI.createWindow $$.window
  tableView = Ti.UI.createTableView mix $$.tableView
  window.add tableView
  
  isOpenKeyborad = false
  isOpenPicker = false
  isOpenCdPicker = false

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
  
  minRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Time'
    hasChild: true
  repeatRow = Ti.UI.createTableViewRow mix $$.tableViewRow,
    header: 'Repeat'    
    hasChild: true
    
  rows = [titleRow, schemeRow, activeRow, minRow, repeatRow]
  
  cdPicker = Ti.UI.createPicker $$.cdPicker    
  picker = Ti.UI.createPicker $$.picker
  do ()->
    choice = []
    for repeat in repeats
      choice.push Ti.UI.createPickerRow
        title: repeat
    picker.add choice
    
  tableView.setData rows
  
  refresh = (data)->
    activeSwitch.value = data.active
    window.title =  data.title or 'Schedule'
    lastTitle = data.title
    lastScheme = data.options.scheme
    schemeRow.title = data.options.scheme
    titleField.value = data.title
    minRow.title = '' + data.options.min + 'min'
    repeatRow.title = repeats[data.options.repeat]

  minRow.addEventListener 'click' , ()->
    window.setRightNavButton doneBtn    
    titleField.blur()
    isOpenKeyborad = false
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    window.add cdPicker
    isOpenCdPicker = true
    tableView.height = 200
    return
  repeatRow.addEventListener 'click' , ()->
    window.setRightNavButton doneBtn    
    titleField.blur()
    isOpenKeyborad = false
    if isOpenCdPicker
      window.remove cdPicker
      isOpenCdPicker = false
    window.add picker
    isOpenPicker = true
    tableView.height = 200
    return
  cdPicker.addEventListener 'change' , (e)->
    minutes = e.value.getDate() * 1440 + e.value.getHours() * 60 + e.value.getMinutes() - 43181
    minRow.title = '' + minutes + 'min'
    data.options.min = minutes
    data.save()
    return
  picker.addEventListener 'change' , (e)->
    repeatRow.title = repeats[e.rowIndex]
    data.repeat = e.rowIndex
    data.save()
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
    if isOpenCdPicker
      window.remove cdPicker
      isOpenCdPicker = false
    # tableView.height = 200
    return

  schemeField.addEventListener 'return' , ()->
    minRow.fireEvent 'click'
    return  
  schemeField.addEventListener 'focus' , ()->
    window.setRightNavButton doneBtn    
    isOpenKeyborad = true
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    if isOpenCdPicker
      window.remove cdPicker
      isOpenCdPicker = false
    # tableView.height = 200
    return

  doneBtn.addEventListener 'click' , ()->
    titleField.blur()
    isOpenKeyborad = false
    if isOpenCdPicker
      window.remove cdPicker
      isOpenCdPicker = false
    if isOpenPicker
      window.remove picker
      isOpenPicker = false
    tableView.height = 416
    window.setRightNavButton null    
    return

  activeSwitch.addEventListener 'change', (e)->
    data.active = e.value
    data.save()
  
  window.addEventListener 'open' , ()->
    setTimeout titleField.focus, 300
    return
  
  window.addEventListener 'close' , ()->
    if lastTitle isnt titleField.value
      data.title = titleField.value
      data.save()
    stack = app.views.windowStack
    if stack.length > 0 and data.saved
      stack[stack.length - 1].refresh data
    return
    
  window.refresh = refresh  
  
  return window
          
exports.win = 
  open: (data) ->
    trace = app.helpers.util.trace    
    window = createWindow()
    window.refresh data
    window.open modal:true
    return
  createWindow: createWindow
