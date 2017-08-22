				// 查找某个元素是否在数组中存在
			// 如果存在，则返回其在数组中的下标
			// 不存在，则返回 -1
			// 参数：
			//		value: 待查找值
			//		array: 数组
			// 返回值：
			//		数组中的下标，-1表示不存在
			function inArray(value, array) {
				if (Array.prototype.indexOf) // 浏览器支持使用 indexOf 方法
					return array.indexOf(value);
				// 不支持使用 indexOf() 方法，则循环遍历
				for (var i = 0, len = array.length; i < len; i++) {
					if (array[i] === value)
						return i;
				}
				return -1;
			}
			
			
	//调用getByClassName函数，解决ie9以下不兼容getElementsByClassName的问题
	//原理：遍历指定 context中所有标签，找出每个标签的class名，与目标class名对比，相同则将该标签放入一个数组中；遍历完后返回数组
	
			function $(selector,context){
				context=context||document;
				if(selector.charAt(0)=="#")
					return document.getElementById(selector.slice(1));
				else if(selector.charAt(0)==".")
					return getByClassName(selector.slice(1),context);
				else
					return context.getElementsByTagName(selector);
			}
			
			
			function getByClassName(className,context){
				if(document.getElementsByClassName){
					return context.getElementsByClassName(className);
				}
				var elements=$("*",context)//elements=context.getElementsByTagName("*");"*"表示所有元素
					reslut=[];
					for(var i=0,len=elements.length;i<len;i++){
						var cons=[];
							cons.push(elements[i].className.split(" "));//获取遍历到的标签的 所有class 名，以空格分割开放到数组中
						for(var j=0;j<cons.length;j++){
							if(className==cons[j]){
								reslut.push(elements[i]);
								break;
							}
						}						
					}			
				return reslut;	
			}
			//封装函数，执行获取元素css样式、设置元素css样式等操作
			//ele 代表参与操作的元素；
			//传入两个参数，并且第二个参数为字符串时，执行获取操作
			//传入两个参数，并且第二个参数为对象时，执行设置操作
			//传入三个参数，执行设置操作
			// 返回值：
			//		在获取元素CSS属性值的情况下，返回字符串
			function CSS(ele,attr,value){
				if(typeof attr=="string"&& typeof value=="undefined"){//第二个参数为字符串，没有传入第三个参数
					//可换成三目运算符
					return window.getComputedStyle ? getComputedStyle(ele)[attr] : ele.currentStyle[attr]
					//解决IE低版本不兼容 getComputedStyle（支持currentStyle） 的问题
//					if(window.getComputedStyle){
//						return getComputedStyle(ele)[attr];
//					}
//					return ele.currentStyle[attr];
				}
				else if(typeof attr =="object"){//第二个参数为对象
					for(var prop in attr){
						ele.style[prop]=attr[prop];
					}
				}
				else{
					ele.style[attr]=value;
				}
			}
			
//封装函数，为指定元素添加class类名
function addClass(ele,ClassName){
	var ClassNames=ele.className.split(" ");//将指定元素的class名以空格分割，以数组形式存在ClassNames里面
	var index=inArray(ClassName,ClassNames);//查找需要添加的类名在指定元素里面是否存在(在ClassNames中找ClassName)
		if(index !== -1)
			return;//当指定元素里面有该class类名，直接结束函数
		ClassNames.push(ClassName);//否则就将需要添加的类名加入ClassNames 数组中
		ele.className=ClassNames.join(" ");	//以字符串形式用空格分开赋给原类名
}

//封装函数，为指定元素移出class类名
function removeClass(ele,ClassName){
	var ClassNames=ele.className.split(" ");
	var index=inArray(ClassName,ClassNames);
		if(index === -1)
			return;
		ClassNames.splice(index,1);
		ele.className=ClassNames.join(" ");
		
}
//添加（注册）事件监听
function on(ele,ons,callback){//ele：需要注册事件监听的元素；ons：事件行为；callback：事件函数
	if(document.addEventListener){//如果支持 addEventListener方法，就直接使用
		if(ons.indexOf("on")== 0)
			ons=ons.slice(2);
		ele.addEventListener(ons,callback);
	}
	else{//不支持addeventListener方法，则使用  attachEvent方法
		if(ons.indexOf("on")!== 0)
			ons="on"+ons;
		ele.attachEvent(ons,callback);
	}
}

//移出事件监听
function remove(ele,ons,callback){
	if(document.addEventListener){//如果支持 addEventListener方法，就直接使用
		if(ons.indexOf("on")== 0)
			ons=ons.slice(2);
		ele.removeEventListener(ons,callback);
	}
	else{//不支持removeeventListener方法，则使用  detachEvent方法
		if(ons.indexOf("on")!== 0)
			ons="on"+ons;
		ele.detachEvent(ons,callback);
	}
}


//封装函数，获取元素在文档中的位置
function ofTop(ele){//获取垂直间距
	var _top=0;
		while(ele!== null){
			_top=_top+ele.offsetTop;
				ele=ele.offsetParent;
			}
			return _top;
	}
function ofLeft(ele){//获取水平间距
	var _left=0;
		while(ele!== null){
			_left=_left+ele.offsetLeft;
			ele=ele.offsetParent;
		}
		return _left;
	}


