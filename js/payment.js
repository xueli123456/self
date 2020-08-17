$(".tipPopup-mask").css("display", "block")
$(".content_right").css("display", "none")
ZENG.msgbox.show("正在加载中，请稍后...", 6, 3000);
var payData = GetRequest('item'); //预约参数
var orderNo = null;
var data = null;
var jobCod ='1';//job码
var printStatus = 0;//打印状态
var payContent = document.getElementById("pay_info");
payData = JSON.parse(payData); //可以将json字符串转换成json对象
op= '<div>'+
            '<p>'+'<span class="selectionName">'+ '申请单号：'+'</span>' + '<span class="selectionContent">'+payData.inspectForm +'</span>'+'</p>'+
            '<p>'+'<span class="selectionName">'+ '申请科室：'+'</span>' + '<span class="selectionContent">'+payData.applyOffice +'</span>'+'</p>'+
            '<p>'+'<span class="selectionName">'+ '申请医生：'+'</span>' + '<span class="selectionContent">'+payData.applyDoctor +'</span>'+'</p>'+
            '<p>'+'<span class="selectionName">'+ '预约时间：'+'</span>' + '<span class="selectionContent">'+payData.reservationTime +'</span>'+'</p>'+
            '<p>'+'<span class="selectionName">'+ '检查项目：'+'</span>' + '<span class="selectionContent">'+payData.inspectProject +'</span>'+'</p>'+
            '<p>'+'<span class="selectionName">'+ '合计金额：'+'</span>' + '<span class="selectionContent">'+payData.totalMoney +'元' + '</span>'+'</p>'+
            '<p>'+'<span class="selectionName">'+ '状'+ '    '+'态：'+'</span>'+'<span class="selectionContent">'+payData.status +'</span>'+'</p>'+
            // '<p class="remarks">'+'<span class="selectionName">'+ '注意事项：' + '</span>'+'<span class="selectionContent">'+ remarks +'</span>'+'</p>'+
    '</div>'
    payContent.innerHTML = op;
    var patientInfo = JSON.parse(localStorage.getItem("records"))
    var data = {
        "currentLatitude":'34.198499',
        "currentLongitude":'109.028594',
        "inspectForm":payData.inspectForm,
        "money":payData.totalMoney,
        "officeId":payData.officeId,
        "patientId":localStorage.getItem("patientId"),
        "reservationId":payData.reservationId,
        "type":1,
        "userId": localStorage.getItem("patientId"),
        "userName": patientInfo.patientName
    }
    post('wxpay/prePayOrderSelf',data,function(res){
        // console.log('预支付接口')
        ZENG.msgbox._hide();
        $(".tipPopup-mask").css("display", "none")
        if(res.code == 200){
            var res = res.result
            var payQrcode = res.payQrcode
            orderNo = res.signInfo.orderNo
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width:200,
                height:200,
                correctLevel: 0,//纠错等级
                background:"#ffffff",//背景颜色
                foreground:"#000000" //前景颜色
            });
            qrcode.makeCode(payQrcode);
            //轮询支付订单状态
            var timer=setInterval(function(){
               var t = $('#clock').html();
                if(t>0){
                    post('selfMachine/findReservationStatusByReservationId/' + payData.reservationId,{},function(res){
                        if(res.code == 200){
                            payStatus = res.result
                            if(payStatus == "已签到" ){
                                clearInterval(timer);
                                $(".tipPopup-mask").css("display", "block")
                                ZENG.msgbox.show("支付成功，正在打印支付小票,请稍等...", 4, 5000);
                                setTimeout(function(){
                                    $(".tipPopup-mask").css("display", "none")
                                },5000)
                                post('selfMachine/findSelfReceiptByReservationId/'+ payData.reservationId,{},function(res){
                                    data = res.result;
                                    setTimeout(function(){
                                        print();

                                    },2000)
                                },function(){
                                    //console.log("提交失败！")
                                })
                            }
                        }else{
                            clearInterval(timer);
                            $(".tipPopup-mask").css("display", "block")
                            ZENG.msgbox.show(res.message, 5,2000);
                            setTimeout(function(){
                                window.location.href = 'index.html'
                                $(".tipPopup-mask").css("display", "none")
                            },5000)
                        }
                    },function(){
                        //console.log("提交失败！")
                    })
                }else{
                    post('selfMachine/closeOrder/'+ orderNo,{},function(res){
                        if(res.code == 200){
                            clearInterval(timer);
                            $(".tipPopup-mask").css("display", "block")
                            ZENG.msgbox.show("操作超时，正在返回首页...",1,2000);
                            setTimeout(function(){
                                window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
                            },2000)
                        }else{
                            clearInterval(timer);
                            $(".tipPopup-mask").css("display", "block")
                            ZENG.msgbox.show(res.message,1,2000);
                            setTimeout(function(){
                                window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
                            },2000)
                        }
                    })
                }
            },3000);
        }else{
            clearInterval(timer);
            $(".tipPopup-mask").css("display", "block")
            ZENG.msgbox.show(res.message,5,2000);
            setTimeout(function(){
                $(".tipPopup-mask").css("display", "none")
                ZENG.msgbox._hide();
                window.location.href = "index.html?patientId="+ localStorage.getItem("patientId")
            },2000)
        }
    })
    $('.backPay').click(function(){
        var popup = new Popup({
            'type': 'submit',
            'title': '温馨提示',
            'text': '是否放弃本次支付？',
            'cancelbutton': true,
            'submitcolor': '#fff',
            'submitbgcolor': '#5BC67E',
            'submitbordercolor': '#5BC67E',
            'cancelcolor': '#5BC67E',
            'cancelbgcolor': '#fff',
            'cancelbordercolor': '#5BC67E',
            'submitCallBack': function(){
                post('selfMachine/closeOrder/'+ orderNo,{},function(res) {
                    // console.log(res)
                    if (res.code == 200) {
                        window.history.back();
                    }else {
                        $(".tipPopup-mask").css("display", "block")
                        ZENG.msgbox.show(res.message,1,2000);
                        setTimeout(function(){
                            window.history.back();
                        },2000)
                    }
                })
            },
        })
    })
    $('#payBackHome').click(function(){
        var popup = new Popup({
            'type': 'submit',
            'title': '温馨提示',
            'text': '是否放弃本次支付？',
            'cancelbutton': true,
            'submitcolor': '#fff',
            'submitbgcolor': '#5BC67E',
            'submitbordercolor': '#5BC67E',
            'cancelcolor': '#5BC67E',
            'cancelbgcolor': '#fff',
            'cancelbordercolor': '#5BC67E',
            'submitCallBack': function(){
                post('selfMachine/closeOrder/'+ orderNo,{},function(res) {
                    if (res.code == 200) {
                        window.location.href = "index.html?patientId="+ localStorage.getItem("patientId")
                    }else {
                        $(".tipPopup-mask").css("display", "block")
                        ZENG.msgbox.show(res.message,1,2000);
                        setTimeout(function(){
                            window.location.href = "index.html?patientId="+ localStorage.getItem("patientId")
                        },2000)
                    }
                })
            },
        })
    })
