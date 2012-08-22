fml.define('component/slideTab' , ['jquery'] , function(require , exports){
	var $ = require('jquery');	
	return function(options){
		var defaults = {
			leftBar : '.before',
			rightBar : '.next',
			container : '.tab_container',
			item : '.tab_item',
			itemWidth : 588,
			leftClick : function(){},
			rightClick : function(){}
		}	
		var opts = $.extend({} , defaults , options),
		container = $(opts.container),
		item = $(opts.item),
		animateWidth = 0;
		item.css('width' , opts.itemWidth);
		container.css('width' , item.size() * opts.itemWidth);
		$(opts.rightBar).bind('click' , function(){
			opts.rightClick();
			$(opts.leftBar).show();
			if(animateWidth == -(container.width() - (opts.itemWidth * 2))){
				$(this).hide();
			}
			animateWidth -= opts.itemWidth;
			container.stop(true , true).animate({'marginLeft' : animateWidth} , 1000);	
		});
		$(opts.leftBar).bind('click' , function(){
			opts.leftClick();
			$(opts.rightBar).show();
			if(animateWidth == -opts.itemWidth){
				$(this).hide();
			}
			animateWidth += opts.itemWidth;	
			container.stop(true , true).animate({'marginLeft' : animateWidth} , 1000);
		});
	}
});
