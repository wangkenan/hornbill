fml.define('component/select',['jquery' , 'component/regString'],function(require , exports){
var $ = require('jquery');
var regString = require('component/regString');
return {
    createSelect : function(objs,callBack){
	    objs = $(objs);
	    var objsLen = objs.size();
        if(objs.css("display")=="none"){
	        objs.prev().remove();
        };
        objs.hide();
        for (var j=0;j<objsLen;j++){
	        showSelect(objs.eq(j));
        };
        function showSelect(obj){
	        arr = [];
	        arr.push('<div class="selectPanel">');
	        arr.push('<div class="select"><div class="selectText" val="'+ obj.find("option:selected").attr("id") +'" >'+ obj.find("option:selected").text() +'</div><div class="selectBtn"></div></div>');
	        arr.push('<div class="options" >');
	        arr.push('<ul></ul>');
	        arr.push('</div>');
	        arr.push('</div>');
	        var thisObj = $(arr.join(""));
	        obj.before(thisObj);
	        var selectOption = obj.find("option");
	        var selectLength = selectOption.size(); 
	        var options = [];
	        for(var i=0;i<selectLength;i++){
				var name = regString.escapeString(selectOption.eq(i).val());
		        options.push("<li role=\""+selectOption.eq(i).attr("role")+"\" id=\""+selectOption.eq(i).attr("id")+"\"  value=\""+name+"\">"+ name +"</li>")
	        };
	        $(thisObj).find(".options ul").html(options.join(""));
	        if (callBack) {
		        callBack(thisObj);
	        };
	        $(".createPanel").bind("click",function(e){
		        $(".options").show();
	        })
	        $(thisObj).find(".select").bind("click",function(e){
			    if($(this).attr("isSelect") != "true"){
				    $(this).css({"visibility":"hidden"});
				    $(thisObj).find(".options").show();
				    $(this).attr("isSelect","true");
			    }else{
					$(this).css({"visibility":"visible"});
				    $(thisObj).find(".options").hide();
				    $(this).removeAttr("isSelect");
			    }
	        });
	        /*$(thisObj).find(".select").bind("mouseover",function(e){
		        if($(this).attr("isSelect") != "true"){
			        $(thisObj).find(".options").show();
			        $(this).attr("isSelect","true");
			        $.fn.stopPropagation(e);
		        }
	        });*/
	        /*$(document).bind("click",function(){
		        $(".selectPanel").children().css("visibility","visible");
		        $(".options").hide();
		        $(".select").removeAttr("isSelect");
    	    });*/

            $(thisObj).delegate(".options ul li","mouseover",function(){
		        $(this).css({"background":"#ffeef4"});
	        });
            $(thisObj).delegate(".options ul li","mouseout",function(){
		        $(this).css({"background":"#fff"});
	        });
	        $(thisObj).delegate(".options ul li","click",function(){
		        $(thisObj).find(".selectText").text($(this).text());
		        $(thisObj).find(".selectText").attr("val" , $(this).attr("id"));
		        obj.attr("value",$(this).text())
		        $(thisObj).find(".options").hide();
		        $(thisObj).find(".select").css("visibility","visible").removeAttr("isSelect");
	        });
	        $(thisObj).find(".select").hover(function(){
		        $(this).addClass("selectbg");
	        },function(){
		        $(this).removeClass("selectbg");
	        });
        }
    }
}
});

