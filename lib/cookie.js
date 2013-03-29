require('extend-string');

var Cookie = function(options) {
  this.params = { };
  
  this.initProperties();
  
  if(typeof options !== 'object') {
    var options = this.parse(options);
  }
  
  for(var i in options) {
    this[i] = options[i];
  }
};
module.exports = Cookie;

Cookie.prototype.defaultGetter = function(name) { if(this.params[name] != undefined) { return this.params[name]; } };
Cookie.prototype.defaultSetter = function(name, value) { this.params[name] = String(value); };

//Cookie.prototype.initProperties = function() {
//    var properties = { params: { configurable: true, enumerable: false, value: {}, writable: true } };
//    ['name', 'value', 'max-age', 'expires', 'domain', 'path', 'secure', 'httponly'].forEach(function(key, index) {
//            properties[key] = { configurable: true, enumerable: true,
//                                get: function() { return this.defaultGetter(key); },
//                                set: function(value) { this.defaultSetter(key, value) } };
//        });
//    Object.defineProperties(this, properties);
//};


Cookie.prototype.initProperties = function() {
  Object.defineProperties(this, { 'params':   { configurable: false, enumerable: false, value: {}, writable: true },
                                  'name':     { configurable: false, enumerable: true, get: function() { return this.defaultGetter('name'); }, set: function(value) { this.defaultSetter('name', value); } },
                                  'value':    { configurable: true, enumerable: true, get: function() { return this.defaultGetter('value'); }, set: function(value) { this.defaultSetter('value', value); } },
                                  'path':     { configurable: true, enumerable: true, get: function() { return this.defaultGetter('path'); }, set: function(value) { this.defaultSetter('path', value); } },
                                  'max-age':  { configurable: true, enumerable: true,
                                                get: function() { return this.defaultGetter('max-age'); },
                                                set: function(value) { this.params['max-age'] = String(value).parseTrueInt(); } },
                                  'expires':  { configurable: true, enumerable: true,
                                                get: function() { return this.defaultGetter('expires'); },
                                                set: function(value) { this.params['expires'] = new Date(value).toGMTString(); } },
                                  'domain':   { configurable: true, enumerable: true,
                                                get: function() { return this.defaultGetter('domain'); },
                                                set: function(value) { this.params['domain'] = String(value).replace(/[^a-z\.\-]/ig, ''); } },
                                  'secure':   { configurable: true, enumerable: true,
                                                get: function() { return (this.params['secure'] != null) ? true : false; },
                                                set: function(value) { if(value) { this.params['secure'] = true; } else { delete this.params['secure']; } } } ,
                                  'httponly': { configurable: true, enumerable: true,
                                                get: function() { return (this.params['httponly'] != null) ? true : false; },
                                                set: function(value) { if(value) { this.params['httponly'] = true; } else { delete this.params['httponly']; } } }
                                });
};


Cookie.prototype.parse = function(cookieString) {
  var options = { };
  
  if(cookieString != undefined) {
    var cookieParts = cookieString.split(';');
    
    var nameValue = cookieParts.shift().split('=');
    options.name = nameValue[0].trim();
    options.value = nameValue[1].trim();
    
    cookieParts.forEach(function(cookiePart, index) {
      if(cookiePart.trim()) {
        var cookiePart = cookiePart.trim().split('=');
        if(['httponly', 'secure'].indexOf( cookiePart[0].trim().toLowerCase() ) !== -1) {
          options[cookiePart[0].trim().toLowerCase()] = true;
        } else {
          options[cookiePart[0].trim().toLowerCase()] = cookiePart[1].trim();
        }
      }
    });
  }
  return options;
}


//Set-Cookie: <name>=<value>[; <Max-Age>=<age>]
//[; Expires=<date>][; Domain=<domain_name>]
//[; Path=<some_path>][; Secure][; HttpOnly]
Cookie.prototype.toString = function() {
  var cookieString = this.name + '=' + this.value + '; ';
  if(this['max-age'] !== undefined) { cookieString += 'Max-Age=' + this['max-age'] + '; '; }
  else if(this.expires !== undefined) { cookieString += 'Expires=' + this.expires + '; '; }
  if(this.domain !== undefined) { cookieString += 'Domain=' + this.domain + '; '; }
  if(this.path !== undefined) { cookieString += 'Path=' + this.path + '; '; }
  if(this.secure !== undefined) { cookieString += 'Secure; '; }
  if(this.httponly !== undefined) { cookieString += 'HttpOnly; '; }
  return cookieString.substr(0, (cookieString.length - 2));
};


Cookie.prototype.toObject = function() {
  return this.params;
};


//var cookie = new Cookie('lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15-Jan-2013 21:47:38 GMT; Max-Age=1234; Path=/; Domain=.example.com; HttpOnly; Secure');
//var cookie = new Cookie('lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15-Jan-2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly; Secure');
//console.log('lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15-Jan-2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly; Secure');
//cookie.name = 'name';
//console.log(cookie.name);
//delete cookie.secure;
//cookie.secure = true;
//console.log(cookie.toString());
//console.log(cookie.toObject());
