class SplitWindow
  Schedule = require 'app/models/Schedule'
  id = Ti.App.Properties.getInt 'lastSchedule'    
  schedule = null
  if id
    schedule = Schedule.findById id
  if schedule is null
    schedule = new Schedule(L('root.newschedule'))
    
  window = createWindow windowStack
  windowStack.push window      
  window.refresh()      

    
  detailWindow = (require 'app/views/edit/win').win.createWindow windowStack
  windowStack.push detailWindow
  detailWindow.refresh schedule
  
  detailNavigationGroup = Ti.UI.iPhone.createNavigationGroup
    window: detailWindow
  masterNavigationGroup = Ti.UI.iPhone.createNavigationGroup
    window: window
    
  splitwin = Ti.UI.iPad.createSplitWindow
    showMasterInPortrait: true
    detailView: detailNavigationGroup
    masterView: masterNavigationGroup
    
  splitwin.open()   

  @view: Ti.UI.iPad.createSplitWindow
    showMasterInPortrait: true
    detailView: detailNavigationGroup
    masterView: masterNavigationGroup