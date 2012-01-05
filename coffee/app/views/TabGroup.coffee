class TabGroup
  constructor: (app)->    
    app.views = {}
    app.views.windowStack = []
    
    window = new (require 'app/views/list/Window').Window app
    window.refresh()
    
    tab = Ti.UI.createTab
      window: window.window
     
    app.views.windowStack.push window
    app.views.tab = tab
    
    tabGroup = Ti.UI.createTabGroup({tabs:[tab]})               
    
    @open = ()->
      tabGroup.open()   
      return 
    
exports.TabGroup = TabGroup
