dateformat = (format, date = null) ->
  dateFormat = new app.lib.DateFormat(format)
  d = if date is null then new Date() else date
  dateFormat.format d

escapeHTML = (string)->
  string.replace /[&<>\n]/g, (m)->
    {"&":"&amp;","<":"&lt;",">":"&gt;","\n":"<br>"}[m]

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

  escapeHTML: escapeHTML

  toHTML: (template = '', data)->
    html = ''
    keys = template.match(/<@.+?>/g) #['<@text:1>', '<@select:a,b,c>']
    if keys and keys.length > 0
      remain = template.split(/<@.+?>/) #key以外のdata
      for text in remain
        html += escapeHTML text
        if _i < _len-1
          arr = keys[_i].slice(2, -1).split(':')
          key = arr.shift()
          arg = arr.join(':')
          value = data[key] or ''
          itype = key.split('_')[0].toLowerCase()
          size = ''
          if itype is 'select'
            choices = arg.split ','
            if choices.length > 0
              html += "<select name='#{key}'>"
              for choice in choices
                if choice is value
                  html += "<option value='#{choice}' selected>#{choice}</option>"
                else
                  html += "<option value='#{choice}'>#{choice}</option>"
              html += "</select>"
          else if itype is 'textarea'
            if arg.match /(\d+):(\d+)/
              size = ' cols=' + RegExp.$1 + ' rows=' + RegExp.$2
            html += "<textarea name='#{key}' #{size}>#{value}</textarea>"
          else
            if arg.match /(\d+)/
              # size = ' width="' + arg + '%"'
              size = ' size=' + arg
            html += "<input type='#{itype}' name='#{key}' value='#{value}' #{size}>"
    else
      html += escapeHTML template
    return html
    
  dateToString: (date) ->
    text = '' + date.getFullYear() + '/'
    m = date.getMonth() + 1
    text += (if m > 9 then m else '0' + m) + '/'
    text += (if date.getDate() > 9 then date.getDate() else '0' + date.getDate()) + ' '
    text += (if date.getHours() > 9 then date.getHours() else '0' + date.getHours()) + ':'
    text += (if date.getMinutes() > 9 then date.getMinutes() else '0' + date.getMinutes())
    return text
    
  prettyDate: (now) ->
    timeNow = now.getTime()

    cyear = now.getFullYear()
    cmonth = now.getMonth()
    cday = now.getDate()

    deltaToday = parseInt (timeNow - (new Date(cyear, cmonth, cday)).getTime()) / 1000, 10
 
    week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

#関数を返す 
   
    (date) ->
      delta = parseInt ((timeNow - date) / 1000), 10
      d = new Date()
      d.setTime(date)
      year = d.getFullYear()
      month = d.getMonth() + 1
      day = d.getDate()
      dayOfWeek = d.getDay()    
      
      result = ''
      if delta < deltaToday
        result = 'Today'
      else if delta < deltaToday + 86400
        result = 'Yesterday'
      else if delta < deltaToday + 518400
        result = week[dayOfWeek]
      else if date < (new Date(cyear, 0, 1)).getTime()
        result = year + '/' +month + '/' + day
      else 
        result = month + '/' + day
  
      return result

  dateformat : dateformat
  
  convert : (data, template) ->
    result = ""
    cache = {}
    keys = template.match(/<@.+?>/g) #['<@text:1>', '<@select:a,b,c>']
    if keys and keys.length > 0
      remain = template.split(/<@.+?>/) #key以外のdata
      for text, _i in remain
        result += text
        if _i < _len-1
           key = keys[_i].substring(2, keys[_i].length - 1).toLowerCase() # subject, l1
           if typeof cache[key] is 'undefined'
             cache[key] = data[key]
           result += cache[key]
    else
      result = template
