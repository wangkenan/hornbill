fml.define('component/autoTextarea' , ['component/pin'] , function(require , exports){
	var $ = require('component/pin');	
	return function(parentObj , obj , miniHeight , callback){
		var minHeight = 0;
		var maxHeight = 200;
		$wall = $('.goods_wall');
		$wallSize = $wall.size();
		$(parentObj).on('keyup focus' , obj , function(){
			var height,style = this.style;
			var oldHeight = parseInt(style.height) ;
			if(isNaN(oldHeight)){
				oldHeight = miniHeight;
			}
			var isHeight = style.height;
			style.height =  miniHeight + 'px';
			if (this.scrollHeight > minHeight) {
				if (maxHeight && this.scrollHeight > maxHeight) {
					height = maxHeight;
					style.overflowY = 'scroll';
					style.height = height  + 'px';
				} else {
					height = this.scrollHeight;
					style.overflowY = 'hidden';
					style.height = height  + 'px';
					if(isHeight != height+'px'){
						if ($wallSize) $wall.masonry('reload');
					}
				}
			}
		});
	}
});
