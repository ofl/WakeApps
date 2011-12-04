createWindow = (tab) ->
#   グローバル変数をローカル変数に代入。
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  trace = app.helpers.util.trace
  $$ = app.helpers.style.views.root
  isiPad = app.properties.isiPad
  
  service = null
  
  addBtn = Ti.UI.createButton $$.addBtn
  editBtn = Ti.UI.createButton $$.editBtn
  doneEditBtn = Ti.UI.createButton $$.doneBtn
  fs = Ti.UI.createButton $$.fs
  
  window = Ti.UI.createWindow mix $$.window,
    toolbar: [editBtn, fs]
  
  tableView = Ti.UI.createTableView $$.tableView
  
  window.setRightNavButton addBtn  
  window.add tableView  
    
  refresh = () ->
    schedules = Schedule.all()
    rows = []
    prettyDate = app.helpers.util.prettyDate new Date()
    for schedule in schedules
      row = Ti.UI.createTableViewRow mix $$.tableViewRow,
        id: schedule.id
        text: schedule.text
      row.add Ti.UI.createLabel mix $$.titleLabel,
        text: schedule.title      
      row.add Ti.UI.createLabel mix $$.dateLabel,
        text: prettyDate schedule.updated
      rows.push row
    tableView.setData rows
    window.title = 'Schedules'
    return

  confirm = (data)->
    dialog = Ti.UI.createAlertDialog
      title: 'Your changes have not been saved. Discard changes?'
      buttonNames: ['Save changes','Cancel']
    dialog.addEventListener 'click', (e)->
      if e.index is 0
        data.save()
        refresh()
      return        
    dialog.show()
    return    

  showMessage = (message)->
    messageWindow = Ti.UI.createWindow $$.messageWindow
    messageWindow.add Ti.UI.createView $$.messageView
    messageWindow.add Ti.UI.createLabel mix $$.messageLabel,
      text: message
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
        if isiPad
          app.views.windowStack[1].refresh schedule
        else
          app.views.edit.win.open tab, schedule
      when 'delete'
        isDeleteCurrentSchedule = if e.row.id is Ti.App.Properties.getInt 'lastSchedule' then true else false
        schedule.del()
        showMessage 'The schedule was successfully deleted.'
        if isiPad and isDeleteCurrentSchedule
          newSchedule = Schedule.findLastUpdated()
          if newSchedule is null
             newSchedule = new Schedule 'Open Google in Safari'
          app.views.windowStack[1].refresh newSchedule            
    return

  tableView.addEventListener 'click' , _tableViewHandler
  tableView.addEventListener 'delete' , _tableViewHandler
  
  addBtn.addEventListener 'click', (e) -> 
    schedule = new Schedule 'Open Google in Safari'
    showMessage 'New schedule.'
    if isiPad      
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
    window.toolbar = [editBtn, fs]    
    tableView.editing = false
    tableView.moving = false
    return

  Ti.App.iOS.addEventListener 'notification', (e)->
    trace 'Fired From Notification'
    if service isnt null
      service.unregister()
    service = Ti.App.iOS.registerBackgroundService 
      url: 'app/lib/background.js'
    
    Ti.Platform.openURL e.userInfo.scheme
    return

  window.addEventListener 'open', (e) -> 
    if service isnt null
      service.unregister()
    service = Ti.App.iOS.registerBackgroundService 
      url: 'app/lib/background.js'
    return
    
  Ti.App.addEventListener 'resume', (e) -> 
    if service isnt null
      service.unregister()
    service = Ti.App.iOS.registerBackgroundService 
      url: 'app/lib/background.js'
    return
    
  window.refresh = refresh
  window.confirm = confirm
  window.showMessage = showMessage
    
  return window

          
exports.win = 
  open: () ->
    trace = app.helpers.util.trace
    
    if app.properties.isiPad
      window = createWindow()
      app.views.windowStack.push window      
      window.refresh()
      Schedule = app.models.Schedule
      id = Ti.App.Properties.getInt 'lastSchedule'    
      schedule = null
      if id
        schedule = Schedule.findById id
      if schedule is null
        schedule = new Schedule 'Open Google in Safari'
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
        
      # splitwin.addEventListener 'visible', (e)->
        # if e.view is 'detail'
          # app.properties.isPortrait = true
          # e.button.title = "Schedules"
          # window.leftNavButton = e.button
        # else if e.view is 'master'
          # app.properties.isPortrait = false
          # window.leftNavButton = null
        # window.orientationChange app.properties.isPortrait
        # return
# 
      # Ti.App.addEventListener 'root.closeMasterNavigationGroup', (e)->
        # if app.properties.isPortrait
          # splitwin.setMasterPopupVisible false
          # splitwin.setMasterPopupVisible true
        # return
        
      splitwin.open()   
    else     
      tab = Ti.UI.createTab()      
      tab.window = createWindow tab
      app.views.windowStack.push tab.window
      tab.window.refresh()
      Ti.UI.createTabGroup({tabs:[tab]}).open()
    return

 