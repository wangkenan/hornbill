fml.define('component/focus',['jquery'],function(require , exports){
    var $ = require('jquery');
	var inp = document.createElement("input");
	var supported =  "placeholder" in inp;
	inp = null;
    var inputFocus = function(obj){
		if (supported) return;

		var input = $(obj);
		var place = input.attr('placeholder');

		if ('' == input.val()) input.val(place);

        input.bind('focus' , function(){
            if(this.value == place){
                this.value = '';
            };     
        }).bind('blur' , function(){
            if(this.value == ''){
                this.value = place;    
            }    
        });
    }
    exports.inputFocus = inputFocus; 
});
