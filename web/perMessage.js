/**
 * Created by 张鼎 on 2016/10/13.
 */
$(document).ready(function () {
    $.post('../api/perMessage',function(dat){

        // 动态设置单选按钮
        var checkSex=dat[0]['sex']
        if(checkSex=='女') $('input:radio:last').attr('checked', 'checked');
        else $('input:radio:first').attr('checked', 'checked');
        //在页面上显示相应的值
        if(dat[0]['avatar']==undefined || dat[0]['avatar']==null || !dat[0]['avatar'] || dat[0]['avatar']=="") {
            $("#myPhoto").attr("src", 'images/userAvatar.png')
            $("#phoneAvatar").attr("src", 'images/userAvatar.png')
            $("#photo").attr("src", 'images/userAvatar.png')
            $("#userNo").html(dat[0]['userNo']);
            $("#myName").html(dat[0]['userName']);
            $("#name").html(dat[0]['userName']);
            $("#phoneName").html(dat[0]['userName']);
            $("#indexName").html(dat[0]['userName']);
            $("#sex").html(dat[0]['sex']);
            $("#IdCardNo").html(dat[0]['IdCardNo']);
            $("#userDeptNo").html(dat[0]['userDeptNo']);
            $("#telNo").html(dat[0]['telNo']);
            $("#college").html(dat[0]['college']);
            $("#sign").html(dat[0]['sign']);
            $("#introduce").html(dat[0]['introduce']);
            $("#twitter").html(dat[0]['twitter']);
            $("#QQ").html(dat[0]['QQ']);
            $("#wechat").html(dat[0]['wechat']);
            $("#qianming").html(dat[0]['sign']);
        }else {
            $("#myPhoto").attr("src", dat[0]['avatar'])
            $("#name").html(dat[0]['userName']);
            $("#phoneAvatar").attr("src", dat[0]['avatar'])
            $("#photo").attr("src", dat[0]['avatar'])
            $("#userNo").html(dat[0]['userNo']);
            $("#myName").html(dat[0]['userName']);
            $("#phoneName").html(dat[0]['userName']);
            $("#indexName").html(dat[0]['userName']);
            $("#sex").html(dat[0]['sex']);
            $("#IdCardNo").html(dat[0]['IdCardNo']);
            $("#userDeptNo").html(dat[0]['userDeptNo']);
            $("#telNo").html(dat[0]['telNo']);
            $("#college").html(dat[0]['college']);
            $("#sign").html(dat[0]['sign']);
            $("#introduce").html(dat[0]['introduce']);
            $("#twitter").html(dat[0]['twitter']);
            $("#QQ").html(dat[0]['QQ']);
            $("#wechat").html(dat[0]['wechat']);
            $("#qianming").html(dat[0]['sign']);
        }



    })
})