var Schedule, db, exports, ops;
db = Ti.Database.open('db');
db.execute("CREATE TABLE IF NOT EXISTS SCHEDULEDB (ID INTEGER PRIMARY KEY, TITLE TEXT, ACTIVE INTEGER, OPTIONS TEXT, UPDATED TEXT)");
ops = {
  min: 1,
  repeat: 0,
  scheme: 'http://www.googl.co.jp'
};
Schedule = (function() {
  function Schedule(title, active, updated, id, options, saved) {
    this.title = title;
    this.active = active != null ? active : 0;
    this.updated = updated != null ? updated : -1;
    this.id = id != null ? id : null;
    this.options = options != null ? options : ops;
    this.saved = saved != null ? saved : false;
  }
  Schedule.prototype.save = function() {
    if (this.id === null) {
      db.execute("INSERT INTO SCHEDULEDB (TITLE, ACTIVE, UPDATED, OPTIONS ) VALUES(?,?,?,?)", this.title, this.active, this.updated, JSON.stringify(this.options));
      this.id = db.lastInsertRowId;
    } else {
      db.execute("UPDATE SCHEDULEDB (TITLE, ACTIVE, UPDATED, OPTIONS ) VALUES(?,?,?,?)  WHERE id = ?", this.title, this.active, this.updated, JSON.stringify(this.options), this.id);
    }
    this.saved = true;
    return this;
  };
  Schedule.prototype.del = function() {
    db.execute("DELETE FROM SCHEDULEDB WHERE id = ?", this.id);
    return null;
  };
  Schedule.findAll = function(sql) {
    var results, rows;
    results = [];
    rows = db.execute(sql);
    while (rows.isValidRow()) {
      results.push({
        title: rows.fieldByName('TITLE'),
        active: rows.fieldByName('ACTIVE'),
        updated: parseInt(rows.fieldByName('UPDATED'), 10),
        options: JSON.parse(rows.fieldByName('OPTIONS')),
        id: rows.fieldByName('ID')
      });
      rows.next();
    }
    rows.close();
    return results;
  };
  Schedule.findOne = function(sql) {
    var f, rows, schedule;
    schedule = null;
    rows = db.execute(sql);
    if (rows.isValidRow()) {
      f = rows.fieldByName;
      schedule = new Schedule(f('TITLE'), f('ACTIVE'), parseInt(f('UPDATED'), 10), f('ID'), JSON.parse(f('OPTIONS')));
    }
    rows.close();
    return schedule;
  };
  Schedule.all = function() {
    return Schedule.findAll("SELECT * FROM SCHEDULEDB ORDER BY UPDATED DESC LIMIT 1000");
  };
  Schedule.findAllActive = function() {
    return Schedule.findAll("SELECT * FROM SCHEDULEDB WHERE ACTIVE > 0 ORDER BY UPDATED DESC LIMIT 60");
  };
  Schedule.findById = function(id) {
    Ti.App.Properties.setInt('lastSchedule', id);
    return Schedule.findOne("SELECT * FROM SCHEDULEDB WHERE ID = " + id);
  };
  Schedule.delAll = function() {
    db.execute("DELETE FROM SCHEDULEDB");
  };
  return Schedule;
})();
exports = {
  Schedule: Schedule
};