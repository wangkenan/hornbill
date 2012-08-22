fml.define('component/pop' , ['jquery' , 'component/shareTmp' , 'component/position'] , function(require , exports){
	var $ = require('jquery');
	var shareTmp = require('component/shareTmp');
	var Position = require('component/position');
	var defleft,deftop,defwidth,defheight;
	return function(options){
		var defaults = {
			current : '.posterWall',
			target : '.pop',
			animate : true,
			speed : 500,
			close : '.closePop'
		}
		var opts = $.extend({} , defaults , options);
		var current = $(opts.current);
		var close = $(opts.close);
		current.live('click' , function(){
			$(opts.target).remove();
			var pop = shareTmp('bigPop');
			$(pop).appendTo($('body'));
			var target = $(opts.target);
			defleft = $(this).offset().left;
			deftop = $(this).offset().top;
			defheight = $(this).height();
			defwidth = $(this).width();
			$(target).css({
				left : defleft,
				top : deftop,
				width : defwidth,
				height : defheight
			}); 
			$(target).animate({width : $(pop).width() , height : $(pop).height() , left : $(document).scrollLeft() + (($(window).width() - $(pop).width()) / 2) , top : $(document).scrollTop() + (($(window).height() - $(pop).height()) / 3)} , opts.speed);
		});
		$(opts.target).live('click' , function(){
			$(this).animate({width : defwidth , height : defheight, left : defleft , top : deftop} , opts.speed , function(){
				$(this).remove();	
			});
		});
	}	
});
