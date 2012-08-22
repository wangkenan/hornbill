fml.define('component/scrollTo' , ['jquery'] , function(require , exports){	
	var $ = require('jquery');
	var win  =$(window);
	exports.scrollTo = function(pos){
		var scrollWin = window.setInterval(function(){
			win.scrollTop(pos / 6); 
			if(win.scrollTop() < 1){ 
				clearInterval(scrollWin);
			}
		},1);
	}
});
