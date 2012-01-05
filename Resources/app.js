(function() {
  var app, isIpad;
  app = {};
  isIpad = (require('app/helpers/conf')).isIpad;
  if (isIpad) {
    return (new (require('app/views/SplitWindow')).SplitWindow(app)).open();
  } else {
    return (new (require('app/views/TabGroup')).TabGroup(app)).open();
  }
})();