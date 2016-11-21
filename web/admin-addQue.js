/*admin.controller('zdFirst', function($scope) {
    $.post('../api/courseType',function (res) {
        $scope.name=res
        console.log("yuyuyuy",res)

        for (var i=0;i<res.length;i++){
            $('#myId').append('<option value="'+res[i]["classNo"]+'">'+res[i]["className"]+'</option>')
        };


        $('#addTestNum').click(function () {
            var addDiv = $('#card').clone(true, true);
            $('#total').append(addDiv);
        })
    })
})*/
var uid;
$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
    }
});
$.post('../api/family',function (res) {
    for (var i=0;i<res.length;i++){
        $('#family').append('<option value="'+res[i]["familyNo"]+'">'+res[i]["familyName"]+'</option>')

    }
})
//克隆

//获取课程编号

//获取考试时间

//获取考试名称

$('input').blur(function () {
    var inputData = $('#surveyName').val();
    var re=/^\S{2,20}$/
    var reg=inputData.match(re);
    if(reg==null){
        alert('问卷名称为2-20个非空白字符')
    }
    else{
        var i=1;
        $('#addQueNum').click(function () {
            var cloneCard=$('#card')
            cloneCard[0].children[0].children[0].children[1].innerHTML=i
            i++;
            var addDiv = $('#card').clone(true, true);
            $('#total').append(addDiv);
            $('#createExam').removeAttr("disabled")
        })
    }
});
$('textarea').blur(function () {
    var textareaData = $('textarea')
    var regcount=0
    for(var i=0;i<textareaData.length;i++) {
        var regdata = textareaData[i].value
        var regLength = regdata.length
        if (regLength > 80) {
            alert('最大不能超过80个字符')
        }
        /*   var re=/^\S{0,80}$/
         var reg=regdata.match(re);
         if(reg==null){
         regcount+=1;
         }
         }
         if(regcount!=0){
         alert('最大不能超过80个字符,且不能含有空格')
         }*/
    }
});

//读取所有课程名称和编号，编号为value
var paper_total = {};             //试卷内部
var array_subject = [];        //所有题目数组

$('#createExam').click(function () {
    // alert('>>>>')
    var confirmRes=confirm('确定创建调查吗')
    if(confirmRes==true) {
        var textareaData = $('#total textarea');
        // console.log(textareaData);
        var a=4;
        var num = (textareaData.length)/4;
        // console.log(num);
        var judgment=0;
        for(var j=1;j<=num;j++){
            var newAA=[];  //每到题目数组
            for(var i = a*(j-1);i <a*j ;i++){
                // console.log(i);
                var dat = textareaData[i].value;
                // console.log("ddddd",dat);
                if(dat==''){
                    judgment+=1;
                    // console.log(textareaData[i],'请填写完整')
                }
                else{
                    newAA.push(dat);
                }
            }

            array_subject[j-1]=newAA
        }

        if(judgment!=0) {alert('请把必填选项填写完整和正确');}

        else{
            /*  var inputData = $('#total input')[0].value;*/
            var surName=$('#surveyName').val();
            var familyNo=$('#family option:selected').val();
            if(surName==''){
                alert('请输入调查名称')
            }
            else{
                paper_total.surName=surName;
                paper_total.bank=array_subject;
                paper_total.familyNo=familyNo;

                paper_total.uid=uid;
                // console.log('帅帅的',paper_total)
                $.post('../api/createSurvey',paper_total,function(res){
                    // alert(res);
                    window.location.href='adminManage.html'
                })
            }
        }

    }


})
