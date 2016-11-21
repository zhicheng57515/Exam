/*var admin = angular.module('admin', ['ui.bootstrap']);
admin.config(function($controllerProvider) {
    admin.controller = $controllerProvider.register;

});*/


admin.controller('adminAllExam', function($scope) {
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
            $.post('../api/ManageExam',dat,function (res) {
                // console.log(res);
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
function to_checkpaper() {
    $('body').click(function (evt) {
        if(!e){
            var e = window.event || evt;
        }
        //获取事件点击元素
        var targ = e.target;
        //获取元素名称
        var tname1 = targ.id;
        window.location.href='admin-checkExampaper.html?id='+tname1
    });


}
function to_checkExam() {
    $('body').click(function (evt) {
        if(!e){
            var e = window.event || evt;
        }
        //获取事件点击元素
        var targ = e.target;
        //获取元素名称
        var tname1 = targ.id;
        window.location.href='admin-checkExam.html?id='+tname1
    });
}