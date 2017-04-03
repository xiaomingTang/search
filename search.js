/*
 *总体思路是:
 *
 *例如要在str中检索"hello"
 *
 *取得"hello"中每个字符在str中的位置
 *
 *如果所有字符 按顺序 相邻,则匹配成功
 *
 *但是有一个很严重的bug,叠词搜索,暂时没想到好办法...
 *
*/


window.onload=function(){
 	
	function $(id){
		return document.getElementById(id);
	}
	
	//输入一个string字符串，返回"记录每个字符所在位置"的obj对象
	//用于对原始str数据的初始化,转化为对象,使之能记录下每个字符的位置
	//如一个字符有多个位置,则位置间以"_"间隔,如  "我":{"times":5,"position":"13_24_35_46_58"}
	function recordPosition(str){
		var obj={};
		
		for(var i=0,len=str.length;i<len;i++){
			var c=str.charAt(i);
			if(!(c in obj)){
				obj[c]={};
				obj[c]["times"]=1;
				obj[c]["position"]=""+i;
			}
			else{
				obj[c]["times"]+=1;
				obj[c]["position"]+="_"+i;
			}
		}
		return obj;
	}
	
	//输入单个字符s和要查找的obj对象,返回字符在对象中的所有位置,数字(字符串格式)组成的数组 如["12","23","45"]
	//不存在则返回空数组
	function getPosition(s,obj){
		var arr=[],
			c=s.charAt(0);
		if(c in obj){
			var pos=obj[c]["position"];
			arr=pos.split("_");/////////////////////////这儿忘了转为数字???
		}
		return arr;
	}
	
	//类似 [ [23, 12, 45], [24, 11, 33], [13, 25] ] 这样的二维数组,我称为"加一序"(序列为23,24,25),返回值为[23]
	//(上面的12,11,13不属于要求序列,因为顺序不对)
	
 	//判断二维数组是否是"加一序"的数组
	//如果是,返回由最小数字（number数据类型）组成的数组
	//如果不是,返回false
	function isInc(arr){
		var obj={},
			temp=[],
			result=[],
		deduplicate=function(arr){
			var obj={};
			for(var i=0,len=arr.length;i<len;i++){
				obj[arr[i]]=1;
			}
			return Object.keys(obj);
		}
			
		for(var i=0,leni=arr.length;i<leni;i++){
			arr[i]=deduplicate(arr[i]);
			for(var j=0,lenj=arr[i].length;j<lenj;j++){
				if(arr[i][j]-i in obj){
					obj[arr[i][j]-i]++;
				}
				else{
					obj[arr[i][j]]=1;
				}
			}
		}
		
		temp=Object.keys(obj);
		for(var i in temp){
			if(obj[temp[i]]==arr.length){
				result.push(parseInt(temp[i]));
			}
		}
		if(result.length==0){
			return false;
		}
		else{
			return result;
		}
	}
	
	//输入待检索词和目标对象
	//如果待检索词完全匹配,则返回"由所有 完全匹配序列 列首位置"组成的数组,如[23,35]
	//否则返回false
	function perfectMatch(str,obj){
		var len=str.length,
			tempArr=[];
		for(var i=0;i<len;i++){
			tempArr.push(getPosition(str.charAt(i),obj));
		}
		return isInc(tempArr);
	}	
	
	//输入一个字符串,断点位置,需要挑出的字符个数,以数组形式返回分割好的字符串
	//返回格式为 [ preStr,targetStr,lastStr ]
	//例如将"hello world!"分割成["hel","lo w","orld"]
	function splitAt(str,pos,num){
		var arr=[];
		
		var chip=str.slice(0,pos);
		arr.push(chip);
		chip=str.slice(pos,pos+num);
		arr.push(chip);
		chip=str.slice(pos+num,str.length);
		arr.push(chip);
		
		return arr;
	}
	
	
	//输入待检索字符串及文本库libStr,返回处理后的frag节点
	function getFrag(str,libStr){
		var libObj=recordPosition(libStr),
			posArr=perfectMatch(str,libObj),		//断点位置数组
			frag=document.createDocumentFragment(),
			lenStr=str.length;
		
		console.log(posArr);
		
		if(!posArr){
			return frag;
		}
		
		var last=posArr.length-1
			str=libStr.slice(0,posArr[0]);
		frag.appendChild(document.createTextNode(str));
			
		for(var i=0;i<last;i++){
			if(i==0 || posArr[i]>=posArr[i-1]+lenStr){
			var str=libStr.slice(posArr[i],posArr[i]+lenStr);
				em=document.createElement("em");
			frag.appendChild(em);
			em.appendChild(document.createTextNode(str));
			
			var str=libStr.slice(posArr[i]+lenStr,posArr[i+1]);
			frag.appendChild(document.createTextNode(str));
			}
		}
		
		var str=libStr.slice(posArr[last],posArr[last]+lenStr);
				em=document.createElement("em");
			frag.appendChild(em);
			em.appendChild(document.createTextNode(str));
		
		var str=libStr.slice(posArr[last]+lenStr);
		frag.appendChild(document.createTextNode(str));
		
		return frag;
	}
	
	
	var libStr="哈哈哈哈哈，我依然记得在2008年的夏天我进入了社会这个复杂的环境体系之中，经过了富士康的三年多的沉淀，而后在一无所获之后毅然的离开了这个熟悉的地方，我满怀无限热情，开始了我两年近乎于流浪的生活，东南西北，漫无目的，我抱着年轻的资本以体验青春感悟生活的方式行走在一条被世人所不能接受的道路上，而后落魄不堪，颠沛流离之后，走到了现在，收敛了不少锋芒，锐气也在现实的不断打磨中负了当年，更有可能在旁人看来，我已然没了当年的雄心壮志，变得趋向于平静，不可否认两年多的生活让我的确看清和认识了很多以往看不真切的东西，脸上多少爬上了一些不何年龄的沧桑！对于“梦想”这两个字眼也确实是有了一些新的认识，就目前的生活而言，平淡，平静，索然无味。为此我不谈任何抱怨，因为我心中依然匍匐着一只猛虎，豪情万丈，狂放洒脱的话语，我以不在人前多言，但如此就认为我心如止水那么也是一个错位的判断！自我懂事以来我一向自命不凡，自视极高，哪怕我面对的是今天这样的局面我依旧不觉得我看错了自己。";
	
	$("search").appendChild(document.createTextNode(libStr));
	
	var libObj=recordPosition(libStr);
	
	 $("inputbox").onkeyup=function(event){
		 var e=event || window.event,
			str=e.target.value,
			frag=getFrag(str,libStr);
		
		if(!!frag.firstElementChild){
			$("search").innerHTML="";
			$("search").appendChild(frag);
		}
	}
 	
}
