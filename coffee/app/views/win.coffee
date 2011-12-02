createWindow = (tab) ->
#   グローバル変数をローカル変数に代入。
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  trace = app.helpers.util.trace
  $$ = app.helpers.style.views.root
  isiPad = app.properties.isiPad
  
  lastSceduledAt = null
  
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
#     カリー化
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
        Ti.App.iOS.cancelAllLocalNotifications()
        lastSceduledAt = (new Date()).getTime()
        setTimeout _setNotifications, 1000
        refresh()
      return        
    dialog.show()
    return    
    
  _setNotifications = ()->
    schedules = Schedule.findAllActive()
    now = (new Date()).getTime() - 60000
    ima = (new Date()).toLocaleString()
    for schedule in schedules
      if schedule.repeat > 0
        trace 'Scheduled repeat event'
        Ti.App.iOS.scheduleLocalNotification
          date: new Date(schedule.date)
          repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.oepeat]
          alertBody: schedule.title + ima
          alertAction: 'Launch!'
          sound: 'sounds/Alarm0014.wav'
          userInfo: 
            scheme: schedule.scheme
            title: schedule.title
            date: schedule.date
      else if schedule.date > now
        trace 'Scheduled One time event'
        Ti.App.iOS.scheduleLocalNotification
          date: new Date(schedule.date)
          alertBody: schedule.title + ima
          alertAction: 'Launch!'
          sound: 'sounds/Alarm0014.wav'
          userInfo: 
            scheme: schedule.scheme
            title: schedule.title
            date: schedule.date
    showMessage()
    return

  showMessage = ()->
    messageWindow = Ti.UI.createWindow $$.messageWindow
    messageWindow.add Ti.UI.createView $$.messageView
    messageWindow.add Ti.UI.createLabel $$.messageLabel
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
          Ti.App.fireEvent 'root.closeMasterNavigationGroup'    
        else
          app.views.edit.win.open tab, schedule
      when 'delete'
        if Ti.App.Properties.getInt('lastSchedule') is e.row.id
          nextScheduleId = null
          schedule.del ()->
            nextScheduleId = schedule.nextScheduleId()
            return
          Ti.App.fireEvent 'root.updateWindow', id: nextScheduleId
          if !nextScheduleId
            if isiPad
              Ti.App.fireEvent 'root.closeMasterNavigationGroup'    
            else
              window.close()
        else
          schedule.del()        
    return

  tableView.addEventListener 'click' , _tableViewHandler
  tableView.addEventListener 'delete' , _tableViewHandler
  
  addBtn.addEventListener 'click', (e) -> 
    schedule = new Schedule 'Open Google in Safari'
    if isiPad
      window.close()
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
    # Ti.Platform.openURL e.userInfo.scheme
    # return
    trace 'fire notification'
    now = (new Date()).getTime()
    lastSceduledAt = lastSceduledAt or now
    if now - lastSceduledAt > 3000
      Ti.Platform.openURL e.userInfo.scheme
    return
      # (Ti.Media.createSound url:"sounds/Alarm0014.wav").play()
      # dialog = Ti.UI.createAlertDialog
        # title: e.userInfo.title
        # message: 'Already past the scheduled time'
        # buttonNames: ['Launch!!','Cancel']
      # dialog.addEventListener 'click', (ev)->
        # if ev.index is 0
          # Ti.Platform.openURL e.userInfo.scheme
        # return        
      # dialog.show()
      # return
    # else 
      # Ti.Platform.openURL e.userInfo.scheme
      # return

  window.addEventListener 'open', (e) -> 
    app.properties.isActive = true
    return

  Ti.App.addEventListener 'pause', (e) -> 
    date = (new Date()).toLocaleString()
    trace 'paused' + date
    app.properties.isActive = false
    return

  Ti.App.addEventListener 'resume', (e) -> 
    date = (new Date()).toLocaleString()
    trace 'resumed' + date
    app.properties.isActive = true
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
      window.refresh()
      Schedule = app.models.Schedule
      id = Ti.App.Properties.getInt 'lastSchedule'    
      schedule = null
      if id
        schedule = Schedule.findById id
      if schedule is null
        schedule = new Schedule 'Open Google in Safari'
      detailView = app.views.edit.win.createWindow()
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

 