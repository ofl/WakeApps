var TabGroup;
TabGroup = (function() {
  function TabGroup(app) {
    var tab, tabGroup, window;
    app.views = {};
    app.views.windowStack = [];
    window = new (require('app/views/list/Window')).Window(app);
    window.refresh();
    tab = Ti.UI.createTab({
      window: window.window
    });
    app.views.windowStack.push(window);
    app.views.tab = tab;
    tabGroup = Ti.UI.createTabGroup({
      tabs: [tab]
    });
    this.open = function() {
      tabGroup.open();
    };
  }
  return TabGroup;
})();
exports.TabGroup = TabGroup;