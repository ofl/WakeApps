db = Ti.Database.open 'db'
db.execute "CREATE TABLE IF NOT EXISTS SCHEDULEDB (ID INTEGER PRIMARY KEY, TITLE TEXT, ACTIVE INTEGER, OPTIONS TEXT, UPDATED TEXT)"
ops = 
  min: 1
  repeat: 0
  scheme: 'http://www.googl.co.jp'

class Schedule
#   itype -1, history 0, timer 1, favorite 2,  folder 3 
  constructor: (@title, @active = 0, @updated = -1, @id = null, @options = ops, @saved = false) ->    
        
  save: () ->
    if @id is null
      db.execute "INSERT INTO SCHEDULEDB (TITLE, ACTIVE, UPDATED, OPTIONS ) VALUES(?,?,?,?)", @title, @active, @updated, JSON.stringify(@options)
      @id = db.lastInsertRowId
    else
      db.execute "UPDATE SCHEDULEDB (TITLE, ACTIVE, UPDATED, OPTIONS ) VALUES(?,?,?,?)  WHERE id = ?", @title, @active, @updated, JSON.stringify(@options), @id
      # db.execute "UPDATE SCHEDULEDB SET TITLE = ?,SID = ?,PLACE = ?,ITYPE = ? ,ACTIVE = ? ,POSITION = ? ,UPDATED = ? ,OPTIONS = ?   WHERE id = ?", @title, @sid, @place, @itype, @active, @position, @updated, JSON.stringify(@options), @id
    @saved = true
    return this
    
  del: () ->
    db.execute "DELETE FROM SCHEDULEDB WHERE id = ?", @id
    return null
    
  @findAll: (sql) ->
    results = []
    rows = db.execute sql    
    while rows.isValidRow()
      results.push
        title: rows.fieldByName('TITLE')
        active: rows.fieldByName('ACTIVE')
        updated: parseInt(rows.fieldByName('UPDATED'), 10)
        options: JSON.parse(rows.fieldByName('OPTIONS'))
        id: rows.fieldByName('ID')
      rows.next()
    rows.close()    
    return results
    
  @findOne: (sql) ->
    schedule = null
    rows = db.execute sql
    
    if rows.isValidRow()      
      f = rows.fieldByName
      schedule = new Schedule f('TITLE'), f('ACTIVE'), parseInt(f('UPDATED'), 10), f('ID'), JSON.parse(f('OPTIONS'))
    rows.close()    
    return schedule    
    
  @all: () ->
    Schedule.findAll "SELECT * FROM SCHEDULEDB ORDER BY UPDATED DESC LIMIT 1000"
    
  @findAllActive: () ->
    Schedule.findAll "SELECT * FROM SCHEDULEDB WHERE ACTIVE > 0 ORDER BY UPDATED DESC LIMIT 60"
    
  @findById: (id) ->
    Ti.App.Properties.setInt 'lastSchedule',  id
    Schedule.findOne "SELECT * FROM SCHEDULEDB WHERE ID = #{id}"
    
  @delAll: () ->
    db.execute "DELETE FROM SCHEDULEDB"
    return
    
exports = 
  Schedule: Schedule

