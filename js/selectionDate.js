var dat = new Date(); //当前时间 
var nianD = dat.getFullYear();//当前年份 
var yueD = dat.getMonth(); //当前月 
var tianD = dat.getDate(); //当前天 这保存的年月日 是为了 当到达当前日期 有对比 
var that = this;
var loadDay = new Date().getDate();  //当前日期
var clickDate = '';
var clickDay = loadDay; //点击日期
var loadHours = new Date().getHours(),
    loadYear = new Date().getFullYear(),
    loadMonth = new Date().getMonth(),
    loadDay = new Date().getDate();
var schedulArr = [];  //接收是否有排班计划
add();              //进入页面第一次渲染日历
var flag = true

//日历渲染
function add() {
    document.getElementById('date').innerHTML = "";
    var nian = dat.getFullYear();//当前年份 
    var yue = dat.getMonth(); //当前月 
    var tian = dat.getDate(); //当前天 
    var arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    document.getElementById('year').innerText = nian;
    document.getElementById('mouth').innerText = arr[yue];
    var setDat = new Date(nian, yue + 1, 1 - 1); //把时间设为下个月的1号 然后天数减去1 就可以得到 当前月的最后一天; 
    var setTian = setDat.getDate(); //获取 当前月最后一天 
    var setZhou = new Date(nian, yue, 1).getDay(); //获取当前月第一天 是 周几 
    var lastMouthDat = new Date(nian, yue, 1 - setZhou).getDate();//获取上个月最后一行的时期 在下个月显示
    for (var i = 0; i < setZhou; i++) {//渲染空白 与 星期 对应上 
        var li = document.createElement('li');
        li.innerText = lastMouthDat + i;
        li.className = "oldMouthDat";
        document.getElementById('date').appendChild(li);
    }
    for (var i = 1; i <= setTian; i++) {//利用获取到的当月最后一天 把 前边的 天数 都循环 出来 
        var li = document.createElement('li');
        li.innerText = i;
        if (nian == nianD && yue == yueD && i == tianD) {
            li.className = "active hover today";
        } else {
            li.className = "hover";
        }
        document.getElementById('date').appendChild(li);
    }
    clickDate = nian + '-' + Number(yue + 1) + '-' + tianD
    // clickDay = tianD;
    //用42减去之前的节点后面的空白补齐
    var dateLiChildren = 42 - setTian - setZhou;
    for (var i = 0; i < dateLiChildren; i++) {
        if (document.getElementById('date').childNodes[i].nodeType == 1) {
            var li = document.createElement('li');
            li.innerText = i + 1;
            li.className = "oldMouthDat";
            document.getElementById('date').appendChild(li);
        }
    }
}


//当点击下一个月时
document.getElementById("next").onclick = function () {
    dat.setMonth(dat.getMonth() + 1); //当点击下一个月时 对当前月进行加1; 
    var oYear = $('#year').text();
    var oMouth = $('#mouth').text();
    var startDay = oYear + "-" + Number(Number(oMouth) + 1) + "-" + '01';
    var endDay = endMonth(oYear, oMouth)
    queryIsUnuseCount(startDay, endDay)
    schedulingPlan(startDay)
    flag = 'next'
    add(); //重新执行渲染 获取去 改变后的 年月日 进行渲染; 
    $('#date').children(".hover").each(function () {
        if ($(this).text() == 1) {
            $(this).addClass("active").siblings().removeClass("active")
        }
    });
    // $('#date').children("*").eq(num).addClass("active").siblings().removeClass("active")
};

