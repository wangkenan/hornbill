fml.define('component/lazyLoad' , ['jquery' , 'component/windowScroll' , 'component/userstate' ] , function(require , exports){
	var preN = 100;
	var $ = require('jquery');
	var browser = require('component/userstate').browser;
	var loadingImg = 'http://img.meilishuo.net/css/images/group/g_loading2.gif';
	var ieIE = browser('msie' ,'6.0') || browser('msie' , '7.0');

	function loadImg(item , attrName) {
		var src = item.getAttribute(attrName);
		if ('null' == src || src.indexOf('.') < 0 ) return;
		var img = new Image;
		
		function onload(){
			img.onload = null;
			img.className = item.className;
			img.style.cssText = item.style.cssText;
			var pnl = item.parentNode;
			pnl.insertBefore(img,item);
			item.style.display = 'none';
			pnl.removeChild(item);
		}
		if (ieIE) {
			if (loadingImg) img.src = loadingImg;
			onload();
		} else {
			img.onload = onload;
			}
		img.src = src  ;
		
		}
	function showImg(items, attrName){
		var j = items.length;
		for (var i=0 ; i<j;i++){
			loadImg( items[i] , attrName);
			}
		
		}
	exports.setLoading = function(src){
		loadingImg = src;
		}
	exports.load =	function (xpath , soureAttrName){
		window.setTimeout(function(){
			bindLoad(xpath , soureAttrName);
			} , 30);
	}
	function pushInLine(topv,lines,imgs ,index , index_end){
		var total = imgs.length;
		for (var i = index;i<=index_end; i++){
			if (i >= total) return true;
			var offset = imgs.eq(i).offset().top;
			if (! lines.hasOwnProperty(offset) ) {
				lines[offset] = []; 	
				topv.push(offset);
			}
			lines[offset].push(imgs[i]);
			}
			return false;
		
		}
	function bindLoad(xpath , soureAttrName){
		var	onscroll = require('component/windowScroll');
		var lines = {}, 
			topv = [];
		var imgs,vi ;
		imgs = $(xpath);

		var imgs_count = imgs.length;
		var index=0 ,index_end , step = 50,
			sleep = 30;
		var done = false;
		while(index <= imgs_count){
			index_end = index + step - 1;
			if (index_end>= imgs_count) {
				index_end = imgs_count-1;
				}
			window.setTimeout((function(index , index_end){
				return function(){
					done = pushInLine(topv , lines , imgs , index , index_end) || done;	
					}
				})(index , index_end) , sleep );
			sleep += 15;
			index += step;
			}
		//preN = onscroll.property('height') / 2;
		window.setTimeout(function(){
			handler(onscroll.property('scrollTop') , true);
		} , sleep+5);
		onscroll.bind(handler);

		function handler(pos,down){
			if (!down) return;
			pos += onscroll.property('height') + preN ;
			var j = topv.length;
			var max_vi = -1;
			for (var i = 0 ; i<j ; i++){
				var vi = topv[i];
				if (vi < pos) {
					lines.hasOwnProperty(vi) &&showImg(lines[vi] , soureAttrName);	
					delete lines[vi];
					max_vi = i;
					}	
				}
			if (max_vi >-1  ) topv.splice(0 , max_vi + 1);
			//console.log(max_vi , topv.length , topv);
			if (topv.length == 0 && done) onscroll.unBind(handler);
			};
		
		}
});
