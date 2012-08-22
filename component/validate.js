/*******************
*data 2012-03-23
*author chudongjie
*email dongjiechu@meilishuo.com
********************/
fml.define('component/validate',[],function(require , exports){
	return {
		/*参数：
		----表单id;
		----规则集:{表单元素id1:{验证规则1=规则参数1:错误提示信息1，
			验证规则2=规则参数2:错误提示信息2, ...}, ...};		//注: email没有参数
		----验证结果样式:{结果样式=显示错误提示divId};			//注: showmsgbyline不需要参数
		eg: validate('myform', {'username':{'req=邮箱', 'email'},
			'showmsgbyone=messageBox'}});
		*/
		validate : function(formName, validateRules, showStyle){
			var formObj = document.forms[formName];
			if (!formObj) {
				alert('不存在这个表单:'+formName);
				return;
			}
			//验证规则集合
			var ruleSet = {'req':validateRequired,			//必填项			参数: req=表单元素的默认值
						'maxlen':validateMaxLen,			//最大长度			参数: maxlen=长度值
						'minlen':validateMinLen,			//最小长度			参数: minlen=长度值
						'email':validateEmail,				//验证邮箱			参数: email
						'compare':validateCompare,			//验证是否相等		参数: compare=被比较元素name
						'selectmax':validateSelectMax,		//radio最多选几项	
						'selectmin':validateSelectMin,		//radio最少选几项
						'selectradio':validateSelectRadio};	//radio必选项
			//验证结果样式集合
			var styleSet = {'showmsgbyline':showMsgByLine,	//onblur逐行验证并返回结果
						'showmsgbyone':showMsgByOne};		//一次总验证并返回第一个错

			var formElements = formObj.elements,
				itemSetForLine = {},	//用于逐行验证的中间数组
				showStyleFun,			//错误提示的显示方式
				messageItem,			//一次验证的错误信息提示divId, 或者逐行验证的错误提示的class(用于自定义样式)
				stylePos = showStyle.indexOf('=');
			if (stylePos != -1) {
				showStyleFun = styleSet[showStyle.substring(0, stylePos)];
				messageItem = showStyle.substring(stylePos + 1);
			} else {
				showStyleFun = styleSet[showStyle];
			}
			if (!showStyle&&!showStyleFun) {
				alert('错误, 没有显示方式参数');
				return;
			}
			if (typeof validateRules!='object') {
				alert('错误, validateRules参数错误... ');
				return;
			}
			for (var itemName in validateRules) {
				var rules = validateRules[itemName],
					itemObj = formElements[itemName];
					itemSetForLine[itemName] = [];
				for (var rule in rules) {
					var pos,				 
						arg,				//验证规则参数
						err = rules[rule];	//错误提示
					if ((pos=rule.indexOf('='))!=-1) {
						arg = rule.substring(pos+1);
						rule = rule.substring(0, pos);	//update rule
					}
					var ruleFun = ruleSet[rule];
					if (!ruleFun) {
					    alert('错误, 不存在这个验证规则');
					    return;
					}
					if (showStyleFun == showMsgByLine) {
						itemSetForLine[itemName][rule] = [ruleFun, arg, err];
					} else {
						if (!ruleFun(itemObj, arg)) {
							showMsgByOne(messageItem, err);
							return;	//有一条错误提示时, 中断退出
						}
					}
				}	
			}
			if (showStyleFun == showMsgByLine) {
			    showMsgByLine(itemSetForLine, messageItem);
			}  
			//逐行显示验证错误信息
			function showMsgByLine(itemSet, messageItemClass) {
			    for (var itemName in itemSet) {
			        var itemObj = formElements[itemName];
				    itemObj.onblur = function(){
			            var itemValidate = itemSet[this.name];
						for (var k in itemValidate) {
						    var e = document.getElementById('msg'+this.name);
						    e && e.parentNode.removeChild(e);
						    if (!itemValidate[k][0](this, itemValidate[k][1])) {
						        showMsgOnLine(this, itemValidate[k][2], messageItemClass);
						        return;
						    }
						}
					};
				}
			}
			//在表单元素右侧显示错误提示信息----在itemObj节点的父节点div后面插入错误提示
			function showMsgOnLine(itemObj, err, messageItemClass) {
			    if (typeof err == 'function') {
			        err();
			        return;
			    }
			    if (typeof err != 'string') return;
			    var messageBox = document.createElement('label');
			    messageBox.setAttribute('id', 'msg'+itemObj.name);
				messageBox.setAttribute('class', messageItemClass);
				messageBox.innerHTML = err;
				insertAfter(messageBox, itemObj.parentNode);
			}
			//在targetEl节点后面插入newEl节点
			function insertAfter(newEl, targetEl) {
				cleanWhitespace(formObj);
				var parentEl = targetEl.parentNode;
				parentEl.lastChild == targetEl ? parentEl.appendChild(newEl) : parentEl.insertBefore(newEl, targetEl.nextSibling);
			}
			//清理空白节点--for firefox
			function cleanWhitespace(oEelement)
			{
				for(var i=0;i<oEelement.childNodes.length;i++){
					var node=oEelement.childNodes[i];
					if(node.nodeType==3 && !/\S/.test(node.nodeValue)) { 
						node.parentNode.removeChild(node);
					}
				}
			}
			//只在特定位置显示一条错误提示信息
			function showMsgByOne(messageItemId, err) {
			    if (typeof err == 'function') {
			        err();
			        return;
			    }
			    if (typeof err != 'string') return;
			    var itemObj = document.getElementById(messageItemId);
				itemObj.innerHTML = err;
			}
		
			/*********验证规则集***********/
			function validateRequired(itemObj, defaultVal) {
				var itemVal = itemObj.value;
				return (itemVal!=''&&itemVal!=defaultVal);
			}
			function validateMaxLen(itemObj, maxLen){
			   return (itemObj.value.length <= maxLen);
			}
			function validateMinLen(itemObj, minLen){
				return (itemObj.value.length >= minLen);
			}
			function validateEmail(itemObj){
				var re = /\S+@\S+\.\S+/;
				return re.test(itemObj.value);
			}
			function validateCompare(itemObj, compareItem) {
				var comparedItemVal = document.forms[formName].elements[compareItem].value;
				return (itemObj.value === comparedItemVal);
			}
			function validateSelectMax(itemObj, maxNum) {
				var num = 0;
				for (var r in itemObj) {
					itemObj[r].checked && num++;
				}
				return (num < maxNum);
			}
			function validateSelectMin(itemObj, minNum) {
				var num = 0;
				for (var r in itemObj) {
					itemObj[r].checked && num++;
				}
				return (num > minNum);
			}
			function validateSelectRadio(itemObj) {
				return itemObj.checked;
			}
		}//end validate()
	};//end return
});
