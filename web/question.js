
var  uid;
app.controller('quTestController', function($scope) {
    $scope.filteredTodos = []
        ,$scope.currentPage = 3
        ,$scope.numPerPage = 4
        ,$scope.maxSize = 7;


    $.post('../api/cookie',function(ret){
        if(ret.code==8788){
            window.location.href="../../start/web/account/?page=acc_login"
        }
        else{
            uid=ret.data.uid;
            console.log(ret.data.uid);
            var dat={
                uid:ret.data.uid
            }
            console.log(dat);
            $.post('../api/question',dat,function (res) {

               if(res.length==0) {$scope.noQus="color: gray;display: block;"}
                else{ $scope.noQus="display: none"}

                for(var key in res){
                    var unread=res[key].mark;
                    if(unread==1){
                        res[key].mark='(已读)';
                        res[key].unReadstyle='color:gray';
                        res[key].btnDisabled='已读';
                    }
                    else{
                        res[key].mark='(未读)';
                        res[key].unReadstyle='color:blue';
                        res[key].btnDisabled='设为已读';
                    }
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
            };
})
});



function show_element(evt){

}
function checkPaper() {
    var tname;
    $('body').click(function (evt) {
        if(!e){
            var e = window.event || evt;
        }
        //获取事件点击元素
        var targ = e.target;
        //获取元素名称
        tname = targ.id;
        // alert(tname)
        window.location.href='startQuestion.html?surNo='+tname;
    });
}

function delMes(){
    $('body').click(function (evt) {
        if(!e){
            var e = window.event || evt;
        }
        //获取事件点击元素
          var targ = e.target.id;
        //获取元素名称
        // console.log(targ);
        /*var delResult=confirm("删除后不可恢复，确认删除吗？")
         if(delResult==false){
         return
         }*/
        var targ2 = e.target.innerHTML;
        // console.log(targ2)
        if(targ2=='设为已读'){
            var dat ={
                clickName:targ,
                uid:uid
            }
            $.post('../api/delQues',dat,function (ret) {
                if(ret>=1){
                    alert('修改成功！');
                    location.reload();
                }
                else {
                    alert("数据出错，请稍后重试！");
                }
            })
        }



    });


}