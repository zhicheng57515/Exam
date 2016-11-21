$('#test_no').hide();

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

//读取所有课程名称和编号，编号为value
    $.post('../api/ManageClass', function (res) {
        for (var i=0;i<res.length;i++) {
            $('#check').append("<option value='"+res[i].classNo+"'>"+res[i].className+"</option>");
    }
        var checkClass,checkClassName,dat1,checkClass1;
    $('#check').change(function () {  //选择课程后执行的函数
        var options=$("#check option:selected");  //获取选中的项
        checkClass = options.val();
        checkClassName = options.text();
        var dat={
            checkClass:checkClass
        };
        //查询选择的课程在题库中题目的数量
        if(checkClass=='--请选择--'){
            alert('请选择课程')
        }
        else{
            $.post('../api/ManageCount',dat,function (res1) {
                if(res1[0]['count(*)']==0){
                    $('#classNumber').html('您选择的课程在题库中没有题目，不能进行抽取试题');
                    checkClass='';
                    checkClassName=''
                }
                else{
                    $('#classNumber').html('')
                    $('#checkNum').html(' <option>--请选择--</option>');
                    for(var i=0;i<res1[0]['count(*)'];i++){
                        $('#checkNum').append("<option value='"+(i+1)+"'>"+(i+1)+"</option>");
                    }
                }
            });
            checkClass1='';
        }

    });

        $('#checkNum').change(function () {    // 选择题目数量后执行的函数
            var options1=$("#checkNum option:selected");  //获取选中的项
             checkClass1 = options1.val();

            dat1={
                checkClass1:checkClass1,        //选中的题目数量
                checkClass:checkClass           //获选择的课程编号，课程名称checkClassName
            };
           // console.log(dat1,checkClassName);

        });
        $('#generate').click(function () {
            $('#paper').html('');

            // console.log("dddddddddd",checkClass1,checkClass);
            if(checkClass1==''||checkClass==''){
                alert('请选择课程和生成题目数量');
                $('#total').hide();
            }
            else if(checkClass1==undefined||checkClass==undefined){
                alert('请选择课程和生成题目数量')
                $('#total').hide();
            }
            else if(checkClass1=='--请选择--'||checkClass=='--请选择--'){
                alert('请选择课程和生成题目数量')
                $('#total').hide();
            }
            else{
                $('#total').show();
                $.post('../api/ManageRandom',dat1,function (paper) {
                    for(var a=0;a<paper.length;a++){
                        var model=$('#topic').clone(true,true);
                        model.find('#topicNum').html(a+1);
                        model.find('#topicContent').html(paper[a]['testContent']);
                        model.find('#test_no').html(paper[a]['testNo']);
                        model.find('#topicA').html(paper[a]['optionA']);
                        model.find('#topicB').html(paper[a]['optionB']);
                        model.find('#topicC').html(paper[a]['optionC']);
                        model.find('#topicD').html(paper[a]['optionD']);
                        model.find('#answer').html(paper[a]['answer']);
                        $('#paper').append(model);
                    }

                    // console.log("试卷",paper)
                })
            }

        });


    });
$.post('../api/family',function (res) {
    for (var i=0;i<res.length;i++){
        /*$('#family').append('<option value="'+res[i]["familyNo"]+'">'+res[i]["familyName"]+'</option>');*/
        $('#family2').append('<option value="'+res[i]["familyNo"]+'">'+res[i]["familyName"]+'</option>')
    }
})
var paper_total = {};             //试卷内部
var array_subject = [];        //所有题目数组

$('input').blur(function () {
    var inputData = $('#total input')[0].value;
    var re=/^\S{2,20}$/
    var reg=inputData.match(re);
    if(reg==null) alert('试卷名称为2-20个非空白字符')
    else{
        $('#createExam').click(function () {
            var time=$('#testTime option:selected').val();
            var familyNo=$('#family2 option:selected').val();
            var checkObj=$('#check option:selected').val();

            var confirmRes=confirm('确定创建考试吗')
            if(confirmRes==true) {
                var textareaData = $('#total textarea');
                var a=7;
                var num = (textareaData.length)/7;
                /* console.log(num);
                 console.log("inputData",inputData.length);
                 console.log("num",num);*/
                var judgment=0;
                for(var j=1;j<=num;j++){
                    var newAA=[];  //每到题目数组
                    for(var i = a*(j-1);i <a*j ;i++){
                        // console.log(i);
                        var dat = textareaData[i].innerHTML||textareaData[i].value;
                        // console.log(dat);
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

                var inputData = $('#total input')[0].value;
                var re=/^\S{2,20}$/
                var reg=inputData.match(re);

                // console.log(reg)
                if(inputData==''){
                    alert('请输入试卷名称')
                }
                else if(reg==null){
                    alert('试卷名称为2-20个字符')
                }
                else{
                    paper_total.planName=inputData;
                    paper_total.time=time;
                    paper_total.classNo=checkObj;
                    paper_total.bank=array_subject;
                    paper_total.uid=uid;
                    paper_total.familyNo=familyNo;
                    console.log(paper_total)
                    $.post('../api/randomTest',paper_total,function (res) {
                        alert(res)
                        window.location.href='adminManage.html'
                    })
                }
            }
        });
    }
});


