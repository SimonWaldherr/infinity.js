# * * * * * * * * *
# *  infinity.js  *
# * Version 0.3.0 *
# * License:  MIT *
# * SimonWaldherr *
# * * * * * * * * *

#jslint browser: true, plusplus: true, indent: 2 

#global ActiveXObject, window, infinityAfterAjax 
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
  element.setAttribute "data-loading", "true"
  ajax.open "POST", requrl, true
  ajax.setRequestHeader "Content-type", "application/x-www-form-urlencoded"
  ajax.send postdata

Object::infinityFirst = (callback) ->
  "use strict"
  newdiv = undefined
  i = undefined
  infinityAjax this, @getAttribute("data-url"),
    height: @offsetHeight
  , (json) ->
    newdiv = document.createElement("div")
    json.element.setAttribute "data-earliest", json.response.earliest
    json.element.setAttribute "data-latest", json.response.latest
    newdiv.className = json.response.classname  if json.response.classname isnt `undefined`
    newdiv.id = json.response.id  if json.response.id isnt `undefined`
    if json.response.itemscount isnt 1
      i = 0
      while i < json.response.itemscount
        newdiv = document.createElement("div")
        newdiv.className = json.response.items[i].classname  if json.response.items[i].classname isnt `undefined`
        newdiv.id = json.response.items[i].id  if json.response.items[i].id isnt `undefined`
        newdiv.innerHTML = "<p class=\"distime\" data-time=\"" + json.response.items[i].date + "\">" + json.response.items[i].date + "</p><div>" + json.response.items[i].html + "</div>"
        json.element.appendChild newdiv
        i++
    else
      newdiv.innerHTML = "<p class=\"distime\" data-time=\"" + json.response.date + "\">" + json.response.date + "</p><div>" + json.response.html + "</div>"
      json.element.appendChild newdiv
    json.element.setAttribute "data-loading", "false"
    callback()  if typeof callback is "function"


Object::infinityAppend = ->
  "use strict"
  newdiv = undefined
  infinityAjax this, @getAttribute("data-url"),
    latest: @getAttribute("data-latest")
  , (json) ->
    newdiv = document.createElement("div")
    json.element.setAttribute "data-latest", json.response.latest
    newdiv.className = json.response.classname  if json.response.classname isnt `undefined`
    newdiv.id = json.response.id  if json.response.classname isnt `undefined`
    newdiv.innerHTML = "<p class=\"distime\" data-time=\"" + json.response.date + "\">" + json.response.date + "</p><div>" + json.response.html + "</div>"
    json.element.appendChild newdiv
    json.element.setAttribute "data-loading", "false"


Object::infinityPrepend = ->
  "use strict"
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
    json.element.setAttribute "data-loading", "false"
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
  i = undefined
  i = 0
  while i < ele.children.length
    height += ele.children[i].clientHeight
    i++
  return false  if (document.body.getAttribute("data-scrolling") is "true") or (ele.getAttribute("data-loading") is "true")
  if yPos < (ele.parentNode.clientHeight / 2)
    ele.infinityPrepend()
    return true
  if yPos > height - ele.parentNode.clientHeight - (ele.parentNode.clientHeight / 2)
    ele.infinityAppend()
    return true
  false

Object::infinityinit = ->
  "use strict"
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
        ele.dispatchEvent event
