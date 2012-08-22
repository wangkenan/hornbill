fml.define('component/urlHandle' , [] , function(require , exports){
	var getUrl = function(url){
		if(url == '') return '';
		var options = {
		};
		options = getParams(url);
		var tag = document.createElement('A');
		tag.href = url;
		options.hostDomain = tag.host;
		var rstr = options.hostDomain.replace(/\.(com|cn|net|org)/g,'');
		rstr = rstr.substr(rstr.lastIndexOf('.')+1);
		options.rootDomain = options.hostDomain.substr(options.hostDomain.indexOf(rstr));
		//options.rootDomain = options.hostDomain.substring(options.hostDomain.length , options.hostDomain.indexOf('.') + 1);
		return options;
	}
	function getParams(url){
		if(url == '') return '';
		var options = {};
		var name,value,i;
		var params = url.indexOf('?');
		var str = url.substr(params + 1);
		var arrtmp = str.split('&');
		for(i=0 , len = arrtmp.length;i < len;i++){
			var paramCount = arrtmp[i].indexOf('=');
			if(paramCount > 0){
				name = arrtmp[i].substring(0 , paramCount);
				value = arrtmp[i].substr(paramCount + 1);
				try{
				options[name] = decodeURIComponent(value);
				}catch(exp){}
			}
		}
		delete options['frm'];
		return options;
	}
	exports.redirect = function(url){
		var isIe = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
		if(!url) return;
		if(isIe){
			var referLink = document.createElement('a');
			referLink.href = url;
			document.body.appendChild(referLink);
			referLink.click();
		}else{
			location.href = url;
		}   
	} 
	exports.getUrl = getUrl;
	exports.getParams = getParams;
});
