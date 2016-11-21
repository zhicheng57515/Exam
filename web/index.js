/**
 * Created by yyl15 on 2016/9/29.
 */
//$rootScope.mb1url='examZone.html'


var app = angular.module('app', ['ui.bootstrap']);
$.post('../api/cookie',function(ret) {

    if (ret.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
});
$.post('http://m.xmgc360.com/start/api/getMyInfo',function (res) {
    // console.log(res)
    var dat=res.data
   /* console.log(dat)*/
    $.post('../api/insertUser',dat,function (res) {
            //张鼎
            $.post('../api/selectDept',function(dat){
                var userDeptNo=dat[0]['userDeptNo'];
               /* var userDeptNo=dat[0]['userDeptNo'];*/
                if(userDeptNo=='1' || userDeptNo=='2'){
                    $("#phoneNav").css("display",'block');
                    $("#quanxian").css("display",'block');
                }
                else {
                    $("#phoneNav").css("display",'none');
                    $("#quanxian").css("display",'none');
                }
                /*   else if(userDeptNo!='2' && userDeptNo!='1'){
                 $("#quanxian").css("display",'none');

                 }*/
            })
    })
})
app.config(function($controllerProvider) {
    app.controller = $controllerProvider.register;

});
/*app.run(function($rootScope) {
    $rootScope.mb1url = 'controller/sec1.html'
});*/

function checkPage(page) {
        localStorage.currentPage = page
}
//window.onload=function() {
    //alert(localStorage.currentPage)

    var currentPage=localStorage.currentPage;

    app.run(function($rootScope) {
       // console.log("currentPage",currentPage)
        if(currentPage==undefined){
            currentPage='main';
        }
    //    console.log("currentPage>>",currentPage)
        $rootScope.mb1url = currentPage+'.html';
    })
//}

   function mouseOver(ele){
        $(ele).css("color","white");
    }
    function mouseOut(ele){
        $(ele).css("color","black");
    }




