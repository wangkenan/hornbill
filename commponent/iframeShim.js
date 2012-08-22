fml.define('component/iframeShim' , ['jquery'] , function(require , exports){
	var $ = require('jquery');	
	function Shim(target) {
		// 如果是id直接获取 如果选择器选了多个 DOM，则只取第一个
		this.target = $(target).length == 0 ? $(document.getElementById(target)) : $(target).eq(0);
		this.iframe = createIframe();
		this.iframe.appendTo(document.body);
	}
	Shim.prototype.sync = function(){
		var target = this.target;
		var iframe = this.iframe;
		var height  = target.outerHeight();
		var width = target.outerWidth();
		var top = target.offset().top;
		var left = target.offset().left;
		var zIndex = parseInt(target.css('zIndex')) - 1 || 0;
		if(!height || !width || target.is(':hidden')){
			iframe.hide();	
		}else{
			iframe.css({
				'width' : width,
				'height' : height,
				'zIndex' : zIndex,
				'top' : top,
				'left' : left
			});	
			iframe.show();
			
		}
	}
	// 销毁 iframe 等
	Shim.prototype.destroy = function() {
		if(this.iframe){
			this.iframe.remove();
			delete this.iframe;
			delete this.target;
		}
	};
	// Helpers
	function createIframe(){
		return $('<iframe>', {
			frameborder : 0,
			src : 'javascript:void(0)',
			css: {
				display: 'none',
				border: 'none',
				opacity: 0,
				position: 'absolute'
			}
		});
	}
	if ($.browser.msie && $.browser.version == 6.0) {
		return Shim;
	} else {
		// 除了 IE6 都返回空函数
		function Noop() {
		}

		Noop.prototype.sync = Noop;
		Noop.prototype.destroy = Noop;

		return Noop;
	}
});
