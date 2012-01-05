var SplitWindow;
SplitWindow = (function() {
  function SplitWindow(app) {
    var Schedule, detailNavigationGroup, editWindow, id, listWindow, masterNavigationGroup, schedule, splitwindow;
    app.views = {};
    app.views.windowStack = [];
    Schedule = require('app/models/Schedule');
    id = Ti.App.Properties.getInt('lastSchedule');
    schedule = null;
    if (id) {
      schedule = Schedule.findById(id);
    }
    if (schedule === null) {
      schedule = new Schedule(L('root.newschedule'));
    }
    listWindow = new (require('app/views/list/Window')).Window(app);
    app.views.windowStack.push(listWindow);
    listWindow.refresh();
    editWindow = new (require('app/views/list/edit/Window')).Window(app);
    app.views.windowStack.push(editWindow);
    editWindow.refresh(schedule);
    detailNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
      window: editWindow.window
    });
    masterNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
      window: listWindow.window
    });
    splitwindow = Ti.UI.iPad.createSplitWindow({
      showMasterInPortrait: true,
      detailView: detailNavigationGroup,
      masterView: masterNavigationGroup
    });
    this.open = function() {
      splitwindow.open();
    };
  }
  return SplitWindow;
})();
exports.SplitWindow = SplitWindow;