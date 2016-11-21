/**
 * Created by yyl15 on 2016/9/13.
 */


app.controller('nxTestController', function($scope) {
    $scope.filteredTodos = []
        ,$scope.currentPage = 3
        ,$scope.numPerPage = 5
        ,$scope.maxSize = 7;
    var uid;
    $.post('../api/cookie',function(ret){
        if(ret.code==8788){
            window.location.href="http://m.xmgc360.com/start/web/account/?page=acc_login"
        }
        else{
            console.log(ret.data.uid)
            var dat={
                uid:ret.data.uid
            }
            $.post('../api/nextTest',dat,function (res) {
                console.log("ssssssss",res)
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
function show_element(e) {

}
function start(evt) {
    var targ;
    console.log('sadafa')
   /* $('body').click(function (evt) {*/
        if(!e){
            var e = window.event || evt;
        }
        targ = e.target.id;

            var goExam = confirm("确定开始考试吗？进入考试后倒计时开始，返回会直接提交试卷！");
            if (goExam == true) {
                window.location.href="startExam.html?name=" + targ
            }
            else{
                return
            }

/*    });*/


}
/*function total(examId) {
    function start(examId) {
        var goExam = confirm("确定开始考试吗？进入考试后倒计时开始，返回会直接提交试卷！");
        if (goExam == true) {
            window.open("startExam.html?name=" + examId, "newwindow",
                "height=768, width=1024, toolbar =no, menubar=no, " +
                "scrollbars=no, resizable=no, location=no, status=no")
           // window.location.href = "/startExam.html?name=" + examId;
        }
    }

}*/




