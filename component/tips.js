fml.define('component/tips' , ['jquery' , 'component/shareTmp'] , function(require , exports){
	var $ = require('jquery');	
	var shareTmp = require('component/shareTmp');
	var cleartime = null;
	return function(parentObj , obj , tipDiv ,callback){
		$(parentObj).on('mouseenter' , obj , function(e){
			window.clearTimeout(cleartime);
			$(tipDiv).remove();
			var tplDemo = shareTmp(tipDiv.replace('.' , '').replace('#' , ''));
			$('body').append(tplDemo);
			var left = $(this).offset().left;
			var top = $(this).offset().top;
			left = left < 0 ? 0 : left;
			if((e.clientY + $(this).height()) > $(window).height() - e.clientY){
				callback($(this) , '_b');
				top -= ($(tipDiv).height() + 8);	
			}else{
				callback($(this) , '_t');
				top += $(this).height() + 8;	
			}
			$(tipDiv).css({'position' : 'absolute','top' : top , 'left' : left}).show();
		});	
		$(document).on('mouseenter' , tipDiv , function(event){	
			window.clearTimeout(cleartime);
		}).on('mouseleave' , tipDiv , function(){
			$(this).remove();	
		});
		$(parentObj).on('mouseleave' , obj , function(event){	
			cleartime = window.setTimeout(function(){
				$(tipDiv).remove();	
			},200)
		});
	}
	exports.tips = tips;
});
