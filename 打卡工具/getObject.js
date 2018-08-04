 personArr = new Array();
 personDic = new Object();
 var userName = '';
 var fileName = '';
function getMumberArr(totoArr) {
	
	for (var i = 1; i < totoArr.length; i++) {

		var singleArr = totoArr[i];
		var person = new Object();
		person.bumen = singleArr[0];//部门
		person.name = singleArr[1];//姓名
		person.num = singleArr[2];//考勤号码
		person.date = singleArr[3];//日期时间
		person.status = singleArr[4];//记录状态
		person.mnum = singleArr[5];//机器号
		person.bianhao = singleArr[6];//编号
		person.gongzhongdaima = singleArr[7];//工种代码
		person.duibifangshi = singleArr[8];//对比方式
		person.kahao = singleArr[9];//卡号
		if (personDic[singleArr[1]]) {

			var nameKeyArr = personDic[singleArr[1]];
			nameKeyArr.push(person);
			
		} else {

			var nameKeyArr = new Array();
			nameKeyArr.push(person);
			personDic[singleArr[1]] = nameKeyArr;
			
		}
	}

	//alert(JSON.stringify(personDic, 2, 2));
	var allWorkers = '';
	var allWorkersDiv = document.getElementById('allWorkersDiv');

	var num = 0;
	var props = "";
	for(var p in personDic){ 
        // 方法
        if(typeof(personDic[p])=="function"){ 
           personDic[p]();
       }else{ 
           // p 为属性名称，obj[p]为对应属性的值
            props+= p + "\t";
            allWorkers += '<input class = "workName" type="radio" onclick="radioClick(this)" name="workName" value='+ p +' />' + p + '          ';
            num += 1;
        } 
     } 
     allWorkersDiv.innerHTML = allWorkers;

     //alert('总共' + num + '名员工' + "\n" + '员工列表:' + props);
     //window.location.href="searchYG.html?arr =" + personDic; 
     
}

//点击工人名字
function radioClick(radio)
{
	var name = radio.value;
	userName = name;
	getWorksWorkTime(personDic);
}

//进行筛选
function getWorksWorkTime(personTotleDic){
    
    var resultTableDiv = document.getElementById('resultTableDiv');
	var workRecordArr = getEveryDayDaKaRecord(personTotleDic,userName);
	var str = "<table border='1'>";
	str = str + '<tr><th>姓名</th><th>日期</th><th>打卡次数</th><th>打卡时间</th><th>白班出勤状态</th><th>夜班出勤状态</th></tr>';
	for (var i = 0 ;i < workRecordArr.length ; i ++) {
		
		var obj = workRecordArr[i];
		//打开状态白天
		var infomation = dayWorkZj(obj.timeArr);
		//打卡状态晚间
		var infomationNight = nightWorkZj(obj.timeArr);
		str = str + '<tr><th>' + obj.name + '</th>' + '<th>'+ obj.date + '</th>'+ '<th>'+ obj.daKaCiShu + '</th>' + '<th>' + obj.timeAll + '</th>' + '<th>' + infomation + '</th>' + '<th>' + infomationNight +'</th></tr>';
	}
	str = str + "</table>";
	resultTableDiv.innerHTML = str;
}

//对每一个员工进行工时展示
function getSigleWorkerTime(workName,personTotleDic){

	var nameArr = new Array();

	nameArr = personTotleDic[workName];
	var resultTableDiv = document.getElementById('resultTable');
	
	var str = "<table border='1'>";
	str = str + '<tr><th>姓名</th><th>日期时间</th><th>转换日期时间</th></tr>';
	for (var i = 0 ;i < nameArr.length ; i ++) {
		
		var obj = nameArr[i];
		var date = new Date(obj.date);
		str = str + '<tr><th>' + obj.name + '</th>' + '<th>'+ obj.date + '</th>' + '<th>' + timestampToTime(date.getTime()) + '</tr></th>';
	}
	str = str + "</table>";
	resultTableDiv.innerHTML = str;
}

//变为时间格式
function timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y+M+D+h+m+s;
}

//获取日期(年月日)
function getYMD(timestamp)
{
	var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    return Y+M+D;
}

//获取时分秒
function getHMS(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return '['+h+m+s+']'+'   ';
}

