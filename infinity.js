/* * * * * * * * *
 *  infinity.js  *
 * Version 0.3.0 *
 * License:  MIT *
 * SimonWaldherr *
 * * * * * * * * */

/*jslint browser: true, plusplus: true, indent: 2 */
/*global ActiveXObject, window, infinityAfterAjax */

var infinityAjax = function (element, url, json, callback) {
  "use strict";
  var ajax, ajaxTimeout, requrl, postdata, starttime, endtime, keyArray, i;
  postdata = "";
  starttime = new Date();
  ajax = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
  ajaxTimeout = window.setTimeout(function () {
    ajax.abort();
  }, 6000);

  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4) {
      if (ajax.status === 200) {
        clearTimeout(ajaxTimeout);
        endtime = new Date();
        if (ajax.status !== 200) {
          callback({
            "element": element,
            "response": {},
            "duration": (endtime.getTime() - starttime.getTime()),
            "status": false
          });
        } else {
          callback({
            "element": element,
            "response": JSON.parse(ajax.responseText),
            "duration": (endtime.getTime() - starttime.getTime()),
            "status": true
          });
          if(typeof infinityAfterAjax === 'function') {
            infinityAfterAjax();
          }
        }
      }
    }
  };

  keyArray = Object.keys(json);
  for (i = 0; i < keyArray.length; i++) {
    if (i !== 0) {
      postdata += "&";
    }
    postdata += keyArray[i] + "=" + json[keyArray[i]];
  }
  requrl = (url.indexOf("?") !== -1) ? url + "&rt=" + starttime.getTime() : url + "?rt=" + starttime.getTime();
  element.setAttribute('data-loading', 'true');
  ajax.open("POST", requrl, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(postdata);
};

Object.prototype.infinityFirst = function (callback) {
  "use strict";
  var newdiv, i;

  infinityAjax(this, this.getAttribute("data-url"), {
    "height": this.offsetHeight
  }, function (json) {
    newdiv = document.createElement("div");
    json.element.setAttribute("data-earliest", json.response.earliest);
    json.element.setAttribute("data-latest", json.response.latest);
    if (json.response.classname !== undefined) {
      newdiv.className = json.response.classname;
    }
    if (json.response.id !== undefined) {
      newdiv.id = json.response.id;
    }
    if(json.response.itemscount !== 1) {
      for(i = 0; i < json.response.itemscount; i++) {
        newdiv = document.createElement("div");
        if (json.response.items[i].classname !== undefined) {
          newdiv.className = json.response.items[i].classname;
        }
        if (json.response.items[i].id !== undefined) {
          newdiv.id = json.response.items[i].id;
        }
        newdiv.innerHTML = '<p class="distime" data-time="'+json.response.items[i].date+'">'+json.response.items[i].date+'</p><div>'+json.response.items[i].html+'</div>';
        json.element.appendChild(newdiv);
      }
    } else {
      newdiv.innerHTML = '<p class="distime" data-time="'+json.response.date+'">'+json.response.date+'</p><div>'+json.response.html+'</div>';
      json.element.appendChild(newdiv);
    }
    json.element.setAttribute('data-loading', 'false');
    if(typeof callback === 'function') {
      callback();
    }
  });
};

Object.prototype.infinityAppend = function () {
  "use strict";
  var newdiv;

  infinityAjax(this, this.getAttribute("data-url"), {
    "latest": this.getAttribute("data-latest")
  }, function (json) {
    newdiv = document.createElement("div");
    json.element.setAttribute("data-latest", json.response.latest);
    if (json.response.classname !== undefined) {
      newdiv.className = json.response.classname;
    }
    if (json.response.classname !== undefined) {
      newdiv.id = json.response.id;
    }
    newdiv.innerHTML = '<p class="distime" data-time="'+json.response.date+'">'+json.response.date+'</p><div>'+json.response.html+'</div>';
    json.element.appendChild(newdiv);
    json.element.setAttribute('data-loading', 'false');
  });
};

Object.prototype.infinityPrepend = function () {
  "use strict";
  var height,
    oldHeight,
    yPos,
    i,
    newdiv;

  infinityAjax(this, this.getAttribute("data-url"), {
    "earliest": this.getAttribute("data-earliest")
  }, function (json) {
    newdiv = document.createElement("div");
    json.element.setAttribute("data-earliest", json.response.earliest);
    if (json.response.classname !== undefined) {
      newdiv.className = json.response.classname;
    }
    if (json.response.classname !== undefined) {
      newdiv.id = json.response.id;
    }
    newdiv.innerHTML = '<p class="distime" data-time="'+json.response.date+'">'+json.response.date+'</p><div>'+json.response.html+'</div>';
    height = 0;
    oldHeight = 0;
    yPos = json.element.scrollTop;
    for (i = 0; i < json.element.children.length; i++) {
      oldHeight += json.element.children[i].clientHeight;
    }
    json.element.insertBefore(newdiv, json.element.firstChild);
    json.element.setAttribute('data-loading', 'false');
    height = 0;
    for (i = 0; i < json.element.children.length; i++) {
      height += json.element.children[i].clientHeight;
    }
    json.element.scrollTop = (yPos + height - oldHeight);
  });
};

var reloadOnScroll = function (ele) {
  "use strict";
  var yPos = ele.scrollTop,
    height = 0,
    i;

  for (i = 0; i < ele.children.length; i++) {
    height += ele.children[i].clientHeight;
  }
  if ((document.body.getAttribute('data-scrolling') === 'true')||(ele.getAttribute('data-loading') === 'true')) {
    return false;
  }
  if (yPos < (ele.parentNode.clientHeight / 2)) {
    ele.infinityPrepend();
    return true;
  }
  if (yPos > height - ele.parentNode.clientHeight - (ele.parentNode.clientHeight / 2)) {
    ele.infinityAppend();
    return true;
  }
  return false;
};

Object.prototype.infinityinit = function () {
  "use strict";
  var ele = this;
  ele.onscroll = function () {
    var event = document.createEvent("Event"),
      returnvalue = false;
    returnvalue = reloadOnScroll(ele);
    if (returnvalue !== false) {
      ele.setAttribute("data-newdate", returnvalue);
      if (!event) {
        event.initEvent("infinity", false, false);
        event.target = ele;
        ele.dispatchEvent(event);
      } else {
        event.initEvent("infinity", false, false);
        ele.dispatchEvent(event);
      }
    }
  };
};
