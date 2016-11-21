
$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
        var dat={
            uid:uid
        }
        $.post('../../start/api/getMyInfo',function (res) {
            // console.log(res)
            var dat=res.data
            $.post('../api/insertUser',dat,function (res) {
                $.post('../api/selectDept',dat,function (res) {
                    var userDeptNo=res[0]['userDeptNo'];
                    if(userDeptNo=='1'){
                        $('#adminUser').show()
                        console.log('我是管理员')
                    }
                    else if(userDeptNo=='3'){
                        alert('你不是管理员')
                        window.location.href='http://m.xmgc360.com/exam/web/index.html'
                    }
                })
            })
            })

    }
});