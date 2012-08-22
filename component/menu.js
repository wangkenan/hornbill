fml.define('component/menu' , ['jquery' , 'component/shareTmp'] , function(require , exports){
	var $ = require('jquery');	
	var shareTmp = require('component/shareTmp');
	var clear = null;
	return function(obj , menu , callback){
		$(document).on('mouseenter' , obj , function(){
			var tpl = shareTmp(menu); 
			$('body').append(tpl);
			// callback 回调位置;
			if(callback){
				var top = callback(obj).top;	
				var left = callback(obj).left;
			// 默认位置
			}else{
				var top = $(obj).offset().top + $(obj).height();
				var left = $(obj).offset().left - $(obj).width()/2;
			}
			$("."+menu).css({'top' : top + 10 , 'left' : left , 'position' : 'absolute'});
		});
		$(document).on('mouseenter' , '.'+menu , function(){
			window.clearTimeout(clear);	
		}).on('mouseleave' , '.'+menu , function(){
			$('.'+menu).remove();	
		});
		$(document).on('mouseleave' , obj , function(){
			clear = window.setTimeout(function(){
				$('.'+menu).remove();
			},300)
		});
	}
});
