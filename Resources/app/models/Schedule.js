var Schedule, db, exports;
db = Ti.Database.open('db');
db.execute("CREATE TABLE IF NOT EXISTS SCHEDULEDB (ID INTEGER PRIMARY KEY, TITLE TEXT, ACTIVE INTEGER, DATE TEXT, SCHEME TEXT, REPEAT INTEGER, OPTIONS TEXT, UPDATED TEXT)");
Schedule = (function() {
  function Schedule(title, active, updated, id, date, scheme, repeat, options, saved) {
    this.title = title;
    this.active = active != null ? active : 0;
    this.updated = updated != null ? updated : -1;
    this.id = id != null ? id : null;
    this.date = date != null ? date : (new Date()).getTime();
    this.scheme = scheme != null ? scheme : 'http://www.google.com';
    this.repeat = repeat != null ? repeat : 0;
    this.options = options != null ? options : {};
    this.saved = saved != null ? saved : false;
  }
  Schedule.prototype.save = function() {
    var now;
    now = (new Date()).getTime();
    if (this.id === null) {
      db.execute("INSERT INTO SCHEDULEDB (TITLE, ACTIVE, DATE, SCHEME, REPEAT, UPDATED, OPTIONS ) VALUES(?,?,?,?,?,?,?)", this.title, this.active, this.date, this.scheme, this.repeat, now, JSON.stringify(this.options));
      this.id = db.lastInsertRowId;
    } else {
      db.execute("UPDATE SCHEDULEDB SET TITLE = ?,ACTIVE = ? ,DATE = ? ,SCHEME = ? ,REPEAT = ? ,UPDATED = ? ,OPTIONS = ?  WHERE id = ?", this.title, this.active, this.date, this.scheme, this.repeat, now, JSON.stringify(this.options), this.id);
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
        date: parseInt(rows.fieldByName('DATE'), 10),
        scheme: rows.fieldByName('SCHEME'),
        repeat: rows.fieldByName('REPEAT'),
        updated: parseInt(rows.fieldByName('UPDATED'), 10),
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
      schedule = new Schedule(f('TITLE'), f('ACTIVE'), parseInt(f('UPDATED'), 10), f('ID'), parseInt(f('DATE'), 10), f('SCHEME'), f('REPEAT'), JSON.parse(f('OPTIONS')));
    }
    rows.close();
    return schedule;
  };
  Schedule.count = function(sql) {
    var count, rows;
    rows = db.execute(sql);
    count = rows.rowCount;
    rows.close();
    return count;
  };
  Schedule.all = function() {
    return Schedule.findAll("SELECT * FROM SCHEDULEDB ORDER BY UPDATED DESC LIMIT 1000");
  };
  Schedule.findAllActive = function() {
    return Schedule.findAll("SELECT * FROM SCHEDULEDB WHERE ACTIVE > 0 ORDER BY UPDATED DESC LIMIT 60");
  };
  Schedule.countAllActive = function() {
    return Schedule.count("SELECT ID FROM SCHEDULEDB WHERE ACTIVE > 0");
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