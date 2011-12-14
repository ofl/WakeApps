createWindow = (tab) ->
#   グローバル変数をローカル変数に代入。
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  trace = app.helpers.util.trace
  $$ = app.helpers.style.views.root
  isIpad = app.properties.isIpad
  prettyDate = app.helpers.util.prettyDate
  
  service = null
  
  addBtn = Ti.UI.createButton $$.addBtn
  editBtn = Ti.UI.createButton $$.editBtn
  doneEditBtn = Ti.UI.createButton $$.doneBtn
  refreshBtn = Ti.UI.createButton $$.refreshBtn
  fs = Ti.UI.createButton $$.fs
  
  window = Ti.UI.createWindow mix $$.window,
    toolbar: [editBtn, fs, refreshBtn]
  
  tableView = Ti.UI.createTableView $$.tableView
  
  window.setRightNavButton addBtn  
  window.add tableView  
  messageWindow = Ti.UI.createWindow $$.messageWindow
  messageWindow.add Ti.UI.createView $$.messageView
  messageLabel = Ti.UI.createLabel $$.messageLabel  
  messageWindow.add messageLabel
  
  refresh = () ->
    schedules = Schedule.all()
    rows = []
    now = (new Date()).getTime()
    for schedule in schedules
      date = new Date(schedule.date)
      icon = if schedule.active and (schedule.repeat or date.getTime() > now) then $$.aquaclock else $$.silverclock
      if schedule.repeat > 0
        dateString = prettyDate(date, schedule.repeat)
      else
        dateString = date.toLocaleString()
      row = Ti.UI.createTableViewRow mix $$.tableViewRow,
        id: schedule.id
        text: schedule.text
      row.add Ti.UI.createImageView mix $$.imageView,
        image: icon      
      row.add Ti.UI.createLabel mix $$.titleLabel,
        text: schedule.title      
      row.add Ti.UI.createLabel mix $$.dateLabel,
        text: dateString
      rows.push row
    tableView.setData rows
    return

  confirm = (data)->
    dialog = Ti.UI.createAlertDialog
      title: L 'root.confirm'
      buttonNames: [L('root.save'),L('root.cancel')]
    dialog.addEventListener 'click', (e)->
      if e.index is 0
        data.save()
        refresh()
      return        
    dialog.show()
    return    

  showMessage = (message)->
    messageLabel.text = message
    messageWindow.open()
     
    if Ti.Platform.osname == "iPhone OS" 
      props = mix $$.messageAnimation,
        transform: Ti.UI.create2DMatrix().translate(-200,200).scale(0) 
    else
      props = $$.messageAnimation
    messageWindow.animate props, ()->
      messageWindow.close()
      return
    return

  _tableViewHandler = (e)->
    schedule = Schedule.findById e.row.id
    switch e.type
      when 'click'
        if isIpad
          app.views.windowStack[1].confirm schedule
        else
          app.views.edit.win.open tab, schedule
      when 'delete'
        isDeleteCurrentSchedule = if e.row.id is Ti.App.Properties.getInt 'lastSchedule' then true else false
        schedule.del()
        showMessage L('root.deleted')
        if isIpad and isDeleteCurrentSchedule
          newSchedule = Schedule.findLastUpdated()
          if newSchedule is null
             newSchedule = new Schedule(L('root.newschedule'))
          app.views.windowStack[1].refresh newSchedule            
    return

  tableView.addEventListener 'click' , _tableViewHandler
  tableView.addEventListener 'delete' , _tableViewHandler
  
  addBtn.addEventListener 'click', (e) -> 
    schedule = new Schedule(L('root.newschedule'))
    showMessage L('root.newschedule')
    if isIpad      
      app.views.windowStack[1].refresh schedule
    else
      app.views.edit.win.open tab, schedule
    return

  editBtn.addEventListener 'click', (e) -> 
    window.setRightNavButton null
    window.toolbar = [doneEditBtn, fs] 
    tableView.editing = true
    tableView.moving = true
    return

  doneEditBtn.addEventListener 'click', (e) -> 
    window.setRightNavButton addBtn
    window.toolbar = [editBtn, fs, refreshBtn]    
    tableView.editing = false
    tableView.moving = false
    return

  refreshBtn.addEventListener 'click', (e) -> 
    refresh()
    showMessage L('root.refreshed')
    return

  Ti.App.iOS.addEventListener 'notification', (e)->
    trace 'Fired From Notification'
    if service isnt null
      service.unregister()
    service = Ti.App.iOS.registerBackgroundService 
      url: 'app/helpers/background.js'
    if e.userInfo.scheme isnt ''
      Ti.Platform.openURL e.userInfo.scheme
    return

  window.addEventListener 'open', (e) -> 
    if service isnt null
      service.unregister()
    service = Ti.App.iOS.registerBackgroundService 
      url: 'app/helpers/background.js'
    return
    
  Ti.App.addEventListener 'resume', (e) -> 
    if service isnt null
      service.unregister()
    service = Ti.App.iOS.registerBackgroundService 
      url: 'app/helpers/background.js'
    return
    
  window.refresh = refresh
  window.confirm = confirm
  window.showMessage = showMessage
    
  return window

          
exports.win = 
  open: () ->
    trace = app.helpers.util.trace
    
    if app.properties.isIpad
      Schedule = app.models.Schedule
      id = Ti.App.Properties.getInt 'lastSchedule'    
      schedule = null
      if id
        schedule = Schedule.findById id
      if schedule is null
        schedule = new Schedule(L('root.newschedule'))
        
      window = createWindow()
      app.views.windowStack.push window      
      window.refresh()      
        
      detailView = app.views.edit.win.createWindow()
      app.views.windowStack.push detailView
      detailView.refresh schedule
      
      detailNavigationGroup = Ti.UI.iPhone.createNavigationGroup
        window: detailView
      masterNavigationGroup = Ti.UI.iPhone.createNavigationGroup
        window: window
        
      splitwin = Ti.UI.iPad.createSplitWindow
        showMasterInPortrait: true
        detailView: detailNavigationGroup
        masterView: masterNavigationGroup
        
      splitwin.open()   
    else     
      tab = Ti.UI.createTab()      
      tab.window = createWindow tab
      app.views.windowStack.push tab.window
      tab.window.refresh()
      Ti.UI.createTabGroup({tabs:[tab]}).open()
    return

 