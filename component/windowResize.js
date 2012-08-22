fml.define('component/windowResize' , ['component/userstate'] , function(require , exports){
    var userstate = require('component/userstate');
	var onWindowSizeCng = [];
	var delay;

	function resizeFn(){
		delay && clearTimeout(delay);
		delay = window.setTimeout(function(){
			var j = onWindowSizeCng.length;
			for (var i = 0 ; i < j; i++) onWindowSizeCng[i]();
			} , 240);
		};

	
	if( userstate.browser('msie' )  ){
		var mask = document.createElement("div");
		mask.style.cssText = "width:100%;height:0px;position:absolute;bottom:0px;left:0px;overflow:hidden";
		document.body.appendChild(mask);
		mask.onresize = resizeFn; 
	} else {
		window.onresize = resizeFn;	
		}
		//window.onresize = resizeFn;	

	exports.bind = function(f) {
		onWindowSizeCng.push(f);		
    };
});
