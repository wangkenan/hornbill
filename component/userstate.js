fml.define('component/userstate', ['jquery', 'component/iStorage'] , function(require,exports){
	var $ = require('jquery');
	var storage = require('component/iStorage');
	var lastActive = new Date;
	var user_browser = $.browser,
		detectiveCache = {};


	$(document).bind('mousemove', function(){
		lastActive = new Date;
		})


	exports.browser = function(browser , version){
		browser = ({'ie' : 'msie'}[browser]) || browser;
		var cache = detectiveCache[browser + version];
		if (undefined !== cache ) return cache;

		if (! user_browser[browser]) return cache = false;
		if (version && version != user_browser.version) return cache =false;
		return cache = true;		
		}

	exports.activity = function(ttl){
		if (!ttl) ttl = 30;
		return (new Date - lastActive < ttl * 1000 );	
		}	
	
	exports.isNew = function(){
		var date = new Date;
		var mon = '0' + (date.getMonth() + 1), day = '0' + date.getDate();
		var visitDate = date.getFullYear().toString().substr(2) + mon.substr(mon.length-2) + day.substr(day.length-2);
		var globalKey = storage.getCookie('MEILISHUO_GLOBAL_KEY');
		if (!globalKey) return false;
		var isNew = globalKey.substr(17,6) == visitDate;
		return isNew;
		}

	});
