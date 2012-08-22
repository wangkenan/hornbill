fml.define('component/windowScroll' , [] , function(require , exports){
    var _inited = false;
    var _lastPos = 0  , _direction;
    var doc = document.documentElement || document.body,
		doc1 = document.body || document.documentElement;
	
    var forwardList = [],
        backwardList = [],
        bindList = [],
		bindHash = {};
	function getScrollTop(){
		return doc.scrollTop + doc1.scrollTop;
		}
    function  initScrollWatch(){
	    if (_inited) return;
	   _inited = true;
	   var wrapper = document.getElementById('_wrapperp') || window;
       wrapper.onscroll = function(){
           var nowPos = getScrollTop();
            _direction = nowPos - _lastPos > 0;
            _lastPos = nowPos; 
            execBinded();
            execList(_direction );     
           } 
        }

    function execList(goforward){
        var list , reserv_list , fntag;
        if ( goforward ){
            list =  forwardList ;
            reserv_list  = backwardList;
            fntag = 'gteFn';
         }else{
            list =  backwardList ;
            reserv_list  = forwardList;
            fntag = 'ltFn';
             }
        var list_size = list.length;
        for (var i =  list_size-1;i>=0 ; i--) {
            var event = list[i];           
			if (!event) continue;
			var y = event.y;
			if (event.dynamicY) y = y(); 
            if ( !goforward ^ y <= _lastPos) { 
                //console.log('now: ' + _lastPos + '; y:' + event.y + ';direct:' + goforward);
                list.splice(i,1);
                reserv_list.push(event);
                if ('function' == typeof event[fntag] ) event[fntag](_lastPos);
                }
            }
        }    

    function execBinded(){
        
       var j = bindList.length;
       if (!j) return;
       for (var i =0 ;i <j;i++){
            bindList[i](_lastPos , _direction); 
           }
        }
	exports.property = function property(proname){
		switch (proname){
			case 'height':
				return doc.clientHeight;
			case 'scrollTop':
				return getScrollTop();
			}
	}

    exports.unBind = function(factor){
       var j = bindList.length;
	   if ('string' == typeof factor) {
		   var i = bindHash[factor];
			if (undefined != i ){
				bindList.splice(i,1);
				delete bindHash[factor];
				}
		  }else{
			for (var i =0 ;i <j;i++){
				if (factor == bindList[i]) bindList.splice(i,1); break; 
				}
		  }
        }
    exports.bind = function(factor ,key){
		if (!_inited) initScrollWatch();
		if (key) bindHash[key] = bindList.length;
        bindList.push(factor);
        }
    /*
    *@param number scroll y
    *@param function call while >=y 
    *@param function 
    */
    exports.yIn = function(yVal , gteFn , ltFn ){
       if (!_inited) initScrollWatch(); 
       var e = {'y':yVal , 'gteFn' : gteFn , 'ltFn' :ltFn , 'dynamicY' : ('function' == typeof yVal)};
        _lastPos = getScrollTop();
       if (yVal > _lastPos){ 
           forwardList.push(e);
           ///ltFn && ltFn(); 
         } else{    
           backwardList.push(e);
           gteFn && gteFn(_lastPos);
         }
        }
});
