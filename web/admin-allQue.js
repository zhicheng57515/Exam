/*var admin = angular.module('admin', ['ui.bootstrap']);
admin.config(function($controllerProvider) {
    admin.controller = $controllerProvider.register;

});*/



admin.controller('adminAllQue', function($scope) {
    $scope.filteredTodos = []
        , $scope.currentPage = 3
        , $scope.numPerPage = 6
        , $scope.maxSize = 5;

    var uid;
    $.post('../api/cookie',function(retCoo) {
        if (retCoo.code == 8788) {
            window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
        }
        else{
            uid=retCoo.data.uid;
            var dat={
                uid:uid
            }
            console.log(dat)
            $scope.hasNull=''
            $.post('../api/ManageQues',dat,function (res) {
                // console.log(res);
                // console.log(res.length);
                if(res.length==0){
                    $scope.hasNull='(暂无)'
                }
                    $scope.$apply(function () {
                        $scope.todos=res;
                        $scope.length = Math.ceil(res.length / $scope.numPerPage) + "0";
                        $scope.$watch('currentPage + numPerPage', function() {
                            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                                , end = begin + $scope.numPerPage;

                            $scope.filteredTodos = $scope.todos.slice(begin, end);

                        });

                    });

            })
        }
    });



});
function to_checkQuepaper() {
    $('body').click(function (evt) {
        if(!e){
            var e = window.event || evt;
        }
        //获取事件点击元素
        var targ = e.target;
        //获取元素名称
        var tname1 = targ.id;
        window.location.href='admin-checkQuepaper.html?id='+tname1
    });

    //获取事件点击元素

}
function to_checkQue() {
    $('body').click(function (evt) {
        if(!e){
            var e = window.event || evt;
        }
        //获取事件点击元素
        var targ = e.target;
        //获取元素名称
        var tname1 = targ.id;
        window.location.href='admin-checkQue.html?id='+tname1
    })

}