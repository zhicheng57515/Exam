/**
 * Created by 张鼎 on 2016/9/13.
 */


//获取文本框的值

$.post('../../start/api/getMyInfo',function (res) {
    // console.log(res)
    var dat=res.data
    $.post('../api/insertUser',dat,function (res) {

        $(document).ready(function () {
            $.post('../api/perMessage',function(dat){
         //数据库数据在页面显示（基本信息）
                // 动态设置单选按钮
                var checkSex=dat[0]['sex']
                if(checkSex=='女') $('input:radio:last').attr('checked', 'checked');
                else $('input:radio:first').attr('checked', 'checked');
                //在页面上显示相应的值

                /* $("#abc").attr('src',dat[0]['avatar'])*/
                /*console.log('去他妈的头像',dat)*/
                if(dat[0]['avatar']==undefined || dat[0]['avatar']==null || !dat[0]['avatar'] || dat[0]['avatar']==""){
                    $("#changePhoto").attr('src','images/userAvatar.png')
                }
                else{
                    $("#changePhoto").attr('src',dat[0]['avatar'])
                }

                $("#userNo").val(dat[0]['userNo']);
                $("#nicheng").val(dat[0]['userName']);
                $("#sex").val(dat[0]['sex'].checked);
                $("#IdCardNo").val(dat[0]['IdCardNo']);
                $("#userDeptNo").val(dat[0]['userDeptNo']);
                $("#telNo").val(dat[0]['telNo']);
                $("#college").val(dat[0]['college']);
                $("#sign").val(dat[0]['sign']);
                $("#introduce").val(dat[0]['introduce']);
                $("#twitter").val(dat[0]['twitter']);
                $("#QQ").val(dat[0]['QQ']);
                $("#wechat").val(dat[0]['wechat']);
            })
        })
    } )
    })


//修改后的个人信息保存到数据库
$('#save').click(function () {
    if($("#nicheng1").is(":visible")==false && $("#IdCardNo1").is(":visible")==false && $("#telNo1").is(":visible")==false
        && $("#college1").is(":visible")==false && $("#sign1").is(":visible")==false && $("#introduce1").is(":visible")==false
        && $("#twitter1").is(":visible")==false && $("#QQ1").is(":visible")==false && $("#wechat1").is(":visible")==false)
   {
       /*
        $('#save').attr('disabled',"true");
    }
    else {
        $('#save').removeAttr("disabled")
*/
    var result=confirm("保存修改")
    if(result==false){
        return
    }

    //传入接口的数据
            var personDat = {
                sex: $('input[name="sex"]:checked').val(),
                userName: $('#nicheng').val(),
                IdCardNo: $('#IdCardNo').val(),
                telNo: $('#telNo').val(),
                college: $("#college").val(),
                sign: $('#sign').val(),
                introduce: $('#introduce').val(),
                twitter: $('#twitter').val(),
                QQ: $('#QQ').val(),
                wechat: $('#wechat').val()
            };
            //将数据传入接口
            $.post('../api/updatePer', personDat, function (dat) {
                //根据返回码判断操作是否成功
                if (dat == 1) {
                    alert('修改成功');
                    /*window.location.href='http://m.xmgc360.com/exam/web/index.html'*/
                }
                else alert('修改失败')
            })
    }
});






$('#nicheng').blur(function () {
    var userName=$('#nicheng').val();
    if (userName.length>15 || userName.length==0)
    {
        $('#nicheng1').show();
       /* $('#save').attr('disabled',"true");*/
    }
    else {
        $('#nicheng1').hide();
       /* $('#save').attr('disabled',"false");*/
    }
});
$('#IdCardNo').blur(function () {
    var IdCardNo=$('#IdCardNo').val();
    if(IdCardNo.length>19){
        $('#IdCardNo1').show();
        /*$('#save').attr('disabled',"true");*/
    }else{
        $('#IdCardNo1').hide();
        /*$('#save').removeAttr("disabled")*/
    }
});
$('#telNo').blur(function () {
    var telNoVal=$('#telNo').val();
    var telNo2=/^\d{11}$/
    var telNo=telNoVal.match(telNo2)
    if(telNo==null){
        $('#telNo1').show();
      /*  $('#save').attr('disabled',"true");*/
    }
    else{
        $('#telNo1').hide();
        /*$('#save').removeAttr("disabled")*/
    }
});
$('#college').blur(function () {
    var college=$("#college").val();
    if(college.length>30 || college.length<4){
        $('#college1').show();
      /*  $('#save').attr('disabled',"true");*/
    }
    else{
        $('#college1').hide();
        /*$('#save').removeAttr("disabled")*/
    }
});
$('#sign').blur(function () {
    var sign=$('#sign').val();
    if(sign.length>60){
        $('#sign1').show();
       /* $('#save').attr('disabled',"true");*/
    }
    else {
        $('#sign1').hide();
       /* $('#save').removeAttr("disabled")*/
    }
});
$('#introduce').blur(function () {
    var introduce=$('#introduce').val();
    if (introduce.length>150){
        $('#introduce1').show();
        /*$('#save').attr('disabled',"true");*/
    }
    else {
        $('#introduce1').hide();
        /*$('#save').removeAttr("disabled")*/
    }
});
$('#twitter').blur(function () {
    var twitter=$('#twitter').val();
    if(twitter.length>15){
        $('#twitter1').show();
      /*  $('#save').attr('disabled',"true");*/
    }
    else{
        $('#twitter1').hide();
      /*  $('#save').removeAttr("disabled")*/
    }
});
$('#QQ').blur(function () {
    var QQ1=$('#QQ').val();
    var QQ2=/^[1-9][0-9]{4,}$/
    var QQ=QQ1.match(QQ2)
    if(QQ!=null || QQ1.length==0){
        $('#QQ1').hide();
        /*$('#save').attr('disabled',"true");*/
    }
    else{
        $('#QQ1').show();
       /* $('#save').removeAttr("disabled")*/
    }
});
$('#wechat').blur(function () {
    var wechat=$('#wechat').val();
    if(wechat.length>12){
        $('#wechat1').show();
      /*  $('#save').attr('disabled',"true");*/
    }
    else{
        $('#wechat1').hide();
       /* $('#save').removeAttr("disabled")*/
    }
});







