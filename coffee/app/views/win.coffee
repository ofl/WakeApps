createWindow = () ->
#   グローバル変数をローカル変数に代入。
  Schedule = app.models.Schedule
  mix = app.helpers.util.mix
  trace = app.helpers.util.trace
  $$ = app.helpers.style.views.root
  isiPad = app.properties.isiPad
    
  addBtn = Ti.UI.createButton $$.addBtn
  editBtn = Ti.UI.createButton $$.editBtn
  editDoneBtn = Ti.UI.createButton $$.doneBtn
  fs = Ti.UI.createButton $$.fs
  
  window = Ti.UI.createWindow mix $$.window,
    toolbar: [editBtn, fs]
  
  tableView = Ti.UI.createTableView $$.tableView
  
  window.setRightNavButton addBtn  
  if !isiPad  
    doneBtn = Ti.UI.createButton $$.doneBtn
    window.setLeftNavButton doneBtn  
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
    window.title = 'Templates'
    return

  _tableViewHandler = (e)->
    switch e.type
      when 'click'
        Ti.App.fireEvent 'root.updateWindow', id: e.row.id
        if isiPad
          Ti.App.fireEvent 'root.closeMasterNavigationGroup'    
        else
          window.close()
      when 'delete'
        schedule = Schedule.findById e.row.id
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
      when 'move'
        data = Schedule.findById e.row.id
        data.move e.index + 1
    return

  tableView.addEventListener 'click' , _tableViewHandler
  tableView.addEventListener 'delete' , _tableViewHandler
  tableView.addEventListener 'move' , _tableViewHandler
  
  addBtn.addEventListener 'click', (e) -> 
#   addBtnをクリックすると新規作成
    Ti.App.fireEvent 'root.updateWindow', id: null
    if !isiPad
      window.close()
    else
      Ti.App.fireEvent 'root.closeMasterNavigationGroup'    
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
    
  if !isiPad
    doneBtn.addEventListener 'click', (e) -> 
      window.close()
      return

  window.refresh = refresh

  Ti.App.addEventListener 'list.refresh', (e)->
    refresh()
    
  return window

          
exports.win = 
  open: () ->
    trace = app.helpers.util.trace
    window = createWindow()
    window.refresh()
    
    if app.properties.isiPad
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
          # e.button.title = "Templates"
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
      tab = Ti.UI.createTab
        window: window    
      tabGroup = Ti.UI.createTabGroup()
      tabGroup.addTab tab
      tabGroup.open()
    return

 