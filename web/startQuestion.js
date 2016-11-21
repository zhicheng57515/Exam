
var uid;
var qusNum;
$.post('../api/cookie',function(retCoo){
    if(retCoo.code==8788){
        window.location.href="http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
        console.log(retCoo.data.uid);
        var surNo = window.location.search.substring(7);
        console.log(surNo);
        var dat={
            surNo:surNo,
            uid:retCoo.data.uid
        };

        $.post('../api/startQuestion',dat,function(ret){
            $('#quesTitle').html(ret.title);
            $('section').html(ret.text);
            qusNum=ret.rows;
            if(ret.rows2.length!=0){
                $('#submit').css("display","none");

                //  $("p").css("background-color","yellow");
            }
        });
    }
});


function confirmPaper() {
    var finalDat = {};
    var answerLi = new Array(0);
    var j = 1;
    for (var i = 0; i < qusNum; i++) {
        var answer = {};
        answer.checkNum = $('input[name=' + j + ']:checked').val();
        answer.testNum = $('input[name=' + j + ']:checked').attr("id");
            if (!answer.checkNum) {
                alert("您的题目没有完成！");
                return;
            }

        answerLi.push(answer);
        j++
    }
    finalDat.dat = JSON.stringify(answerLi);
    finalDat.uid=uid;

    $.post('../api/stuQueAnswer', finalDat, function (res) {
        if (res >= 1) {
            alert("提交成功！您已经完成问卷调查");
            window.location.href = "index.html"
        }
        else {
            alert("提交失败，请稍候在进行提交")
        }
    });

}
