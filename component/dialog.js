/*******************
*date 2012-02-10
*author Nano
*email kenanwang@meilishuo.com
********************/
fml.define('component/dialog',['jquery'],function(require , exports){
    var $ = require('jquery');
	return {
		meiliDialog : function(options){
			var defualts = {
				maskId : "maskLayer",
				dialogId : "dialogLayer",
				dialogTitle : "标题",
				dialogContent : "",
				dialogWidth : 520,
				dialogHeight : null,
				isOverflow : true,
                isMaskLayer : true,
				onClose : function(){},
				onStart : function(){}
			};
			var isIE  = $.browser.msie;
			var opts = $.extend({}, defualts, options);
			var initDialog = function(){
				$("#"+opts.maskId).remove();
				$("#"+opts.dialogId).remove();
                //esc 退出
                $(document).bind("keyup",function(event){
                    if(event.keyCode == 27){
                        closeDialog();
                    }
                });
                if(opts.isMaskLayer == true){
				    mask();
                }
				dialog();
				opts.onStart(opts);
			};
			//maskLayer
			var mask = function(){
				var maskLayer = $('<div id="'+ opts.maskId +'" class="'+ opts.maskId +'"></div>');
				$("body").append(maskLayer);
				var width = $(document).width();
				var height = $(document).height();
				if(opts.isOverflow){
					maskLayer.css({"width" : width+20 , "height" : height});
				}else{
					maskLayer.css({"width" : width , "height" : height});
					$(window).bind("scroll",function(){
						width = $(document).width();
						height = $(document).height();
						maskLayer.css({"width" : width , "height" : height});
					})
				}
			};
			//dialog
			var dialog = function(){
				var dialogLayer = $('<div style="width:'+ opts.dialogWidth +'px" id="'+ opts.dialogId +'" ><div style="width:'+ (opts.dialogWidth-20) +'px" id="dialogTitle"><span id="closeDialog" class="close_z"></span><span id="dialogTitleText">'+ opts.dialogTitle +'</span></div><div style="width:'+ (opts.dialogWidth) +'px" id="dialogContent" ></div></div>');
				$("body").append(dialogLayer);
				$("#dialogContent").append(opts.dialogContent).append('<div class="clear_f"></div>');
				toCenter();
				toFixed();
				$("#closeDialog").click(function(){
					closeDialog();
				});
			};
			//dialogToCenter;
			var toCenter = function(){
				var obj =  $("#"+opts.dialogId);
				var padding = parseInt(obj.css("padding-top"));
				if(obj.css('position') == 'fixed'){
					var top = (($(window).height()-obj.height())/4)-padding;
					var left = (($(window).width()-obj.width())/2)-padding;
					obj.css({"top":top,"left":left});
				}else{
					var top = $(document).scrollTop()+(($(window).height()-obj.height())/3)-padding;
					var left = $(document).scrollLeft()+(($(window).width()-obj.width())/2)-padding;
					top < 0 ? top = 20 : top;
					obj.css({"top":top,"left":left});
				}
			};
			//dialogToFixed
			var toFixed = function(){
				if(opts.isOverflow){
					$("body").css("overflow","hidden");
					if(isIE){$("html").css("overflow","visible")};
				}else{
					if(isIE){
						$(window).bind("scroll",function(){
							toCenter($("#"+opts.dialogId))
						})
					}else{
						$("#"+opts.dialogId).css({"position":"fixed"})
					}
				}
			}
			var closeDialog = function(){
				$("."+opts.maskId).remove();
				$("#"+opts.dialogId).remove();
				$("body").css("overflow","auto");
				if(isIE) $("html").css({"overflow":"auto" , "overflow-x":"hidden"});
				opts.onClose(opts);
			}
			initDialog();
			return closeDialog;
		}
	};
})
