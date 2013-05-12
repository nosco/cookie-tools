require('extend-string');
var Cookie = require('./cookie.js');

var Cookies = function(cookiesString) {
  this.cookies = {};
  if(cookiesString !== undefined) {
    this.parse(cookiesString);
  }
};
module.exports = Cookies;

Cookies.prototype.parse = function(cookiesString) {
  var self = this;

  if(cookiesString != undefined) {
    cookiesString = cookiesString.replace(/set-cookie: /i);

    var cookieStrings = cookiesString.split(';');

    cookieStrings.forEach(function(cookieString, index) {
      var cookieParts = cookieString.split('=', 2);

      if(cookieParts.length == 2) {
        self.add({ name: cookieParts[0].trim(), value: cookieParts[1].trim()});
      }
    });
  }
}

Cookies.prototype.set = function(options) {
  if(options === undefined) { var options = {}; }

  var cookie = new Cookie(options);

  if(cookie && ( ['set', 'parse', 'prototype', 'constructor'].indexOf(cookie.name) === -1 ) ) {
    this.cookies[cookie.name] = cookie;

    //Object.defineProperty(this, cookie.name, { enumerable: false, writable: true, value: cookie });//get: function(name) { return this.cookies[name]; }, set: function() { return false; } });
    Object.defineProperty(this, cookie.name, { configurable: true, enumerable: true,
                                               get: function() { return this.cookies[cookie.name]; },
                                               set: function(newCookie) { if(newCookie instanceof Cookie) { this.cookies[cookie.name] = new Cookie(newCookie.toObject()); } }
                                             });

    return this.cookies[cookie.name];
  } else {
    return null;
  }
};
Cookies.prototype.add = Cookies.prototype.set;

//Cookies.prototype.delete = function(cookieName) {
//    delete this.cookies[cookieName];
//}
//Cookies.prototype.del = Cookies.prototype.delete;
//Cookies.prototype.rem = Cookies.prototype.delete;
//Cookies.prototype.remove = Cookies.prototype.delete;

Cookies.prototype.toString = function() {
  var cookies = [];
  for(var i in this.cookies) {
    cookies.push(this.cookies[i].toString());
  }
  return cookies;
};
Cookies.prototype.toStrings = Cookies.prototype.toString;

Cookies.prototype.toObject = function() {
  var cookies = {};
  for(var i in this.cookies) {
    cookies[this.cookies[i].name] = this.cookies[i].toObject();
  }
  return cookies;
};

Cookies.prototype.toObjects = function() {
  var cookies = [];
  for(var i in this.cookies) {
    cookies.push(this.cookies[i].toObject());
  }
  return cookies;

};
