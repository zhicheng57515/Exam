var uid;
$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
        console.log(uid)
    }
});

admin.controller('zdFirst', function($scope) {
    $.post('../api/ManageClass',function (res) {
        $scope.name=res;
        console.log("yuyuyuy",res);

        for (var i=0;i<res.length;i++){
            $('#myId').append('<option value="'+res[i]["classNo"]+'">'+res[i]["className"]+'</option>');
            $('#fClass').append('<option value="'+res[i]["classNo"]+'">'+res[i]["className"]+'</option>')
        };
    });
    $.post('../api/family',function (res) {
        for (var i=0;i<res.length;i++){
            $('#family').append('<option value="'+res[i]["familyNo"]+'">'+res[i]["familyName"]+'</option>');
            $('#family2').append('<option value="'+res[i]["familyNo"]+'">'+res[i]["familyName"]+'</option>');
            $('#fFamily').append('<option value="'+res[i]["familyNo"]+'">'+res[i]["familyName"]+'</option>')
        }
    })
});

$('input').blur(function () {
    var inputData =$('#testPlanName').val();
    var re=/^\S{2,20}$/;
    var reg=inputData.match(re);
    if(reg==null){
        alert('考试名称为2-20个非空白字符')
    }
    else{
        var i=1;
        $('#addTestNum').click(function () {
            var cloneCard=$('#card')
            cloneCard[0].children[0].children[0].children[1].innerHTML=i;
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
        if (regLength > 180) {
            alert('最大不能超过180个字符')
        }
        /* var re=/^\S{0,80}$/
         var reg=regdata.match(re);
         if(reg==null){
         regcount+=1;
         }
         }
         if(regcount!=0){
         alert('最大不能超过80个字符')
         }*/
    }
});

//读取所有课程名称和编号，编号为value
var paper_total = {};             //试卷内部
var array_subject = [];        //所有题目数组
var answerLi=[];               //所有题目答案
$('#createExam').click(function () {
    var confirmRes=confirm('确定创建考试吗')
    if(confirmRes==true) {
        var textareaData = $('#total textarea');
        // console.log(textareaData);
        var a=5;
        var num = (textareaData.length)/a;
        console.log(num);
        /* console.log(num);
         console.log("inputData",inputData.length);
         console.log("num",num);*/
        var judgment=0;
        for(var j=1;j<=num;j++){
            var newAA=[];  //每到题目数组
            for(var i = a*(j-1);i <a*j ;i++){
                // console.log(i);
                var dat = textareaData[i].value;
                // console.log("ddddd",dat);
                if(dat==''){
                    judgment+=1;
                    console.log(textareaData[i],'请把必填选项填写完整')
                }
                else{
                    // console.log(a*(j-1),a*j);
                    newAA.push(dat);
                    // console.log(newAA)
                }
            }

        /*    var Obj_num=$('strong:eq('+j+')')[0].innerHTML
            Obj_num=j;
            console.log(Obj_num)*/

            var ANindex=parseInt(3+j);
            answerLi=$('select:eq('+ANindex+') option:selected').val()
            newAA.push(answerLi)

            /*   分值判断NAN
             var str = newAA[j*7];
             reg=/^[-+]?\d*$/;
             if(!reg.test(str)){
             judgment+=1;  console.log(judgment);
             }
             console.log(j*7,newAA[7]);*/
            array_subject[j-1]=newAA
        }



        if(judgment!=0) alert('请把必填选项填写完整和正确');
        else{
            /*  var inputData = $('#total input')[0].value;*/
            var planName=$('#testPlanName').val();
            var time=$('#testTime option:selected').val();
            var classNo=$('#myId option:selected').val();
            var familyNo=$('#family option:selected').val();
            if(planName==''){
                alert('请输入试卷名称')
            }
            else{
                paper_total.planName=planName;
                paper_total.time=time;
                paper_total.classNo=classNo;
                paper_total.bank=array_subject;
                paper_total.uid=uid;
                paper_total.familyNo=familyNo;
                console.log(paper_total)
                $.post('../api/createTest',paper_total,function(res){
                    // alert(res);
                    window.location.href='adminManage.html'
                })
            }
        }


    }

});
