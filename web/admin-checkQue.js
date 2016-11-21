var checkQue = angular.module('checkQue', ['ui.bootstrap']);
checkQue.config(function($controllerProvider) {
    checkQue.controller = $controllerProvider.register;

});
var newId = window.location.search.substring(4);
// console.log(newId);
var dat={
    newId:newId
}
checkQue.controller('admincheckQue', function($scope) {
    $.post('../api/cookie',function(retCoo) {
        if (retCoo.code == 8788) {
            window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
        }
        else{
            console.log(retCoo.data.uid)
        }
    });
    $.post('../api/ManageAns',dat, function (res) {
        $scope.$apply(function () {
            $scope.rows=res.rows1;
            var rate=res.rows1;
            // console.log(res.rows1);

            for(var i=0;i<rate.length;i++){
                var percent=[];
                var num=0;
                for(var j=0;j<3;j++){
                    num += rate[i]['chooseNum'][j];
                }
                // console.log('总数'+i,num);
                for(var k=0;k<3;k++){
                    percent[k]=rate[i]['chooseNum'][k]/num*100+'%';
                }
                rate[i].percent=percent;

            }
            // console.log("百分比",rate);


            $scope.rows5=res.rows5;
        })
        // console.log(res)
    })
});