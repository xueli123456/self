//获取token
// //console.log($(".tipPopup-mask"));
$(".tipPopup-mask").css("display", "block")
ZENG.msgbox.show("正在加载中，请稍后...", 6, 10000);
localStorage.removeItem("records");
var patientId = getQueryVariable('patientId');
window.localStorage.setItem("patientId", patientId);
localStorage.getItem("patientId")
//方法
function getQueryVariable(variable){//获取参数id
    var url = window.location.href.split("?")[1];
    var paramerValue = url.substring(10,url.length);
    var key = url.substring(0,9);
    return paramerValue;
}
if(patientId){
    post( 'token/getTokenOfSelf/'+ patientId,{},function(res){
        if(res.code == 200){
            document.cookie = "token=" + res.result;
            //通过患者诊疗号获取患者信息
            post( 'selfMachine/getPatientInfoByPatientId/'+ patientId,{},function(res){
                //console.log(res);
                countdown('92530018103527854',false);
                if(res.code == 200){
                    $(".tipPopup-mask").css("display", "none")
                    ZENG.msgbox._hide();
                    var data = res.result;
                    var records = {
                        patientName: data.patientName,
                        patientSex: data.patientSex,
                        patientAge: data.patientAge
                    };
                    records = JSON.stringify(records);
                    window.localStorage.setItem("records", records);
                    //患者信息
                    var patientInfo = JSON.parse(localStorage.getItem("records"))
                    if(patientInfo.patientName){
                        $('.name').html(patientInfo.patientName);
                        $('.sex').html(patientInfo.patientSex);
                        $('.age').html(patientInfo.patientAge);
                    }
                }
            },function(){
                //console.log("提交失败！")
            });
        }else {
            // //console.log(patientId);
            if(patientId){
                $(".tipPopup-mask").css("display", "block")
                ZENG.msgbox.show("该诊疗号无效", 1, 3000);
                setTimeout(function () {
                    window.opener = window;
                    var win = window.open("", "_self");
                    win.close();
                    clearInterval(inter);
                }, 3000);
            }else{
                $(".tipPopup-mask").css("display", "block")
                ZENG.msgbox.show("参数错误", 1, 3000);
                setTimeout(function () {
                    window.opener = window;
                    var win = window.open("", "_self");
                    win.close();
                    clearInterval(inter);
                }, 3000);
            }

        }
    },function(){
        //console.log("提交失败！")
    });
}else{
    $(".tipPopup-mask").css("display", "block")
    ZENG.msgbox.show("参数错误", 1, 3000);
    setTimeout(function () {
        window.opener = window;
        var win = window.open("", "_self");
        window.close();
        clearInterval(inter);
    }, 3000);
}



