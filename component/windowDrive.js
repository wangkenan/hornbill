fml.define('component/windowDrive' , ['component/position' , 'component/overlay' , 'component/window' , 'jquery'] , function(require , exports){
	var $ = require('jquery');
	var position = require('component/position');
	var overlay = require('component/overlay');
	var window = require('component/window');
	function Drive(options){
		this.opts = options || {};
		this.overlay = new overlay(this.opts);
		this.window = new window(this.opts);
		return this;
	}
	Drive.prototype.createOverlay = function(){
		this.overlay.sync();	
	}
	Drive.prototype.createWindow = function(){
		this.opts.onStart && this.opts.onStart();
		this.window.sync();
		this.window.onClose($.proxy(function(){
			this.destroyModel();
		} , this));
		$(document).bind("keyup" , $.proxy(function(event){
			if(event.keyCode == 27){
				this.destroyModel();
			}
		} , this));
	}
	Drive.prototype.destroyModel = function(){
		this.opts.onClose && this.opts.onClose();
		this.overlay.destroy();
		this.window.destroy();
	}
	return Drive;
});
