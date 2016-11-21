/**
 * Created by yyl15 on 2016/9/14.
 */
//var examId=$http.url.search
var uid;
$.post('../api/cookie',function(ret){
    if(ret.code==8788){
        window.location.href="../../start/web/account/?page=acc_login"
    }
    else{
        console.log(ret.data.uid)

        var examId = window.location.search;
        var newId=examId.substring(6)
        console.log(newId);
        var dat={}
        var qusNum;
        dat.name=newId;
        dat.uid=ret.data.uid
        $.post('../api/checkPaper',dat,function(ret){

            $('section').html(ret.text)
            $('#title').html(ret.title)
            $('#stuScore').html("总分:"+ret.score+"分，您的成绩为"+ret.stuCheckScore+"分")
            qusNum=ret.rows;

        });


    }
});