//当点击上一个月时 对当前月进行加1; 
document.getElementById("prev").onclick = function () {
    var oldYear = $('#year').text();
    var oldMouth = $('#mouth').text();
    if (oldYear > loadYear || oldYear == loadYear && oldMouth > Number(loadMonth + 1)) {
        flag = 'prev'
        dat.setMonth(dat.getMonth() - 1); //与下一月 同理 
        var num = new Date(dat.getFullYear(), dat.getMonth() + 1, 1 - 1).getDate()
        clickDay = num
        add();
        $('#date').children(".hover").each(function () {
            if ($(this).text() == num) {
                $(this).addClass("active").siblings().removeClass("active")
            }
        });
        var oYear = $('#year').text();
        var oMouth = $('#mouth').text();
        var startDay = oYear + "-" + Number(oMouth) + "-" + '01';
        var now = loadYear + '-' + Number(loadMonth + 1) + '-' + Number(loadDay)
        var endDay = endMonth(oYear, oMouth - 1)
        if (oYear > loadYear || oYear == loadYear && Number(oMouth) > loadMonth + 1) {
            queryIsUnuseCount(startDay, endDay);
        } else if (oYear == loadYear && Number(oMouth) == Number(loadMonth + 1)) {
            queryIsUnuseCount(now, endDay);
        }
        schedulingPlan(endDay);
    }
};

/**
 *右边时间段
 */
var sourceList = []
var todayList = []
function rightCreate(arr) {
    var right = document.getElementById('rightId');
    right.innerHTML = ''
    // sourceList = []
    // todayList = []
    var oYear = $('#year').text();
    var oMouth = $('#mouth').text();
    clickDay = $('.active').html();
    $(".tipPopup-mask").css("display", "none")
    ZENG.msgbox._hide();
    if (arr.length > 0) {
        for (var i = 0; i <= arr.length; i++) {
            if (arr[i]) {
                var resTimes = arr[i].sectionNumber;
                var resHours = resTimes.substring(6, 8);
                var resMinutes = resTimes.substring(9, 11);
                var loadMinutes = new Date().getMinutes();  //获取当前的分钟
                op = '<div class="right_div">' +
                    '<span>' + arr[i].sectionNumber + '</span>' +
                    '<span class="queueNumber">' + '剩余号源' +
                    '<span class="number">' + arr[i].residueSourceNum + '</span>' + '人次' + '</span>' +
                    '</div>';
                right.innerHTML += op;
            }
        }
        if (arr.length == 0) {
            op = '<div class="right_div">' + ' 暂无排班' + '</div>';
            right.innerHTML += op;
        }
    } else {
        op = '<div class="right_div">' + ' 暂无排班' + '</div>';
        right.innerHTML += op;
    }
    $(".right .right_div:last").css('margin-bottom', '10px');
}

/**
 *点击选择日期
 */
$("#date").on('click', 'li', function () {
    $(".tipPopup-mask").css("display", "block")
    ZENG.msgbox.show('正在加载中...', 1, 20000);
    var oYear = $('#year').text();
    var oMouth = $('#mouth').text();
    var oDay = $(this).text();
    if (oYear > loadYear || oYear == loadYear && oMouth > Number(loadMonth + 1) || oYear == loadYear && oMouth == Number(loadMonth + 1) && (oDay > loadDay || oDay == loadDay)) {
        var right = document.getElementById('rightId');
        right.innerHTML = ''
        $(this).addClass("active").siblings().removeClass("active");
        var oYear = $('#year').text();
        var oMouth = $('#mouth').text();
        var oDay = $(this).text();
        var oDate = oYear + "-" + oMouth + "-" + oDay;
        clickDay = oDay;
        clickDate = oDate;
        schedulingPlan(clickDate)
    } else {
        $(".tipPopup-mask").css("display", "none")
        ZENG.msgbox._hide();
    }
});


//  获取url中的参数
var inspectDate = GetRequest('item'); //预约参数
var type = null;
if (inspectDate == undefined) {  //改约
    var inspectDate = GetRequest('revision'); //预约参数
    inspectDate = JSON.parse(inspectDate);
    type = inspectDate.type

} else {  //预约
    inspectDate = JSON.parse(inspectDate); //可以将json字符串转换成json对象
}


