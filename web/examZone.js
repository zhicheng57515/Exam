/**
 * Created by yyl15 on 2016/9/8.
 */

app.controller('examController', function($scope) {
    $scope.filteredTodos = []
        ,$scope.currentPage = 3
        ,$scope.numPerPage = 5
        ,$scope.maxSize = 7;
    $.post('../api/cookie',function(ret){
        if(ret.code==8788){
            window.location.href="../../start/web/account/?page=acc_login"
        }
        else{
            $.post('../api/examZone',function (res) {
                console.log("cxsdfvs",res)
                $scope.$apply(function () {
                    $scope.todos=res;
                    $scope.length = Math.ceil(res.length / $scope.numPerPage) + "0";
                    $scope.$watch('currentPage + numPerPage', function() {
                        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                            , end = begin + $scope.numPerPage;

                        $scope.filteredTodos = $scope.todos.slice(begin, end);
                    })

                });
            })
        }
    })

});

