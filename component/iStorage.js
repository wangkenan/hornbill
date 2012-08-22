fml.define('component/iStorage',[], function(require ,exports){
	var isFlashReady = false,
		lockFlash = false;
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
			opts.path && (line += '; path=' + opts.path);
			if (opts.duration) {
				var expires = new Date;
				expires.setTime(expires.getTime() + (opts.duration * 1000));
				line += '; expires=' + expires.toGMTString();
			}
			opts.secure && (line += '; secure');
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

	//for DOMStorage
	var DOMStorage = {
		set : function(key, value, session, fun) {
			session ? sessionStorage.setItem(key, value) : localStorage.setItem(key, value);
			typeof fun == 'function' && fun();
		},
		get : function(key, session, fun) {
			session ? fun(sessionStorage.getItem(key)) : fun(localStorage.getItem(key));
		},
		remove : function(key, session) {
			session ? sessionStorage.removeItem(key) : localStorage.removeItem(key);
		}
	};

	//for ie5.5-7
	var IEStorage = {
		flash : document.getElementById("storage"),
		sessionId : '',
		callback : [],
		init : function(session) {
			if (session) {
				this.sessionId = this.sessionId || Cookie.getCookie('PHPSESSID');
			}
			if (isFlashReady || lockFlash) {
				return;
			}
			lockFlash = true;
			var date = new Date;
			var flashDiv = document.createElement('div');
			var html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="storage"';  
			html += 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="1" height="1">';  
			html += '<param name="movie" value="' + fml.getOption('modulebase') + '../img/storage.swf?d='+date.getTime()+'" />';  
			html += '<param name="quality" value="high" />';
			html += '<param name="allowScriptAccess" value="always" />';
	//		html += '<embed src="http://static.meilishuo.com/img/storage.swf" id="storage1" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" ';  
	//		html += 'allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" width="1" height="1">';  
	//		html += '</embed>';  
			html += '</object>';  
			flashDiv.innerHTML = html; 
			document.body.appendChild(flashDiv);  
			this.flash =  document.getElementById("storage");
		},
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
		set : function(key, value, session, fun) {
			var self = this;
			self.init(session);
			function setVal(key, value, session) {
				if (session) {
					var now = new Date;
					now = parseInt(now.getTime()/3600000);
					self.flash.setSessionTime(now);		//set session time to judge the expires session
					//self.flash.removeSessionTime();	//delete session time to reset it
					self.flash.setSessionVal(self.sessionId + key, now);
					self.flash.set(self.sessionId + key, value);
				} else {
					self.flash.set(key, value);
				}
			}
			if (!isFlashReady) {
				self.callback.push(function(){
					setVal(key, value, session);
					typeof fun == 'function' && fun();
				});
			} else {
				setVal(key, value, session);
				typeof fun == 'function' && fun();
			}
		},
		get : function(key, session, fun) {
			var self = this;
			self.init(session);
			function getVal(key, session) {
				if (session) {
					self.flash.removeAllSession();	//触发清除过期session值
					return self.flash.get(self.sessionId + key);
				} else {
					return self.flash.get(key);
				}
			}
			isFlashReady ? fun(getVal(key, session)) : self.callback.push(function(){ fun(getVal(key, session)); });
		},
		remove : function(key, session) {
			var self = this;
			self.init(session);
			if (!isFlashReady) {
				var self = this;
				window.setTimeout(function(){
					self.remove(key, session);
				}, 100);
				return;
			}
			session ? self.flash.remove(self.sessionId + key) : self.flash.remove(key);
		}
	};

	var storage = IEStorage.detectIE() ? IEStorage : DOMStorage;
		
	return {
		//for flash to call ---start
		isJSReady : function() {
			return true;
		},
		getAllowDomain : function() {
			var domains = domains || ["www.meilishuo.com", "newlab.meilishuo.com", "newtest.meilishuo.com", "wwwtest.meilishuo.com", "cdjdev.meilishuo.com"];
			return domains;
		},
		flashReadyHandler : function() {
			isFlashReady = true;
			for (var i=0,len=IEStorage.callback.length;i<len;i++){
				IEStorage.callback[i]();
			}
		},
		//for flash to call ---end
		setCookie : function(key, value, opts) {
			return Cookie.setCookie(key, value, opts);
		},
		getCookie : function(key) {
			return Cookie.getCookie(key);
		},
		removeCookie : function(key) {
			return Cookie.removeCookie(key);
		},
		setSession : function(key, value, fun) {
			return storage.set(key, value, true, fun);
		},
		getSession : function(key, fun) {
			return storage.get(key, true, fun); 
		},
		removeSession : function(key) {
			return storage.remove(key, true);
		},
		set : function(key, value, fun) {
			return storage.set(key, value, false, fun);
		},
		get : function(key, fun) {
			return storage.get(key, false, fun);
		},
		remove : function(key) {
			return storage.remove(key, false);
		}
	};
})
