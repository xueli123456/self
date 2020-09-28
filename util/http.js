// var baseURL = "h";    // 测试后台
var baseURL = "http:";    // 正式后台(内网)
function baseAjax(path,data,type,success,error,dataType){
    // console.log('接口请求地址前部分')
    /*
    path:接口请求地址拼接部分
    data:参数
    type:请求参数
    success:成功回调
    error:失败回调
    dataType:返回路径类型
 */
    //设置默认参数
    data = data || {};
    type =  type || 'POST';
    dataType = dataType || 'JSON';
    // console.log(localStorage.getItem("token"));
    jQuery.support.cors = true; 
    jQuery.ajaxSetup({
        xhr: function() {
            if(window.ActiveXObject){
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            }else{
                return new window.XMLHttpRequest();
            }
        }
    });
    $.ajax({
        headers: {
            // Authorization:localStorage.getItem("token")//此处放置请求到的用户token
            Authorization:getCookie("token")
        },
        contentType: "application/json;charset=UTF-8",
        url:baseURL+path,
        type: type,
        data:JSON.stringify(data),
        beforeSend:function(){
            //发送请求前的操作
        },
        success:function(res){
            //请求成功操作
            // console.log('请求成功操作');
            // console.log(res);
            success(res)
        },
        error:function(res){
            //请求失败后进行的操作
            $(".tipPopup-mask").css("display", "block")
            ZENG.msgbox.show( "服务器繁忙，请稍后再试。", 1,2000);
            setTimeout(function(){
                $(".tipPopup-mask").css("display", "none")
                // window.location.href = "index.html"
            },2000)
            // console.log(res);
            // console.log('失败提示');
        }
    })
}
function post(path,data,success,error){
    baseAjax(path,data,'POST',success,error)
}
function get(path,data,success,error){
    baseAjax(path,data,'GET',success,error)
}

//使用
// post( ,{},function(res){
//     console.log("提交成功");
// },function(){
//     console.log("提交失败！")
// });
function getCookie(name) {
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return "";
}
