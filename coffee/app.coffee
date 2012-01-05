do ->
  app = {}
  (new (require 'app/views/TabGroup').TabGroup(app)).open()