//页面初次渲染
var endDay = endMonth(nianD, yueD)
this.queryIsUnuseCount(clickDate, endDay)
var isUnuseCount = '';           //接收是否有剩余号源
function queryIsUnuseCount(startDate, endDate) {
    var queryCount = {
        classesEndDate: endDate,
        classesStartDate: startDate,
        reservableSourcePoolId: inspectDate.reservableSourcePoolId  //号源池id
    };
    post("selfMachine/queryIsUnuseCount", queryCount, function (res) {
            if (res.result == undefined) {
                isUnuseCount = []
            } else {
                isUnuseCount = res.result;
            }
            var arrCount = [];
            var index = isUnuseCount.length;
            if (index > 0) {
                for (var i = 0; i < index; i++) {
                    var baseTimes = isUnuseCount[i].classesDate,
                        arrTime = splitDate(baseTimes);
                    var tempDay = Number(isUnuseCount[i].classesDate.substring(8, 10));
                    arrCount.push(tempDay);
                }
            }
            $(".hover").each(function (j, item) {
                for (var i = 0; i < arrCount.length; i++) {
                    if (arrCount[i] == Number($(this).html())) {
                        $(this).addClass('haveCount')
                    }
                }
            });
            var oYear = $('#year').text();
            var oMouth = $('#mouth').text();
            if (clickDay == loadDay && oYear == loadYear && oMouth == Number(loadMonth + 1)) {
                todayList = sourceList
            }
            if (Number($('.today').html()) == loadDay && oYear == loadYear && oMouth == loadMonth + 1 && todayList.length == 0) {
                $('.today').removeClass("haveCount")
            }

        },
        function () {
            // //console.log("提交失败！")
        });
}

/**
 * 分割日期字符串
 */
function splitDate(startDate) {
    var timearr = startDate.replace(" ", ":").replace(/\:/g, "-").split("-");
    var day = timearr[2];
    var month = timearr[1];
    var year = timearr[0];
    return timearr;
}

// 查询可预约排班计划
//接收是否有排班计划
schedulingPlan(clickDate);
var arr = null;

function schedulingPlan(data) {
    var queryCount = {
        classesDate: data,  //当前点击的日期
        officeId: inspectDate.officeId,  //科室id
        reservableSourcePoolId: inspectDate.reservableSourcePoolId  //号源池id
    };
    post("selfMachine/queryCheckInSchedulingPlan", queryCount, function (res) {
        if(res.code == 200){
            schedulArr = res.result;
            var oYear = $('#year').text();
            var oMouth = $('#mouth').text();
            sourceList = [];
            for (var i = 0; i <= schedulArr.length; i++) {
                if (schedulArr[i]) {
                    var resTimes = schedulArr[i].sectionNumber;
                    var resHours = resTimes.substring(6, 8);
                    var resMinutes = resTimes.substring(9, 11);
                    var loadMinutes = new Date().getMinutes();  //获取当前的分钟
                    if (oYear > loadYear || oMouth > Number(loadMonth + 1) || clickDay > loadDay || (clickDay == loadDay && (resHours > loadHours || (resHours == loadHours && resMinutes > loadMinutes)))) {
                        sourceList.push(schedulArr[i])
                    }
                }
            }
            var pages=sourceList.length/6;
            if(parseInt(pages)==pages){
                pages=parseInt(pages);
            }else{
                pages=parseInt(pages)+1;
            }
            arr = getTableData(1, 6, sourceList);
            rightCreate(arr.data);   //7
            var currenpage = arr.page;
            document.getElementById("nexts").onclick = function () {
                if (currenpage >= pages) {
                    return;
                } else {
                    arr = getTableData(++currenpage, 6, sourceList);
                    rightCreate(arr.data);  //
                }
            }
            document.getElementById("prevs").onclick = function () {
                if (currenpage <= 1) {
                    return;
                } else {
                    arr = getTableData(--currenpage, 6, sourceList);
                    rightCreate(arr.data);
                }
            }
        } else{
            $(".tipPopup-mask").css("display", "block")
            ZENG.msgbox.show(res.message, 1, 2000);
            setTimeout(function () {
                $(".tipPopup-mask").css("display", "none")
                window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
            }, 2000)
         }
        },
        function () {
            // //console.log("提交失败！")
     });
}

