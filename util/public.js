var t = null;
var inter = null;
function countdown(code,type){
    post( 'selfMachine/findSelfCountDownByCode/' + code,{},function(res){
        //console.log("自助机操作时间")
        if(res.code == 200){
            t = res.result
            $("#clock").html(t)
            inter = setInterval("fun("+type +")", 1000);
        }else{
            t = 90;
            inter = setInterval("fun("+type +")", 1000);
        }
    },function(){
        //console.log("提交失败！")
    });
}

function fun(type) {
    if(t <= 0) {
        if(type == true){
            window.location.href = "index.html?patientId="+localStorage.getItem("patientId");
            clearInterval(inter);
        }else{
            window.opener = window;
            var win = window.open("", "_self");
            win.close();
            clearInterval(inter);
        }
    }else{
        t--;
        $("#clock").html(t);
    }
}

// 当前日期的后一天
function tomorrow(){
    var d = new Date();
    var str = '-';
    var isEndDate = true;
    var mon = d.getMonth() + 1;
    var day = d.getDate();//设置默认的月份和天数
    if (isEndDate) {
        //当输入为结束日期时，执行如下代码
        d.setTime(d.getTime() + 3600 * 24 * 1000);
        day = d.getDate();
        mon = d.getMonth() + 1;
    }
    var monthString = mon.toString();
    if (mon < 10) {
        //当月份小于10时，显示月份的时候在前面加一个0
        monthString = '0' + monthString;
    }
    var dayString = day.toString();
    if (day < 10) {
        //当天数小于10时，显示天数的时候在前面加一个0
        dayString = '0' + dayString;
    }
    //根据传进的str来返回指定的时间格式，str可以为任意格式的字符串
    return [d.getFullYear(), monthString, dayString].join(str);
}

// 获取两年前的今天
function getTwoYear() {
    // 先获取当前时间
    var curDate = (new Date()).getTime();
    // 将半年的时间单位换算成毫秒
    var halfYear = 365*2 * 24 * 3600 * 1000;
    var pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）
    // 日期函数，定义起点为半年前
    var pastDate = new Date(pastResult),
            pastYear = pastDate.getFullYear(),
            pastMonth = pastDate.getMonth() + 1,
            pastDay = pastDate.getDate();
    return pastYear + '-' + pastMonth + '-' + pastDay;
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
    /**
 2  * @name  getTableData
 3  * @desc  纯JS前端分页方法
 4  * @param  {Number} page 当前页码，默认1
 5  * @param  {Number} pageSize 每页最多显示条数，默认10
 6  * @param  {Array} totalData 总的数据集，默认为空数组
 7  * @return {Object} {
 8     data, //当前页展示数据，数组
 9     page, //当前页码
10     pageSize, //每页最多显示条数
11     length, //总的数据条数
12   }
 13 **/
 function getTableData(page,pageSize,totalData){
    var length = totalData.length;
    //console.log(totalData)
    //console.log( length );
    var tableData = {
        data:[],
        page:page,
        pageSize:pageSize,
        length:length
    };
    //console.log(tableData);
    if (pageSize >= length) { //pageSize大于等于总数据长度，说明只有1页数据或没有数据
        tableData.data = totalData;
        tableData.page = 1;//直接取第一页
    } else { //pageSize小于总数据长度，数据多余1页
        var num = pageSize * (page - 1);//计算当前页（不含）之前的所有数据总条数
        if (num < length) { //如果当前页之前所有数据总条数小于（不能等于）总的数据集长度，则说明当前页码没有超出最大页码
            var startIndex = num;//当前页第一条数据在总数据集中的索引
            var endIndex = num + pageSize - 1;//当前页最后一条数据索引
            var arr = []
           for(var i=0;i<totalData.length;i++){
               if(i >= startIndex && i <= endIndex){
                   arr.push(totalData[i])
               }
           }
            tableData.data = arr
                // tableData.data = totalData.filter(function(_, index){
            //     //console.log(index);
            //     return index >= startIndex && index <= endIndex
            // } );//当前页数据条数小于每页最大条数时，也按最大条数范围筛取数据

            //console.log(tableData.data);
        } else { //当前页码超出最大页码，则计算实际最后一页的page，自动返回最后一页数据
            var size = parseInt(length / pageSize); //取商
            var rest = length % pageSize; //取余数
            if (rest > 0) { //余数大于0，说明实际最后一页数据不足pageSize，应该取size+1为最后一条的页码
                tableData.page = size + 1;//当前页码重置，取size+1
                var arr = []
                for(var i=0;i<totalData.length;i++){
                    if(i >= (pageSize * size) && i <= length){
                        arr.push(totalData[i])
                    }
                }
                tableData.data = arr
                // tableData.data = totalData.filter((_, index) => index >= (pageSize * size) && index <= length);
               // //console.log(totalData.filter((_, index) => index >= (pageSize * size) && index <= length))
                //console.log(tableData.data )
            } else if (rest === 0) { //余数等于0，最后一页数据条数正好是pageSize
                tableData.page = size;//当前页码重置，取size
                var arr = []
                for(var i=0;i<totalData.length;i++){
                    if(i >= (pageSize * (size - 1)) && i <= length){
                        arr.push(totalData[i])
                    }
                }
                tableData.data = arr
                // tableData.data = totalData.filter((_, index) => index >= (pageSize * (size - 1)) && index <= length);
            } //注：余数不可能小于0
        }
    }
    return tableData;//
 }

