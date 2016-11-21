
$('.table_user').hide();
/*var admin = angular.module('admin', ['ui.bootstrap']);
admin.config(function($controllerProvider) {
    admin.controller = $controllerProvider.register;

});*/
var uid;
$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
    }
});
admin.controller('adminUser', function($scope) {
    $scope.filteredTodos = []
        ,$scope.currentPage = 3
        ,$scope.numPerPage = 5
        ,$scope.maxSize = 5;
    console.log(uid)
    $('#checkTea').click(function () {     //显示教师账号信息
        $('#text_user').html('以下为教师账号信息');
        $('.table_user').show();
        var dat={
            user:2
        }
        $.post('../api/ManageUser',dat,function (res) {

            for(var i=0;i<res.length;i++){
                // =============
                res[i].id=i+1;
                if(res[i]['userDeptNo']==2){
                    res[i]['userDeptNo']='教师'
                    res[i]['selTea']=' <option value="2" selected>教师</option> <option value="3" >普通用户</option>'
                }
            }
            $scope.$apply(function () {
                $scope.todos=res;
                // console.log(res);
                $scope.length = Math.ceil(res.length / $scope.numPerPage) + "0";
                $scope.$watch('currentPage + numPerPage', function() {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                    $scope.filteredTodos = $scope.todos.slice(begin, end);

                });

            });

        })
    });
    $('#checkStu').click(function () {    //显示普通账号信息
        $('#text_user').html('以下为普通账号信息(*选项为空为用户未填写)');
        $('.table_user').show();
        var dat={
            user:3
        }
        $.post('../api/ManageUser',dat,function (res) {
            for(var i=0;i<res.length;i++){
                res[i].id=i+1;
                if(res[i]['userDeptNo']==3){
                    res[i]['userDeptNo']='普通用户';
                    res[i]['selCommon']='selected'
                }

            }
            $scope.$apply(function () {
                $scope.todos=res;
                // console.log(res);
                $scope.length = Math.ceil(res.length / $scope.numPerPage) + "0";
                $scope.$watch('currentPage + numPerPage', function() {
                    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                    $scope.filteredTodos = $scope.todos.slice(begin, end);
                })

            });
        })

    });
    $('#search_user').click(function () {       //显示搜索的账号信息
       var search_name=$('#search_name').val();
        if(!search_name){alert('请输入用户名')}
        else{
            var dat={
                search_name:search_name
            }
            $.post('../api/ManageUserSel',dat,function (res) {
                for(var i=0;i<res.length;i++){
                    res[i].id=i+1;
                    if(res[i]['userDeptNo']==3){
                        res[i]['userDeptNo']='普通用户'
                        res[i]['selCommon']='selected'
                    }
                    else if(res[i]['userDeptNo']==2){
                        res[i]['userDeptNo']='教师'
                        res[i]['selTea']='selected'
                    }
                }
                if(res.length==0){
                    $('.table_user').hide();
                    $('#text_user').html('您所搜索的用户名不存在');
                }
                else{
                    $('#text_user').html('');
                    $('.table_user').show();
                    $scope.$apply(function () {
                        $scope.todos=res;
                        // console.log(res);
                        $scope.length = Math.ceil(res.length / $scope.numPerPage) + "0";
                        $scope.$watch('currentPage + numPerPage', function() {
                            var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                                , end = begin + $scope.numPerPage;

                            $scope.filteredTodos = $scope.todos.slice(begin, end);
                        })

                    });
                }

            })
        }
        // console.log(search_name);

    });

});


//修改身份后，按钮改为启用
function change_user(userNo) {

    if(!e){
        var e = window.event;
    }
    var tname = e.target;

    if(tname.tagName=='SELECT'){
        var a = tname.parentElement.parentElement.parentElement.lastElementChild.childNodes;//找到保存按钮
        a[0].outerHTML='<button onclick="save_user()" class="btn btn-info" id="btn_change" >保存</button>';
    }
}
//点击保存修改到数据库
function save_user() {
    var judgment = confirm("确定修改吗？");
    if(judgment==true){
        if(!e){
            var e = window.event;
        }
        var tname = e.target;
        if(tname.tagName=='BUTTON'){
            var userNo=tname.parentElement.parentElement.firstElementChild.innerHTML;//获取到表格第一列的userNo;
            var label_id=tname.parentElement.parentElement.childNodes[11].lastElementChild.id; //查询身份下拉列表的Label的ID
            var check_result=$('#'+label_id+' #change_user option:selected')[0].value; //查询身份下拉列表的选中项
            if(check_result=='--请选择--') alert('请重新选择');
            else{
                var dat={
                    userNo:userNo,
                    check_result:check_result
                }
                $.post('../api/ManageUserUpd',dat,function (res) {
                    if(res==1){
                        alert('修改成功，刷新页面后可见结果')
                    }
                    else{
                        alert('失败！请稍候重试...')
                    }
                })
            }
            // console.log(check_result);

        }
    }
}
