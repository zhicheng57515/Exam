
/*$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
        var dat={
            uid:uid
        }
        $.post('../api/selectDept',dat,function (res) {
            var userDeptNo=res[0]['userDeptNo']
            if(userDeptNo=='1'){
                $('#adminUser').show()
                console.log('我是管理员')
            }
        })
    }
});*/

var admin = angular.module('admin', ['ui.bootstrap']);
admin.config(function($controllerProvider) {
    admin.controller = $controllerProvider.register;
});

function checkPage(page) {
    localStorage.admincurrentPage=page
}
//window.onload=function() {
//alert(localStorage.currentPage)

var admincurrentPage=localStorage.admincurrentPage;


admin.run(function($rootScope) {
     $rootScope.mb1url='admin-Description.html';
    if(admincurrentPage==undefined){
        admincurrentPage="admin-Description"
    }
    $rootScope.mb1url = admincurrentPage+'.html';

});






/*
var startTime = 0;
var endTimes = 0;
function daojishi(){
if (startTime==0 && endTimes==0　) {

//获取当前时间1
        function getSevertime() {
            var xmlHttp = new XMLHttpRequest();
            if (!xmlHttp) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlHttp.open("HEAD", location.href, false);
            xmlHttp.send();
            var severtime = new Date(xmlHttp.getResponseHeader("Date"));
            startTime = severtime.getTime();
            /!*  console.log("第一次获取当前时间：",severtime);
             console.log("第一次获取当前时间222：",startTime)*!/
            return severtime;
        };
        getSevertime();

//获取当前时间2
        function getSevertime2() {
            var xmlHttp = new XMLHttpRequest();
            if (!xmlHttp) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlHttp.open("HEAD", location.href, false);
            xmlHttp.send();
            var severtime2 = new Date(xmlHttp.getResponseHeader("Date"));
            /!*    console.log("getServerTime2的时间：",severtime2);*!/
            return severtime2;

        };
        getSevertime2();
//结束时间
        function endTime() {
            var end = getSevertime2().getTime() + 120 * 60 * 1000;
            endTimes = end

            /!*  console.log("结束时间",end)
             console.log("getServerTime2的时间123：",endTimes);*!/
            return end;
        }

        endTime();
//倒计时
        function setClock() {

            var clock = endTimes - startTime;
            setInterval(getSevertime, 1000);
            /!*   console.log("zzzzzdddddd",clock);*!/
            if (clock < 0) clearInterval(clockTime);
            var d = Math.floor(clock / 1000 / 60 / 60 / 24);
            var h = Math.floor(clock / 1000 / 60 / 60 % 24);
            var m = Math.floor(clock / 1000 / 60 % 60);
            var s = Math.floor(clock / 1000 % 60);
            var _html = '';
            if (d > 0) _html += '<span class="muted">' + d + '</span><span class="span">天</span>';
            if (h >= 10) _html += '<span class="muted">' + h.toString().slice(0, 1) + '</span><span class="muted">' + h.toString().slice(1, 2) + '</span><span class="span2">:</span>';
            if (h < 10) _html += '<span class="muted">0</span><span class="muted">' + h + '</span><span class="span2">:</span>';
            if (m >= 10) _html += '<span class="muted">' + m.toString().substring(0, 1) + '</span><span class="muted">' + m.toString().substring(1, 2) + '</span>';
            if (m < 10) _html += '<span class="muted">0</span><span class="muted">' + m + '</span>' + '</span><span class="span2">:</span>';
            if (s >= 10) _html += '<span class="muted">' + s.toString().substring(0, 1) + '</span><span class="muted">' + s.toString().substring(1, 2) + '</span>';
            if (s < 10) _html += '<span class="muted">0</span><span class="muted">' + m + '</span>';
            $('#clockTime').html(_html);
           // console.log("时间：", d, "  ", h, "  ", m, "  ", s)
        };
        setInterval(setClock, 1000);
    }  }
*/
