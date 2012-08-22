fml.define('component/onmsg' ,['jquery'] , function(require , exports){
    var $ = require('jquery');
    var timer = 0;
    var num = 0;
	var timeout = null;
    //回调函数必须重新赋值为false 否则只会执行一次
    fml.vars.isMove = false;
    var setTimeout = function(url , data , callback , delay , dataType){
		window.clearTimeout(timeout);
		$.get(url , data , callback , dataType);
        $(document).bind("mousemove" , function(){
            if(fml.vars.isMove){
                return false;
            }else{
                fml.vars.isMove = true;
                if(!dataType){
                    dataType = null;
                }
                timeout = window.setTimeout(function(){
                    $.get(url , data , callback , dataType);
                },delay);
            }
        })
    }
    exports.setTimeout = setTimeout;
});
