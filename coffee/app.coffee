do ->
  app = {}
  isIpad = (require 'app/helpers/conf' ).isIpad
  if isIpad
    (new (require 'app/views/SplitWindow').SplitWindow(app)).open()
  else
    (new (require 'app/views/TabGroup').TabGroup(app)).open()
