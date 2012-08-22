fml.define('component/regString',['jquery'],function(require , exports){
    var $ = require('jquery');
    var selectRequestDataShare = null;
    return {
        //校验url
        isUrl : function(str_url){
            this.trim(str_url);
            var strRegex = '((^http)|(^https)|(^ftp)):\/\/[-\\w]+\\.(\\w)+';
            var re=new RegExp(strRegex);
            if ( re.test(str_url) ){
                return (true);
            }else{
                return (false);
            }
        },
        //清除字符串首位空格
        trim : function(str){
            return str.trim ? str.trim() : str.replace(/^\s+/ , '').replace(/\s+$/ , '');
        },
        //获取字符串长度 汉字 += 1 字母 += 0.5
        GetStringLength : function(s){
            var w = 0; 
            for (var i=0; i<s.length; i++) {
                var c = s.charCodeAt(i);
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                    w += 0.5; 
                }
                else {
                    w += 1;
                }
            };    
            return w;
        },
		getStringLength : function(s){
			return s.replace(/[^\x00-\xff]/g,"**").length / 2;
		},
        //检查字符串长度限制 s = string n = max number
        WidthCheck : function(s, n){ 
            if ( this.GetStringLength(s) > n) {
                return false;
            }
            return true;
        },
        //截取字符串最大限制
        cutstr : function(str , len){
             var str_length = 0; 
             var str_len = 0; 
             str_cut = ''; 
             str_len = str.length; 
             for(var i = 0; i < str_len; i++){ 
                 a = str.charAt(i); 
                 str_length++; 
                 if(escape(a).length > 4){ 
                     //中文字符的长度经编码之后大于4 
                     str_length++; 
                 } 
                 str_cut = str_cut + a; 
                 if(str_length>=len){ 
                     str_cut = str_cut + '...'; 
                     return str_cut; 
                 } 
             } 
             //如果给定字符串小于指定长度，则返回源字符串； 
             if(str_length < len){ 
                 return  str; 
             } 
        },
		//替换转义标签
		escapeString : function(s){
			if(!s || s == '') return '';
			return s.replace(/</g , '&lt;').replace(/>/g , '&gt;');	
		}
    }
});