//右边剩余号源点击事件
$("#rightId").on('click', '.right_div', function () {
    var index = $(this).index('.right_div');
    var text = '';
    var tip = '';
    var canData = arr.data[index]
    if(canData ){
        var residueSourceNum = canData.residueSourceNum
    }
    if (residueSourceNum > 0) {
        if (type == 1) {
            text = '确认改约?';
            tip = "正在改约中，请稍等...";
        } else {
            text = '确认预约?';
            tip = "正在预约中，请稍等...";
        }
        new Popup({
            'type': 'submit',
            'title': '系统提示',
            'text': text,
            'cancelbutton': true,
            'submitcolor': '#fff',
            'submitbgcolor': '#5BC67E',
            'submitbordercolor': '#5BC67E',
            'cancelcolor': '#5BC67E',
            'cancelbgcolor': '#fff',
            'cancelbordercolor': '#5BC67E',
            'submitCallBack': function () {
                $(".tipPopup-mask").css("display", "block")
                ZENG.msgbox.show(tip, 6, 20000);
                if (type == 1) {
                    //改约接口
                    var workId = canData.workId;
                    var resTimes = canData.sectionNumber;
                    var reservationStartTime = resTimes.substring(0, 5);
                    var data = {
                        "reservationDate": clickDate,   //点击改约日期
                        "reservationId": inspectDate.reservationId,
                        "workId": workId
                    };
                    var successData = {
                        "execOfficeName": inspectDate.execOfficeName,
                        "checkProName": inspectDate.checkProName,
                        "reservationDate": clickDate,
                        "reservationStartTime": resTimes,
                        "type": 1
                    }
                    post("selfMachine/revision", data, function (res) {
                            if (res.code == 200) {
                                $(".tipPopup-mask").css("display", "none")
                                window.location.href = "reservationSuccess.html?" + window.btoa(window.encodeURIComponent('item=' + JSON.stringify(successData)))
                            } else {
                                $(".tipPopup-mask").css("display", "block")
                                ZENG.msgbox.show(res.message, 1, 2000);
                                setTimeout(function () {
                                    $(".tipPopup-mask").css("display", "none")
                                }, 2000)
                            }
                        },
                        function () {
                            // //console.log("提交失败！")
                        });
                } else {
                    var workId = canData.workId;
                    var resTimes = canData.sectionNumber;
                    var reservationStartTime = resTimes.substring(0, 5);
                    var data = {
                        "applayDoctorName": inspectDate.appDoctorName,
                        "applayOfficeName": inspectDate.appOfficeName,
                        "execOffice": inspectDate.officeId,
                        "inspectForm": inspectDate.inspectForm,
                        "medicalProject": inspectDate.medicalProjec,
                        "medicalProjectName": inspectDate.checkProName,
                        "patientName": $('.name').html(),
                        "remarks": inspectDate.remarks,
                        "reservationDate": clickDate,
                        "reservationStartTime": reservationStartTime,
                        "totalMoney":inspectDate.money,
                        "workId": workId
                    };
                    var successData = {
                        "execOfficeName": inspectDate.execOfficeName,
                        "checkProName": inspectDate.checkProName,
                        "reservationDate": clickDate,
                        "reservationStartTime": resTimes,
                    }
                    post("selfMachine/saveSelfReservationInfo", data, function (res) {
                            if (res.code == 200) {
                                $(".tipPopup-mask").css("display", "none")
                                window.location.href = "reservationSuccess.html?" + window.btoa(window.encodeURIComponent('item=' + JSON.stringify(successData)))
                            } else {
                                $(".tipPopup-mask").css("display", "block")
                                ZENG.msgbox.show(res.message, 1, 2000);
                                setTimeout(function () {
                                    $(".tipPopup-mask").css("display", "none")
                                }, 2000)
                            }
                        },
                        function (res) {
                            $(".tipPopup-mask").css("display", "block")
                            ZENG.msgbox.show("服务器繁忙，请稍后再试。", 1, 2000);
                            window.location.href = "index.html?patientId="+localStorage.getItem("patientId")
                        });
                }
            },
        })
    } else {
        $(".tipPopup-mask").css("display", "block")
        ZENG.msgbox.show("当前排班已满！", 1, 2000);
        setTimeout(function () {
            $(".tipPopup-mask").css("display", "none")
        }, 2000)
    }
})
//当前月末日期
function endMonth(loadYear, loadMonth) {
    var d = new Date(loadYear, Number(loadMonth) + 1, 0);
    var endDay = d.getDate();
    var endDate = loadYear + "-" + (Number(loadMonth) + 1) + "-" + endDay;
    return endDate;
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
