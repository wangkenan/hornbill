fml.define('component/position' , ['jquery'] , function(require , exports){
	var $ = require('jquery');	
	var doc = $(document);
	var win = $(window);
	if(!Array.prototype.indexOf){  
		Array.prototype.indexOf = function(val){  
			var value = this;  
			for(var i =0; i < value.length; i++){  
				if(value[i] == val) return i;  
			}  
			return -1;  
		};  
	}
	return Position = {
		pin : function(obj , target){
			return {
				left : obj.offset().left,
				right : obj.offset().right,
				top : obj.offset().top
			}		
		},
		winCenter : function(obj , target){
			obj = obj instanceof $ ? obj : $(obj);
			target = target instanceof $ ? target : $(target);
			var left = (target.width() - obj.width()) / 2;
			if(obj.css('position') == 'fixed'){
				var top = (target.height() - obj.height()) / 4;
			}else{
				var top = $(document).scrollTop() + ((target.height() - obj.height()) / 4);
			}
			obj.css({
				'top' : top,
				'left' : left
			});
		},
		docCenter : function(obj , target){
			obj = obj instanceof $ ? obj : $(obj);
			target = target instanceof $ ? target : $(target);
			var left = $(document).scrollLeft() + ((target.width() - obj.width()) / 2);
			var top = $(document).scrollTop() + ((target.height() - obj.height()) / 3);
			obj.css({
				'top' : top,
				'left' : left
			});
		},
		toFixed : function(obj , offset){
			obj = obj instanceof $ ? obj : $(obj);
			var top = $(document).scrollTop() + offset.top;
			obj.css({
				'top' : top,
				'left' : offset.left
			});
		},
		depend : function(obj , target , pos){
			obj = obj instanceof $ ? obj : $(obj);
			target = target instanceof $ ? target : $(target);
			pos = pos || [];
			var left,top;
			var objW = obj.width();
			var objH = obj.height();
			var targetW = target.width();
			var targetH = target.height();
			var offleft = target.offset().left;
			var offtop = target.offset().top;
			var winH = win.height();
			var docTop = doc.scrollTop();
			var winW = win.width();
			//(winH - ((winH + docTop) - (offtop + targetH))) > objH 
			if(pos.indexOf('bottom') != -1){
				top = offtop + targetH;
				left = offleft - (objW / 2) + (targetW / 2);
			}else if(pos.indexOf('right') != -1){
				top = offtop - (objH / 2) + (targetH / 2);
				left = offleft + targetW + $('.left_ico').height();
				$('.left_ico').css({
					top : (objH - $('.left_ico').height()) / 2	
				}).show();
			}else if(pos.indexOf('top') != -1){
				top = offtop - objH;
				left = offleft - (objW / 2) + targetW;
			}else{
				top = offtop - (objH / 2) + (targetH / 2);
				left = offleft - objW;
			}
			obj.css({
				'top' : top,
				'left' : left
			});
		},
		clone : function(obj , target){
			obj = obj instanceof $ ? obj : $(obj);
			target = target instanceof $ ? target : $(target);
			obj.css({
				left : target.offset().left,
				top : target.offset().top,
				width : target.width(),
				height : target.height()
			});	
		}
	}
});