// 打印小票
function print(){
        var patientInfo = JSON.parse(localStorage.getItem("records"))
        var currentDate = new Date()
        var currentDateStr = currentDate.toLocaleString()
        var LODOP = getLodop()
        // LODOP.PRINT_INIT('西北妇女儿童医院预约扣费凭证')
        var remarks = data.remarks
        var payDate=data.payDate;
        if (payDate == null || payDate === undefined) {
            payDate = '无';
        }
        if (remarks == null || remarks === undefined) {
          remarks = '无'
        }
    $('.tt .p1').html('姓名:' + patientInfo.patientName)
    $('.tt .p2').html('诊疗号:' + data.patientId)
    $('.mm .p1').html('执行科室:' + data.execOfficeName)
    $('.mm .p2').html('申请单号:' + data.inspectForm)
    $('.dd .p1').html('预约组:' + data.reservationGroupName)
    $('.dd .p2').html('排队号:' + data.lineCode)
    $('.dd .p3').html('预约项目:' + data.inspectProject )
    $('.dd .p4').html('预约时间:' + data.reservationTime)
    $('.dd .p5').html('扣费时间:' + payDate)
    $('.dd .p6').html('打印时间:' + currentDateStr)
    $('.dd .p7').html('支付金额:' + data.totalMoney + '元')
    $("#image002").barcode(data.inspectForm , "code128", {
        output: 'css',       //渲染方式 css/bmp/svg/canvas
        //bgColor: '#ff0000', //条码背景颜色
        //color: '#00ff00',   //条码颜色
        barWidth: 2,        //单条条码宽度
        barHeight: 45,     //单体条码高度
        // moduleSize: 10,   //条码大小
        // posX: 10,        //条码坐标X
        // posY: 5,         //条码坐标Y
        showHRI: false,    //是否在条码下方显示内容
        addQuietZone: false  //是否添加空白区（内边距）
    })
    $(".remark").html('注意事项：'+remarks)
        // var printContent = '<div class="printtext" style="background: #fff;width: 260px;" >' +
        // '<div class="text" style="font-size: 20px;font-weight: bold;text-align:center;">\n' +
        // '<div class="text" style="font-size: 20px;font-weight: bold;text-align:center;">西北妇女儿童医院</br>预约扣费凭证</div></div>' +
        // '<div class="tt" style="margin: 0 auto;height: 20px;width: 260px;line-height: 20px;">' +
        // '<span class="p1" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;float:left;">姓名:' + patientInfo.patientName + '</span>' +
        // '<span class="p2" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;float:right;">诊疗号:' + data.patientId + '</span>' +
        // '</div>' +
        // '<div class="mm" style="margin: 0 auto;height: 20px;width: 260px;line-height: 20px;border-bottom:1px solid #000;">' +
        // '<span class="p1" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;float:left;">执行科室:' + data.execOfficeName + ' </span>' +
        // '<span class="p2" style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;float:right;">申请单号:' + data.inspectForm + '</span>' +
        // '</div>' +
        // '<div class="dd" style="margin: 0 auto;margin-top: 0px;margin-left: 0px;width: 260px;border-bottom:1px solid #000;">' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">预约组:' + data.reservationGroupName + '</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">排队号:' + data.lineCode + '</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">预约项目:' + data.inspectProject + '</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">预约时间:' + data.reservationTime + '</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">打印时间:' + currentDateStr + '</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">支付金额:' + data.totalMoney + '元</p>' +
        // '</div>' +
        // '<div class="ff" style="height: 65px;width: 260px;line-height: 30px;border-bottom:1px solid #000;font-size: 12px;">申请单号:' +
        // '<div id="image001" style="margin-bottom:5px;" ></div>' +
        // '</div>' +
        // '<div class="ff" style="height: auto;width: 260px;line-height: 30px;border-bottom:1px solid #000;font-size: 12px;">' +
        // '<p>注意事项：' + remarks + '</p>' +
        // '</div>' +
        // '<div class="ff" style="height: 60px;width: 260px;line-height: 30px;font-size: 12px;">' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">温馨提示:</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">1.胎心监护请勿空腹以免影响检查</p>' +
        // '<p style="margin: 0 auto;height: 20px;line-height: 20px;font-size: 12px;margin-top: 0px;">2.请您提前在候诊区等待呼叫</p>' +
        // '</div></div>'
    var printContent=$(".xiaopiao").html();
     if(LODOP){
         if (LODOP.CVERSION) {//判断c_lodop是否存在，安装了c-lodop就会存在
             // 设置纸张大小 打印方向
             LODOP.SET_PRINT_PAGESIZE(1, 780, 1200, '');
             // 指定位置增加文本
             LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', printContent);
             //执行该语句之后，PRINT指令不再返回那个所谓“打印成功”
             // LODOP.PREVIEW();
             LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
             LODOP.On_Return=function(TaskID,Value){
                 var timer = setInterval(function(){
                     // //console.log(getStatusValue("PRINT_STATUS_EXIST",Value)==0);
                     if(getStatusValue("PRINT_STATUS_EXIST",Value)==0){
                         post('selfMachine/saveReservatPrintByReservationId/'+ payData.reservationId,{},function(res){
                             //console.log(res);
                             if(res.code == 200){
                                 $(".tipPopup-mask").css("display", "block")
                                 ZENG.msgbox.show("打印成功，正在返回首页...",4,2000);
                                 setTimeout(function(){
                                     window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
                                 },2000)
                             }else{
                                 $(".tipPopup-mask").css("display", "block")
                                 ZENG.msgbox.show("打印失败，正在返回首页...",1,2000);
                                 setTimeout(function(){
                                     window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
                                 },2000)
                             }
                         })
                         clearInterval(timer);
                     }
                 },1000);
             };
             LODOP.PRINT();
         } else{
             ZENG.msgbox.show("数据获取失败", 5, 2000);
             setTimeout(function(){
                 window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
             },2000)
         }
         strResult=LODOP.GET_SYSTEM_INFO("Drive.Labels");
     } else {
         ZENG.msgbox.show("打印控件未启动", 5, 2000);
         setTimeout(function(){
             window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
         },2000)
     }

  }
function getStatusValue(ValueType,ValueIndex){
    LODOP=getLodop();
    // if (LODOP.CVERSION) LODOP.On_Return=function(TaskID,Value){//console.log("打印打印")};
    var strResult=LODOP.GET_VALUE(ValueType,ValueIndex);
    if (!LODOP.CVERSION) return strResult; else return "";
}

//获取url中的参数
function GetRequest(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var params = window.location.search.substr(1);
    params = window.decodeURIComponent(window.atob(params));
    var r = params.match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}
