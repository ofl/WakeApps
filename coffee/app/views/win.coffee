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
  editDoneBtn = Ti.UI.createButton $$.doneBtn
  fs = Ti.UI.createButton $$.fs
  
  window = Ti.UI.createWindow mix $$.window,
    toolbar: [editBtn, fs]
  
  tableView = Ti.UI.createTableView $$.tableView
  
  window.setRightNavButton addBtn  
  window.add tableView  
    
  refresh = (data) ->
    if data and data.saved
      Ti.App.iOS.cancelAllLocalNotifications()
      schedules = Schedule.findAllActive()
      for schedule in schedules
        if schedule.options.repeat > 0
          trace schedule.options.scheme
          trace schedule.options.repeat
          trace schedule.options.date

          
          
          Ti.App.iOS.scheduleLocalNotification
            date: new Date(schedule.options.date)
            repeat: ['none', 'daily', 'weekly', 'monthly', 'yearly'][schedule.options.repeat]
            alertBody: schedule.title
            alertAction: 'Launch!'
            sound: 'sounds/Alarm0014.wav'
            userInfo: 
              scheme: schedule.options.scheme
              repeat: schedule.options.repeat
              date: schedule.options.date
        else
          Ti.App.iOS.scheduleLocalNotification
            date: new Date(schedule.options.date)
            alertBody: schedule.title
            alertAction: 'Launch!'
            sound: 'sounds/Alarm0014.wav'
            userInfo: 
              scheme: schedule.options.scheme
              repeat: schedule.options.repeat
              date: schedule.options.date      
      
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
    saved = false
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
    window.toolbar = [editDoneBtn, fs] 
    tableView.editing = true
    tableView.moving = true
    return

  editDoneBtn.addEventListener 'click', (e) -> 
    window.setRightNavButton addBtn
    window.toolbar = [editBtn, fs]    
    tableView.editing = false
    tableView.moving = false
    return

  Ti.App.iOS.addEventListener 'notification', (e)->
    if e.userInfo.repeat < 1 and (new Date()).getTime() - 300000 > (new Date(e.userInfo.date)).getTime()
      return
    else 
      Ti.Platform.openURL e.userInfo.scheme
      return
    
  window.refresh = refresh
    
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

 