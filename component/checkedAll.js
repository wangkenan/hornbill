fml.define('component/checkedAll' , ['jquery'] , function(require , exports){
	var $ = require('jquery');
	return function(checked , checkedList){
		$(checked).live('click' , function(){
			if($(this).attr('checked')){
				$(checkedList).attr('checked' , true);	
			}else{
				$(checkedList).attr('checked' , false);	
			}
		});
		$(checkedList).live('click' , function(){
				$(checked).attr('checked' , false);	
		});
	}	
});
