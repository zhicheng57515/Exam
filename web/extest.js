/*var uid;
$.post('../api/cookie',function(ret){
    if(ret.code==8788){
        window.location.href="start/web/account/?page=acc_login"
    }
    else{
        console.log(ret.data.uid);
        var dat={
            uid:ret.data.uid
        };
        $.post('../api/exTest',dat,function(ret){
            $('tbody').html(ret)
        })
    }
});*/


app.controller('exTestController', function($scope) {

    $scope.filteredTodos = []
        ,$scope.currentPage = 3
        ,$scope.numPerPage = 5
        ,$scope.maxSize = 7;
    var uid;
    $.post('../api/cookie',function(ret){
        if(ret.code==8788){
            window.location.href="start/web/account/?page=acc_login"
        }
        else{
            console.log(ret.data.uid);
            var dat={
                uid:ret.data.uid
            };
            $.post('../api/exTest',dat,function (res) {
                if(res.length>0){
                    $('#zeroExam').hide()
                }
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
    });

});
/*function show_element(e){

}*/
function start(evt) {
        var tname;

            var targ;
            if(!e){
                var e = window.event || evt;
            }
            targ = e.target.id;
            console.log("targ"+targ)
            window.location.href="endExam.html?name=" + targ;


}