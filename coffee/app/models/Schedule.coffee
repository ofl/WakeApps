if !Ti.App.Properties.getInt 'dbVersion'
  Ti.API.info 'Database was installed.'
  Ti.Database.install('schedule.sqlite', '../../Caches/db.sqlite')
  Ti.App.Properties.setInt 'dbVersion', 1

db = Ti.Database.open '../../Caches/db.sqlite'
# db.execute "CREATE TABLE IF NOT EXISTS main.SCHEDULEDB (ID INTEGER PRIMARY KEY, TITLE TEXT, ACTIVE INTEGER, DATE TEXT, SCHEME TEXT, REPEAT INTEGER, OPTIONS TEXT, UPDATED TEXT)"

class Schedule
  constructor: (@title, @active = 0, @date = (new Date()).getTime(), @scheme = 'http://www.google.com', @repeat = 0, @sound = 0, @options = {}, @updated = -1, @id = null) ->
    Ti.App.Properties.removeProperty 'lastSchedule'
        
  save: () ->
    now = (new Date()).getTime()
    if @id is null
      db.execute "INSERT INTO main.SCHEDULEDB (TITLE, ACTIVE, DATE, SCHEME, REPEAT, SOUND, UPDATED, OPTIONS ) VALUES(?,?,?,?,?,?,?,?)", @title, @active, @date, @scheme, @repeat, @sound, now, JSON.stringify(@options)
      @id = db.lastInsertRowId
    else
      db.execute "UPDATE main.SCHEDULEDB SET TITLE = ?,ACTIVE = ? ,DATE = ? ,SCHEME = ? ,REPEAT = ? ,SOUND = ? ,UPDATED = ? ,OPTIONS = ?  WHERE id = ?", @title, @active, @date, @scheme, @repeat, @sound, now, JSON.stringify(@options), @id
    Ti.App.Properties.setInt 'lastSchedule',  @id
    return this
    
  del: () ->
    if @id isnt null
      db.execute "DELETE FROM main.SCHEDULEDB WHERE id = ?", @id
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
        sound: rows.fieldByName('SOUND')
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
      schedule = new Schedule f('TITLE'), f('ACTIVE'), parseInt(f('DATE'), 10), f('SCHEME'), f('REPEAT'), f('SOUND'), JSON.parse(f('OPTIONS')), parseInt(f('UPDATED'), 10), f('ID')
      Ti.App.Properties.setInt 'lastSchedule',  f('ID')
    rows.close()    
    return schedule    
    
  @count: (sql) ->
    rows = db.execute sql
    count = rows.rowCount
    rows.close()    
    return count
    
  @all: () ->
    Schedule.findAll "SELECT * FROM main.SCHEDULEDB ORDER BY UPDATED DESC LIMIT 1000"
    
  @findAllActive: () ->
    Schedule.findAll "SELECT * FROM main.SCHEDULEDB WHERE ACTIVE > 0 ORDER BY UPDATED DESC LIMIT 60"

  @countAllActive: () ->
    Schedule.count "SELECT ID FROM main.SCHEDULEDB WHERE ACTIVE > 0"
    
  @findById: (id) ->
    Schedule.findOne "SELECT * FROM main.SCHEDULEDB WHERE ID = #{id}"
    
  @findLastUpdated: () ->
    Schedule.findOne "SELECT * FROM main.SCHEDULEDB  ORDER BY UPDATED"
    
  @delAll: () ->
    db.execute "DELETE FROM main.SCHEDULEDB"
    return
    
exports = 
  Schedule: Schedule

