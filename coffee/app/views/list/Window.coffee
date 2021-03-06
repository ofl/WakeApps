# Shrotcuts

$$ = (require 'app/views/list/style').style
util = require 'app/helpers/util' 
trace = util.trace
mix = util.mix
prettyDate = util.prettyDate
dateToString = util.dateToString
timesToGo = util.timesToGo
isIpad = (require 'app/helpers/conf' ).isIpad
Schedule = require 'app/models/Schedule'

class Window  
  constructor: (app)->
    
  # Local Variables  
    service = null
  
  # UI 
    
    addBtn = Ti.UI.createButton $$.addBtn
    editBtn = Ti.UI.createButton $$.editBtn
    doneEditBtn = Ti.UI.createButton $$.doneBtn
    refreshBtn = Ti.UI.createButton $$.refreshBtn
    updateLabel = Ti.UI.createLabel $$.updateLabel 
    fs = Ti.UI.createButton $$.fs  
    
    window = Ti.UI.createWindow(mix $$.window,
      title: 'WakeApps'
      toolbar: [editBtn, fs, updateLabel, fs, refreshBtn]  
      rightNavButton: addBtn)
      
    tableView = Ti.UI.createTableView $$.tableView
    window.add tableView  
      
  # Functions  
    
    refresh = () ->
      schedules = Schedule.all()
      rows = []
      for schedule in schedules
        date = new Date(schedule.date)
        ttg = timesToGo date, schedule.repeat, schedule.active
        remain = ' ('
        if ttg < 0
          remain += '--'
          icon = $$.silverclock
        else if ttg < 3600000
          remain += '+' + Math.floor(ttg / 60000) + 'm'
          icon = $$.redclock
        else if ttg < 86400000
          remain += '+' + Math.floor(ttg / 3600000) + 'h'
          icon = $$.yellowclock
        else
          remain += '+' + Math.floor(ttg / 86400000) + 'D'
          icon = $$.aquaclock
        remain += ')'
        row = Ti.UI.createTableViewRow mix $$.tableViewRow,
          id: schedule.id
          text: schedule.text
        row.add Ti.UI.createImageView mix $$.imageView,
          image: icon      
        row.add Ti.UI.createLabel mix $$.titleLabel,
          text: schedule.title      
        if schedule.repeat > 0
          dateString = prettyDate(date, schedule.repeat) + remain
          row.add Ti.UI.createImageView($$.repeatImageView)
          row.add Ti.UI.createLabel mix $$.dateLabel,
            text: dateString
        else
          dateString = dateToString(date) + remain
          row.add Ti.UI.createLabel mix $$.dateLabel,
            left: 44
            text: dateString
        rows.push row
      tableView.setData rows
      updateLabel.text = L('root.lastUpdate') + dateToString(new Date())
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
  
    _registBackgroundService = ()->
      if service isnt null
        service.unregister()
      service = Ti.App.iOS.registerBackgroundService 
        url: 'app/helpers/background.js'
      return
  
  
    _tableViewHandler = (e)->
      schedule = Schedule.findById e.row.id
      switch e.type
        when 'click'
          if isIpad
            app.views.windowStack[1].confirm schedule
          else
            (new (require 'app/views/list/edit/Window').Window app).open schedule
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
  
  # Event Liseners
  
    tableView.addEventListener 'click' , _tableViewHandler
    tableView.addEventListener 'delete' , _tableViewHandler
    
    addBtn.addEventListener 'click', (e) -> 
      schedule = new Schedule(L('root.newschedule'))
      showMessage L('root.newschedule')
      if isIpad      
        app.views.windowStack[1].refresh schedule
      else
        (new (require 'app/views/list/edit/Window').Window app).open schedule
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
      _registBackgroundService()
      if e.userInfo.scheme isnt ''
        Ti.Platform.openURL e.userInfo.scheme
      return
  
    window.addEventListener 'open', _registBackgroundService    
    Ti.App.addEventListener 'resume', _registBackgroundService
  
   # Disclose
  
    @window = window
    @refresh = refresh
    @confirm = confirm
    @showMessage = showMessage

exports.Window = Window