//获取当日打卡秒数
function getSeconds(timestamp)
{
	var date = new Date(timestamp);
	h = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();
	return h * 3600 + m * 60 + s;
}

//整理每日的打卡时间
function getEveryDayDaKaRecord(personTotleDic,workName)
{

    //创建保存的数组
    var sigleWorkerRecordArr = new Array();
    //整理每天的打卡时间
    var nameArr = new Array();
    nameArr = personTotleDic[workName];
    for(var i = 0;i < nameArr.length ; i ++){

   	   var worker = nameArr[i];
   	   //获取日期
   	   var dateYMD = getYMD(worker.date);
   	   var objRecord = null; 
   	   //筛选是否有已存的数据
   	   for (var j = 0; j < sigleWorkerRecordArr.length;j ++) {
           
           var objTemp = sigleWorkerRecordArr[j];
           if (objTemp.date == dateYMD) {
               
               objRecord = objTemp;
               //break;
           }
   	   }
   	   //*****************//

   	   //判断是否已储存
   	   //alert(objRecord);
   	   if (objRecord) {

   	   	   objRecord.daKaCiShu += 1;
   	   	   var timeArr = objRecord.timeArr;
   	   	   timeArr.push(getSeconds(worker.date));
   	   	   objRecord.timeAll += getHMS(worker.date);
   	   } else {

   	   	   objRecord = new Object();
   	   	   var timeArr = new Array();
   	   	   objRecord.name = worker.name;
   	   	   objRecord.timeAll = getHMS(worker.date);
   	   	   objRecord.date = dateYMD;
   	   	   objRecord.daKaCiShu = 1;
   	   	   timeArr.push(getSeconds(worker.date));
   	   	   objRecord.timeArr = timeArr;
   	   	   sigleWorkerRecordArr.push(objRecord);
   	   }
   	   //*****************//
    }
    return sigleWorkerRecordArr;
}

//晚班计算
function nightWorkZj(timeArr)
{
	var infomation = '';
	var zhongWu = 0;
	var zaoShang = 0;
	var xiaWu = 0;
	for(var i = 0; i < timeArr.length; i ++){

		var time = timeArr[i];
		//晚上7点前
		if (time > 17 * 3600 && time < 19 * 3600) {

			zaoShang += 1;

		}

		//晚班
		if (time > 23.5 * 3600 && time < 24 * 3600) {

			zhongWu += 1;
		}

		//早上7点前
		if (time > 7 * 3600 && time < 9 * 3600) {

			xiaWu += 1;
		}

	}
	//判断作息状态
		if (zaoShang > 0 && zhongWu >= 2 && xiaWu > 0) {

			infomation = '打卡正常';
		} else {

			if (zaoShang == 0) {

				infomation += '晚班晚间迟到或请假。';
			}

			if (zhongWu == 0) {

				infomation += '午间休息未打卡。';
			}

			if (zhongWu == 1) {

				infomation += '午间休息仅打卡一次。';
			}

			if (xiaWu == 0) {

				infomation += '晚班早晨早退或请假。';	
			}
		} 
	return infomation;
}
//白班计算
function dayWorkZj(timeArr)
{
	var infomation = '';
	var zhongWu = 0;
	var zaoShang = 0;
	var xiaWu = 0;
	for(var i = 0; i < timeArr.length; i ++){

		var time = timeArr[i];
		//早上8点前
		if (time < 8 * 3600) {

			zaoShang += 1;

		}

		//中午
		if (time > 12 * 3600 && time < 12.5 * 3600) {

			zhongWu += 1;
		}

		//晚上5点半后
		if (time > 17.5 * 3600) {

			xiaWu += 1;
		}
	}
	//判断作息状态
		if (zaoShang > 0 && zhongWu >= 2 && xiaWu > 0) {

			infomation = '打卡正常';
		} else {

			if (zaoShang == 0) {

				infomation += '上午迟到或请假。';
			}

			if (zhongWu == 0) {

				infomation += '中午未打卡。';
			}

			if (zhongWu == 1) {

				infomation += '中午仅打卡一次。';
			}

			if (xiaWu == 0) {

				infomation += '下午早退或请假。';	
			}
		} 
	return infomation;
}

