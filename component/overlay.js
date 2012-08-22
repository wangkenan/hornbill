fml.define('component/overlay' , ['jquery' , 'component/iframeShim'] , function(require , exports){
	var $ = require('jquery');	
	var shim = require('component/iframeShim');
	var isIe = $.browser.msie;
	function Overlay(options){
		options = options || {};
		this.id = options.id || 'overlay';
		this.className = options.className || 'transmaskLayer';
		this.transparent = options.transparent || false;
		this.isOverflow = options.isOverflow;
	}
	// 创建overlay
	Overlay.prototype.sync = function(){
		this.overlay = createOverlay();	
		this.overlay.attr('id' , this.id);
		this.overlay.get(0).className = this.transparent ? this.className : 'maskLayer';
		this.overlay.appendTo(document.body);
		this.iframe = new shim(this.id);
		this.iframe.sync();
		if(!this.isOverflow){
			this.overflow();	
		}
	}
	// 销毁overlay
	Overlay.prototype.destroy = function(){
		this.iframe.destroy();
		this.overlay.remove();
		if(!this.isOverflow){
			$("body").css("overflow","auto");
			if(isIe) $("html").css({"overflow":"auto" , "overflow-x":"hidden"});
		}
	}
	Overlay.prototype.overflow = function(){
		$(document.body).css('overflow' , 'hidden');
		if(isIe){$("html").css("overflow","visible")};
		this.overlay.width(this.overlay.width() + 20);
	}
	// Helpers
	function createOverlay(){
		$document = $(document);
		var height = $document.height();
		var width = $document.width(); 
		return $('<div>' , {
			css : {
				width : width,
				height : height
			}	
		});	
	}
	return Overlay;
});
