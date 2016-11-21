/**
 * Created by 张鼎 on 2016/10/15.
 */
$(document).ready(function () {
    $.post('../../start/api/getMyInfo',function (res) {
        // console.log(res)
        var dat = res.data
        $.post('../api/insertUser', dat, function (res) {
            $.post('../api/selectDept',function(dat){

                var userDeptNo=dat[0]['userDeptNo'];
                /*if(userDeptNo!='1' && userDeptNo!='2'){
                 $("#phoneNav").css("display",'none');
                 $("#quanxian1").css("display",'none');
                 }*/
                if(userDeptNo!=3){
                    $("#phoneNav").show()
                    $("#quanxian1").show()
                }
                else{
                    $("#phoneNav").hide()
                    $("#quanxian1").hide()
                }
                /*  console.log("zxcjjfjfjjfjfjfj这是手机的",typeof(userDeptNo));*/
                /*    // 动态设置单选按钮
                 var checkSex=dat[0]['sex']
                 if(checkSex=='女') $('input:radio:last').attr('checked', 'checked');
                 else $('input:radio:first').attr('checked', 'checked');
                 //在页面上显示相应的值
                 $("#photo").attr("src",dat[0]['avatar'])
                 $("#userNo").html(dat[0]['userNo']);
                 $("#userName").html(dat[0]['userName']);
                 $("#sex").html(dat[0]['sex'].checked);
                 $("#IdCardNo").html(dat[0]['IdCardNo']);
                 $("#userDeptNo").html(dat[0]['userDeptNo']);
                 $("#telNo").html(dat[0]['telNo']);
                 $("#college").html(dat[0]['college']);
                 $("#sign").html(dat[0]['sign']);
                 $("#introduce").html(dat[0]['introduce']);
                 $("#twitter").html(dat[0]['twitter']);
                 $("#QQ").html(dat[0]['QQ']);
                 $("#wechat").html(dat[0]['wechat']);*/
            })
        })
    })

})