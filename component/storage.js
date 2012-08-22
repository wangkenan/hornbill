fml.define('component/storage',[], function(require ,exports){
	//for cookie
	//args:opts---domain,path,duration,secure
	//eg: setCookie('key','value',{path:'/', duration:'100'})
	var Cookie = {
		cookieArr : {},
		options : {'domain':'.meilishuo.com', 'path':'/'},
		setCookie : function(key, value, opts) {
			opts = opts || {};
			var line = key + '=' + encodeURIComponent(value); 
			opts.domain || (opts.domain = this.options.domain);
			opts.path || (opts.path = this.options.path);
			line += '; domain=' + opts.domain;
			if (opts.path) {
				line += '; path=' + opts.path;
			}
			if (opts.duration) {
				var expires = new Date;
				expires.setTime(expires.getTime() + opts.duration * 1000);
				line += '; expires=' + expires.toGMTString();
			}
			if (opts.secure) {
				line += '; secure';
			}
			return document.cookie = line + ';';
		},
		getCookie : function(key) {
			this.cookieArr[key] = this.cookieArr[key] || (function(){
				var arr = window.document.cookie.match('(?:^|;)\\s*' + key.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '=([^;]*)');
				return arr ? decodeURIComponent(arr[1]) : undefined;
			})();
			return this.cookieArr[key];
		},
		removeCookie : function(key) {
			return this.setCookie(key, '', {duration: -1});
		}
	};

	//除了ie 5.5-7
	var DOMStorage = {
		set : function(key, value, session) {
			if (session) {
				return sessionStorage.setItem(key, value);
			} else {
				return localStorage.setItem(key, value);
			}
		},

		get : function(key, session) {
			if (session) {
				return sessionStorage.getItem(key);
			} else {
				return localStorage.getItem(key);
			}
		},
		
		remove : function(key, session) {
			if (session) {
				return sessionStorage.removeItem(key);
			} else {
				return localStorage.removeItem(key);
			}
		}
	};

	//for ie5.5-7
	var IEStorage = {
		detectIE : function() {
			var ua = navigator.userAgent.toLowerCase();
			if (window.ActiveXObject) {
				var ieVersion = ua.match(/msie ([\d.]+)/)[1];
				if (ieVersion >= 5.5 && ieVersion < 8) {
					return true;
				}
			}
			return false;
		},
		set : function(key, value, session) {
			if (session) {
				return Cookie.setCookie(key, value);
			} else {
				return Cookie.setCookie(key, value, {duration: 8640000});
			}
		},
		get : function(key, session) {
				return Cookie.getCookie(key);
		},
		remove : function(key, session) {
				return Cookie.remove(key);
		}
	};

	return {
		storage : this.storage || (function(){
			if (IEStorage.detectIE()) {
				return IEStorage;
			} else {
				return DOMStorage;
			}
		})(),
		setCookie : function(key, value, opts) {
			return Cookie.setCookie(key, value, opts);
		},
		getCookie : function(key) {
			return Cookie.getCookie(key);
		},
		removeCookie : function(key) {
			return Cookie.removeCookie(key);
		},
		setSession : function(key, value) {
			return this.storage.set(key, value, true);
		},
		getSession : function(key) {
			return this.storage.get(key, true); 
		},
		removeSession : function(key) {
			return this.storage.remove(key, true);
		},
		set : function(key, value) {
			return this.storage.set(key, value, false);
		},
		get : function(key) {
			return this.storage.get(key, false);
		},
		remove : function(key) {
			return this.storage.remove(key, false);
		}
	};
})
