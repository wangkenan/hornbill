fml.define('component/poster' , ['component/pin','component/windowResize'] , function(require , exports){
	var $ = require('component/pin');	
	var resize = require('component/windowResize');
	var posterWall = function(options){
		var defaults = {
			containerId : '.goods_wall',
			contentWidth : 240,
			contentFluid : '.content_fluid',
			cornerStampId : "",
			cornerNoticId : "",
			cornerNavId : "",
			masonryId : ".poster_wall",
			defaultColumn : 4,
			lessColumn : 1,
			isFixed : true 
		}
		var opts = $.extend({},defaults,options);	
		var init = function(){
			setWidth();
			cornerStampLayout();
			masonry();
			//windowResize();
		}
		var masonry = function(){
			$(opts.containerId).masonry({
				itemSelector :opts.masonryId,
				columnWidth : opts.contentWidth,
				cornerStampSelector : opts.cornerStampId,
				cornerNoticSelector : opts.cornerNoticId,
				cornerNavSelector : opts.cornerNavId
			});    
		}
		var setWidth = function(){
			var windowWidth = $(document).height() > $(window).height() ? $(window).width() : $(window).width() - 20;
			var column = Math.floor(windowWidth / opts.contentWidth);	
			var container = $(opts.contentFluid + ", .header_top");
			var cornerNavId = $(opts.cornerNavId);
			if(column >= opts.defaultColumn && opts.isFixed){
				var width = (opts.contentWidth * (column));
			}else{
				var width = (opts.contentWidth * opts.defaultColumn);
			}
			if(cornerNavId.size() > 0){
				cornerNavId.css("width" , width - opts.contentWidth);		
			}
			container.css({"width" : width});	
		}
		var windowResize = function(){
			if(opts.isFixed){
				resize.bind(function(){
					if($("body").css("overflow") != "hidden" && $("html").css("overflow") != "hidden"){
						setWidth();
					}
				});
			}
		}
		var cornerStampLayout = function(){
			// Masonry corner stamp modifications
			$.Mason.prototype.resize = function() {
				if($("body").css("overflow") != "hidden" && $("html").css("overflow") != "hidden"){
					setWidth();
				}
				this._getColumns('mlsWall');
				this._reLayout();
			};
			$.Mason.prototype._reLayout = function( callback ) {
				var freeColsStamp = this.cols;
				var freeColsNav = this.cols;
				var freeColsNotic = 1;
				if ( this.options.cornerStampSelector && $(this.options.cornerStampSelector).size() > 0 ) {
					var $cornerStamp = this.element.find( this.options.cornerStampSelector ),
					cornerStampX = $cornerStamp.offset().left - 
					( this.element.offset().left + this.offset.x + parseInt($cornerStamp.css('marginLeft')) );
					freeColsStamp = Math.floor( cornerStampX/ this.columnWidth );
				}
				if ( this.options.cornerNavSelector && $(this.options.cornerNavSelector).size() > 0 ) {
					var $cornerNav = this.element.find( this.options.cornerNavSelector ),
					freeColsNav = opts.lessColumn;
				}
				if ( this.options.cornerNoticSelector && $(this.options.cornerNoticSelector).size() > 0 ) {
					var $cornerNotic = this.element.find( this.options.cornerNoticSelector );
					freeColsNotic = 0;
				}
				var i = this.cols;
				this.colYs = [];
				while (i--) {
					this.colYs.push( this.offset.y );
				}
				for ( i = freeColsNav; i < this.cols; i++ ) {
					this.colYs[i] = this.offset.y + $cornerNav.outerHeight(true);
				}
				for ( i = freeColsStamp; i < this.cols; i++ ) {
					this.colYs[i] = this.offset.y + $cornerStamp.outerHeight(true);
				}
				for ( i = freeColsNotic; i < 1; i++ ) {
					this.colYs[i] = this.offset.y + $cornerNotic.outerHeight(true);
				}
				this.layout( this.$bricks, callback );
			};
		}
		init();
	}
	exports.posterWall = posterWall;
});
