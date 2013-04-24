# * * * * * * * * *
# *  infinity.js  *
# * Version  0.02 *
# * License:  MIT *
# * SimonWaldherr *
# * * * * * * * * *

infinityAjax = (element, url, json, callback) ->
  "use strict"
  ajax = undefined
  ajaxTimeout = undefined
  requrl = undefined
  postdata = undefined
  starttime = undefined
  endtime = undefined
  keyArray = undefined
  i = undefined
  postdata = ""
  starttime = new Date()
  ajax = (if (window.ActiveXObject) then new ActiveXObject("Microsoft.XMLHTTP") else (XMLHttpRequest and new XMLHttpRequest()) or null)
  ajaxTimeout = window.setTimeout(->
    ajax.abort()
  , 6000)
  ajax.onreadystatechange = ->
    if ajax.readyState is 4
      if ajax.status is 200
        clearTimeout ajaxTimeout
        endtime = new Date()
        if ajax.status isnt 200
          callback
            element: element
            response: {}
            duration: (endtime.getTime() - starttime.getTime())
            status: false

        else
          callback
            element: element
            response: JSON.parse(ajax.responseText)
            duration: (endtime.getTime() - starttime.getTime())
            status: true

          infinityAfterAjax()  if typeof infinityAfterAjax is "function"

  keyArray = Object.keys(json)
  i = 0
  while i < keyArray.length
    postdata += "&"  if i isnt 0
    postdata += keyArray[i] + "=" + json[keyArray[i]]
    i++
  requrl = (if (url.indexOf("?") isnt -1) then url + "&rt=" + starttime.getTime() else url + "?rt=" + starttime.getTime())
  ajax.open "POST", requrl, true
  ajax.setRequestHeader "Content-type", "application/x-www-form-urlencoded"
  ajax.send postdata

Object::infinityFirst = (callback) ->
  "use strict"
  target = undefined
  event = document.createEvent("Event")
  newdiv = undefined
  infinityAjax this, @getAttribute("data-url"),
    height: @offsetHeight
  , (json) ->
    newdiv = document.createElement("div")
    json.element.setAttribute "data-earliest", json.response.earliest
    json.element.setAttribute "data-latest", json.response.latest
    newdiv.className = json.response.classname  if json.response.classname isnt `undefined`
    newdiv.id = json.response.id  if json.response.classname isnt `undefined`
    newdiv.innerHTML = "<p class=\"distime\" data-time=\"" + json.response.date + "\">" + json.response.date + "</p><div>" + json.response.html + "</div>"
    json.element.appendChild newdiv
    callback()  if typeof callback is "function"


Object::infinityAppend = ->
  "use strict"
  target = undefined
  event = document.createEvent("Event")
  newdiv = undefined
  infinityAjax this, @getAttribute("data-url"),
    latest: @getAttribute("data-earliest")
  , (json) ->
    newdiv = document.createElement("div")
    json.element.setAttribute "data-latest", json.response.latest
    newdiv.className = json.response.classname  if json.response.classname isnt `undefined`
    newdiv.id = json.response.id  if json.response.classname isnt `undefined`
    newdiv.innerHTML = "<p class=\"distime\" data-time=\"" + json.response.date + "\">" + json.response.date + "</p><div>" + json.response.html + "</div>"
    json.element.appendChild newdiv


Object::infinityPrepend = ->
  "use strict"
  target = undefined
  event = document.createEvent("Event")
  height = undefined
  oldHeight = undefined
  yPos = undefined
  i = undefined
  newdiv = undefined
  infinityAjax this, @getAttribute("data-url"),
    earliest: @getAttribute("data-earliest")
  , (json) ->
    newdiv = document.createElement("div")
    json.element.setAttribute "data-earliest", json.response.earliest
    newdiv.className = json.response.classname  if json.response.classname isnt `undefined`
    newdiv.id = json.response.id  if json.response.classname isnt `undefined`
    newdiv.innerHTML = "<p class=\"distime\" data-time=\"" + json.response.date + "\">" + json.response.date + "</p><div>" + json.response.html + "</div>"
    height = 0
    oldHeight = 0
    yPos = json.element.scrollTop
    i = 0
    while i < json.element.children.length
      oldHeight += json.element.children[i].clientHeight
      i++
    json.element.insertBefore newdiv, json.element.firstChild
    height = 0
    i = 0
    while i < json.element.children.length
      height += json.element.children[i].clientHeight
      i++
    json.element.scrollTop = (yPos + height - oldHeight)


reloadOnScroll = (ele) ->
  "use strict"
  yPos = ele.scrollTop
  height = 0
  oldHeight = undefined
  i = undefined
  i = 0
  while i < ele.children.length
    height += ele.children[i].clientHeight
    i++
  return false  if document.body.getAttribute("data-scrolling") is "true"
  if yPos < (ele.parentNode.clientHeight / 2)
    oldHeight = height
    ele.infinityPrepend()
    return true
  if yPos > height - ele.parentNode.clientHeight - (ele.parentNode.clientHeight / 2)
    ele.infinityAppend()
    return true
  false

Object::infinityinit = ->
  "use strict"
  target = undefined
  ele = this
  ele.onscroll = ->
    event = document.createEvent("Event")
    returnvalue = false
    returnvalue = reloadOnScroll(ele)
    if returnvalue isnt false
      ele.setAttribute "data-newdate", returnvalue
      unless event
        event.initEvent "infinity", false, false
        event.target = ele
        ele.dispatchEvent event
      else
        event.initEvent "infinity", false, false
        target = event.srcElement or event.target
        target = ele
        ele.dispatchEvent event
