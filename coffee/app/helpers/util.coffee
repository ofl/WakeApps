dateformat = (format, date = null) ->
  dateFormat = new app.lib.DateFormat(format)
  d = if date is null then new Date() else date
  dateFormat.format d

week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

exports = 

#デバッグ用及びメモリの使用量を確認 
  trace: (message) ->
    Ti.API.info message
    Ti.API.info "Available memory: " + Ti.Platform.availableMemory
    return

#オブジェクトを結合。例) mix({color:'#000', height:100}, {width:50, top:10})
  mix: () ->
    child = {}
    for arg in arguments
      for prop of arg
        if arg.hasOwnProperty prop
          child[prop] = arg[prop]
    return child
    
  dateToString: (date) ->
    text = '' + date.getFullYear() + '/'
    m = date.getMonth() + 1
    text += (if m > 9 then m else '0' + m) + '/'
    text += (if date.getDate() > 9 then date.getDate() else '0' + date.getDate()) + ' '
    text += (if date.getHours() > 9 then date.getHours() else '0' + date.getHours()) + ':'
    text += (if date.getMinutes() > 9 then date.getMinutes() else '0' + date.getMinutes())
    return text
    
  prettyDate: (date, repeat) ->
    text = (if date.getHours() > 9 then date.getHours() else '0' + date.getHours()) + ':'
    text += (if date.getMinutes() > 9 then date.getMinutes() else '0' + date.getMinutes())
    if repeat is 1
      text += ' every Day'
    else if repeat is 2
      text += ' on every ' + week[date.getDay()] 
    else
      d = date.getDate()
      if date.getDate() is 1
        d += 'st'
      else if date.getDate() is 2
        d += 'nd'
      else if date.getDate() is 3
        d += 'rd'
      else
        d += 'th'        
      if repeat is 3
        text += ' on ' + d + ' every Month' 
      if repeat is 4
        text += ' on ' + d + ' every ' + months[date.getMonth()]      
    return text      

  dateformat : dateformat
  