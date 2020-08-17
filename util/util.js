// var linkList = document.getElementsByTagName('link');
// // var versionNum = 20200119;
// // function changeVersion(arr,flag){
// //     if(flag =='css'){
// // //      for (var item of arr) {
// // //          item.href = item.href+'?version='+versionNum
// // //          //console.log(item.href)
// // //      }
// //     }else if(flag =='script'){
// // //      for (var item of arr) {
// // //          item.src = item.src+'?version='+versionNum
// // //      }
// //     }
// // }
// // changeVersion(linkList,'css')
// 操作倒计时
// 92530018103527854
// function getCookie(name) {
//     var strcookie = document.cookie;//获取cookie字符串
//     var arrcookie = strcookie.split("; ");//分割
//     //遍历匹配
//     for (var i = 0; i < arrcookie.length; i++) {
//         var arr = arrcookie[i].split("=");
//         if (arr[0] == name) {
//             return arr[1];
//         }
//     }
//     return "";
// }
// function delCookie(name) {
//     var exp = new Date();
//     exp.setTime(exp.getTime() - 1);
//     var cval=getCookie(name);
//     if(cval!=null)
//         document.cookie= name + "="+cval+";expires="+exp.toGMTString();
// }


// 获取当前日期
function showTimes() { //获取当前日期
    var date_time = new Date();
    //定义星期
    var week;
    //switch判断
    switch(date_time.getDay()) {
        case 1:
            week = "星期一";
            break;
        case 2:
            week = "星期二";
            break;
        case 3:
            week = "星期三";
            break;
        case 4:
            week = "星期四";
            break;
        case 5:
            week = "星期五";
            break;
        case 6:
            week = "星期六";
            break;
        default:
            week = "星期日";
            break;
    }
    //年
    var year = date_time.getFullYear(); //判断小于10，前面补0
    if(year < 10) {
        year = "0" + year;
    }
    //月
    var month = date_time.getMonth() + 1; //判断小于10，前面补0
    if(month < 10) {
        month = "0" + month;
    }
    //日
    var day = date_time.getDate(); //判断小于10，前面补0
    if(day < 10) {
        day = "0" + day;
    }
    //时
    var hours = date_time.getHours(); //判断小于10，前面补0
    if(hours < 10) {
        hours = "0" + hours;
    }
    //分
    var minutes = date_time.getMinutes(); //判断小于10，前面补0
    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    //拼接年月日时分
    var date_str = year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + " " + week;
    //显示在id为showtimes的容器里
    document.getElementById("timer").innerHTML = date_str;
}
//设置1秒调用一次show_cur_times函数
setInterval( 'showTimes()', 1000);

    //患者信息
    var patientInfo = JSON.parse(localStorage.getItem("records"))
    if(patientInfo){
        // //console.log('患者'+ patientInfo.patientName);
        $('.name').html(patientInfo.patientName);
        $('.sex').html(patientInfo.patientSex);
        $('.age').html(patientInfo.patientAge);
    }
    $('.backBtn').click(function(){
        window.history.back();
    });
    var oBackHome = document.getElementById('clickBackHome');
    if( oBackHome){
        oBackHome.onclick = function(){
            window.location.href = "index.html?patientId="+localStorage.getItem("patientId")
        }
    }
