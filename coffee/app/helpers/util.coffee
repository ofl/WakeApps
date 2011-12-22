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
    text = '' + date.getFullYear() + '-'
    m = date.getMonth() + 1
    text += (if m > 9 then m else '0' + m) + '-'
    text += (if date.getDate() > 9 then date.getDate() else '0' + date.getDate()) + ' '
    text += (if date.getHours() > 9 then date.getHours() else '0' + date.getHours()) + ':'
    text += (if date.getMinutes() > 9 then date.getMinutes() else '0' + date.getMinutes()) + ':00'
    return text
    
  timesToGo: (date, repeat, active) ->
    if active > 0
      now = new Date()
      nowGetTime = now.getTime()
      d = date.getTime()
      milliSec = d - nowGetTime
      if milliSec < 0 and repeat > 0
        if repeat is 1
          milliSec = (date.getHours() - now.getHours()) * 3600000 + (date.getMinutes() - now.getMinutes()) * 60000
          if milliSec < 0
            milliSec = 86400000 +  milliSec
        if repeat is 2
          days = (date.getDay() - now.getDay()) * 86400000
          if days < 0
            milliSec = 604800000 +  days
        if repeat is 3
          month = now.getMonths()
          year = now.getFullYear()
          if month < 11
            month += 1
          else
            month = 0
            year += 1
          newDate = new Date(year, month, date.getDate(), date.getHours(), date.getMinutes(), 0)
          if newDate.getMonths() isnt month
            newDate = new Date(year, month + 1, date.getDate(), date.getHours(), date.getMinutes(), 0)
          milliSec = newDate.getTime() - nowGetTime
        if repeat is 4
          month = date.getMonths()
          year = now.getFullYear() + 1
          newDate = new Date(year, month, date.getDate(), date.getHours(), date.getMinutes(), 0)
          if newDate.getMonths() isnt month
            newDate = new Date(year, month + 1, date.getDate(), date.getHours(), date.getMinutes(), 0)
          milliSec = newDate.getTime() - nowGetTime
    else
      milliSec = -1
    return milliSec
    
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
