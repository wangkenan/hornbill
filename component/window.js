fml.define('component/window' , ['jquery' , 'component/position' , 'component/windowScroll'] , function(require , exports){
	var $ = require('jquery');
	var position = require('component/position');
	var scroll = require('component/windowScroll');
	var isIe6 = $.browser.msie || $.browser.version == '6.0';
	function Window(options){
		var defaults = {
			width : 520,
			height : 'auto',
			windowId : 'dialogLayer',
			titleId : 'dialogTitle',
			contentId : 'dialogContent',
			title : '提示',
			content : '',
			hasTitle : true
		}
		this.opts = $.extend({}, defaults, options);
	}
	// 创建窗口
	Window.prototype.sync = function(){
		this.window = createWindow.call(this);
		if(this.opts.hasTitle){
			this.title = createTitle.call(this);
		}else{
			this.title = createNoTitle.call(this);		
		}
		this.content = createContent.call(this);
		this.title.appendTo(this.window);
		this.content.appendTo(this.window);
		$('<div class="clear_f"></div>').appendTo(this.content);
		this.window.appendTo(document.body);
		this.toCenter();
	}
	Window.prototype.destroy = function(){
		if(this.window){
			this.window.remove();
			this.title.remove();
			this.content.remove();
			delete this.window;
			delete this.title;
			delete this.content;
		}
	}
	Window.prototype.toCenter = function(){
		if(this.window.css('position') == 'fixed'){
			position.winCenter(this.window , window);		
		}else{
			if(this.opts.isOverflow){
				position.docCenter(this.window , window);	
				$(window).bind("scroll", $.proxy(function(){
					position.docCenter(this.window , window);	
				} , this));
			}else{
				position.winCenter(this.window , window);		
			}
		}
	}
	Window.prototype.onClose = function(callback){
		$("." + this.opts.titleId).on('click' , '#closeDialog' , function(){
			callback();
		});	
	}
	// Helpers
	function createWindow(){
		return $('<div>' , {
			id : this.opts.windowId,
			'class' : this.opts.windowId,
			css : {
				width : this.opts.width,
				height : this.opts.height
			}
		});	
	}
	function createTitle(){
		return $('<div>' , {
			'id' : this.opts.titleId,
			'class' : this.opts.titleId
		}).append('<span class="close_z" id="closeDialog"></span><span id="dialogTitleText">'+ this.opts.title +'</span>');	
	}
	function createNoTitle(){
		return $('<div>' , {
			'id' : this.opts.titleId,
			'class' : this.opts.titleId
		}).append('<span class="close_z" id="closeDialog"></span>');	
	}
	function createContent(){
		return $('<div>' , {
			'id' : this.opts.contentId,
			'class' : this.opts.contentId
		}).append(this.opts.content);	
	}
	return Window;
});