//封装函数，保存/修改 cookie 值 
//	name : cookie名
//	value: cookie值
//	back: 可配置选项，是对象的类型，如：
//			{expires:100, path:"/", domain:".baidu.com", secure:true}	
function setCookie(name,value,back){
		//保存cookie
	var cookies=encodeURIComponent(name)+"="+encodeURIComponent(value);
		back=back||{};
		//判断是否设置失效时间
		if(back.expires){
			var date=new Date();//获取当前时间
				date.setDate(date.getDate()+back.expires);//设置失效时间为   传入的天数后
			cookies+=";expires="+date.toUTCString();
		}
		if(back.path){//设置了保存路径
			cookies+=";path="+back.path;
		}
		if(back.domain){//设置了域名
			cookies+=";domain="+back.domain;
		}
		if(back.secure){//设置了安全链接
			cookies+=";secure";
		}
	document.cookie=cookies;
}
//封装函数，删除cookie  
function removeCookie(name,back){
	back=back||{};
	back.expires=-1;
	setCookie(name,"",back);
}

//封装函数，查找cookie值
function getCookie(name){
	var cookies=document.cookie;
	var arr=cookies.split("; ");//将整个cookie以 “； ”（分号+空格）分割
	for(var i=0;i<arr.length;i++){//遍历arr数组
		var cks=arr[i].split("=");//将数组每个元素以“=”分割开
		var names=decodeURIComponent(cks.shift());//将第一个元素解码后判断是否与要查找的cookie名相同
		if(names == name){//如果相同
			return decodeURIComponent(cks.join("="));//将删除第一个元素后的其余元素以等号链接后，解码并返回
		}
	}
	return null        //如果没有找到，返回null
}

// 运动框架
// 参数：
//		element : 待添加运动动画效果的元素
//		attr : 运动动画设置目标终值的对象
//		time : 控制总运动时长
//		fn : 可选函数，在运动动画结束后要执行的函数
function animate(ele,attr,time,fn){
			clearInterval(ele.timer);
			// 为多属性初值、范围设定对象
			var start={},opc={};
				for(var attrName in attr){
					start[attrName]=parseFloat(CSS(ele,attrName));
					opc[attrName]=attr[attrName]-start[attrName];	
				}
			// 记录启动计时器前时间
			var startTime=+new Date();
				ele.timer=setInterval(function(){
				var nowTime=+new Date();
					// 计算运动消耗时间
					opcTime=nowTime-startTime;
					opcTime=Math.min(opcTime,time);
					// 计算各属性当前步
					for(var attrName in attr){
						var _result=start[attrName]+opc[attrName]*opcTime/time;
							ele.style[attrName]=_result+(attrName=="opacity" ? "" : "px");
					}
					// 判断是否停止计时器
					if(opcTime==time){
						clearInterval(ele.timer);
						fn&&fn();
					}
				
			},1000/60)
						
		}

function fadeIn(ele,time,fn){//淡入效果
	CSS(ele,"display","block");
	CSS(ele,"opacity",0);
	animate(ele,{opacity:1},time);
}

function fadeOut(ele,time,fn){//淡出效果
	CSS(ele,"opacity",1);
	animate(ele,{opacity:0},time,function(){
		CSS(ele,"display","none");
	});
	
}

//设置元素在文档中的位置
// 参数：
//		ele: DOM元素
//		loca: 待设置的文档坐标，以{}对象传递，有top，left两个属性
function offset(ele,loca){
	var eles=ele.offsetParent,_left=0,_top=0;
		while(eles){//找到父元素在文档中的位置
			_left+=eles.offsetLeft;
			_top+=eles.offsetTop;
			eles=eles.offsetParent;
		}
		
//		将元素在文档中的位置与在其父元素中的位置换算
		CSS(ele,{
			left:loca.left-_left+"px",
			top:loca.top-_top+"px"
		});
}


// ajax
/*  options = {
		type : "get|post", // 请求方式，默认为 get
		url : "path", // 请求资源的url
		data : {username:"张三", "password":"abc"}, // 需要向服务器传递的数据
		dataType : "json|text", // 预期从服务器返回的数据格式
		success : function(responseData){}, // 请求成功时执行的函数
		error : function(errorMsg){} // 请求失败时执行的函数
	}
*/

function ajax(options){
//		console.log("aaa");
	var url=options.url;
		if(!url)// 没有请求的 URL 则直接结束函数执行，不需要再向后执行
			return;
		method=options.type||"get";//获取请求方式，默认为get
		// 如果有向服务器传递的数据，则连接查询字符串内容
	var queryString=null;//查询字符串
		if(options.data){//如果有传data对象
			queryString=[];
			for(var arr in options.data){//遍历data对象每个元素
				queryString.push(arr+"="+options.data[arr])//将其属性与属性值用“ = ” 连接后添加到数组中
			}
			queryString=queryString.join("&");//再将数组中所有元素用&符连接成字符串
		}
		if(method=="get"){
			url=url+"?"+queryString;
			queryString=null;
		}
	//1.创建核心对象
	var xhr=new XMLHttpRequest();
	//2.建立连接
		xhr.open(method,url,true);
	//3.发送请求
	if(method=="post")
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(queryString);
	//4.处理响应
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){//请求成功
					var data=xhr.responseText;//获取服务器返回值
					if(options.dataType=="json"){//如果逾期返回值为json格式
						data=JSON.parse(data);//将其转换为JS值
					}
					options.success&&options.success(data);//如果请求成功后有函数需要执行则执行
				}else{//请求不成功
					options.error && options.error(xhr.statusText);//执行请求失败函数
				}
			}
		}
}



