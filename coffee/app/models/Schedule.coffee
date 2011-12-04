db = Ti.Database.open 'db'
db.execute "CREATE TABLE IF NOT EXISTS SCHEDULEDB (ID INTEGER PRIMARY KEY, TITLE TEXT, ACTIVE INTEGER, DATE TEXT, SCHEME TEXT, REPEAT INTEGER, OPTIONS TEXT, UPDATED TEXT)"
# getNow = ()-> 
  # d = (new Date()).getTime()
  # return d - (d % 60000)

class Schedule
#   itype -1, history 0, timer 1, favorite 2,  folder 3 
  constructor: (@title, @active = 0, @updated = -1, @id = null, @date = (new Date()).getTime(), @scheme = 'http://www.google.com', @repeat = 0, @options = {}) ->
    Ti.App.Properties.removeProperty 'lastSchedule'
        
  save: () ->
    now = (new Date()).getTime()
    if @id is null
      db.execute "INSERT INTO SCHEDULEDB (TITLE, ACTIVE, DATE, SCHEME, REPEAT, UPDATED, OPTIONS ) VALUES(?,?,?,?,?,?,?)", @title, @active, @date, @scheme, @repeat, now, JSON.stringify(@options)
      @id = db.lastInsertRowId
    else
      db.execute "UPDATE SCHEDULEDB SET TITLE = ?,ACTIVE = ? ,DATE = ? ,SCHEME = ? ,REPEAT = ? ,UPDATED = ? ,OPTIONS = ?  WHERE id = ?", @title, @active, @date, @scheme, @repeat, now, JSON.stringify(@options), @id
    Ti.App.Properties.setInt 'lastSchedule',  @id
    return this
    
  del: () ->
    if @id isnt null
      db.execute "DELETE FROM SCHEDULEDB WHERE id = ?", @id
    return null
    
  @findAll: (sql) ->
    results = []
    rows = db.execute sql    
    while rows.isValidRow()
      results.push
        title: rows.fieldByName('TITLE')
        active: rows.fieldByName('ACTIVE')
        date: parseInt(rows.fieldByName('DATE'), 10)
        scheme: rows.fieldByName('SCHEME')
        repeat: rows.fieldByName('REPEAT')
        updated: parseInt(rows.fieldByName('UPDATED'), 10)
        id: rows.fieldByName('ID')
      rows.next()
    rows.close()    
    return results
    
  @findOne: (sql) ->
    schedule = null
    rows = db.execute sql
    
    if rows.isValidRow()      
      f = rows.fieldByName
      schedule = new Schedule f('TITLE'), f('ACTIVE'), parseInt(f('UPDATED'), 10), f('ID'), parseInt(f('DATE'), 10), f('SCHEME'), f('REPEAT'), JSON.parse(f('OPTIONS'))
      Ti.App.Properties.setInt 'lastSchedule',  f('ID')
    rows.close()    
    return schedule    
    
  @count: (sql) ->
    rows = db.execute sql
    count = rows.rowCount
    rows.close()    
    return count
    
  @all: () ->
    Schedule.findAll "SELECT * FROM SCHEDULEDB ORDER BY UPDATED DESC LIMIT 1000"
    
  @findAllActive: () ->
    Schedule.findAll "SELECT * FROM SCHEDULEDB WHERE ACTIVE > 0 ORDER BY UPDATED DESC LIMIT 60"

  @countAllActive: () ->
    Schedule.count "SELECT ID FROM SCHEDULEDB WHERE ACTIVE > 0"
    
  @findById: (id) ->
    Schedule.findOne "SELECT * FROM SCHEDULEDB WHERE ID = #{id}"
    
  @findLastUpdated: () ->
    Schedule.findOne "SELECT * FROM SCHEDULEDB  ORDER BY UPDATED"
    
  @delAll: () ->
    db.execute "DELETE FROM SCHEDULEDB"
    return
    
exports = 
  Schedule: Schedule

