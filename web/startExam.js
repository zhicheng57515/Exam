/**
 * Created by yyl15 on 2016/9/14.
 */
//var examId=$http.url.search
var uid;
var qusNum;
$.post('../api/cookie',function(retCoo){
    if(retCoo.code==8788){
        window.location.href="http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;;
        console.log(retCoo.data.uid)
        var examId = window.location.search;
        var newId=examId.substring(6)
        var dat={}

        dat.name=newId
        $.post('../api/examQue',dat,function(ret){
            console.log(ret.text)
            $('section').html(ret.text)
            $('#title').html(ret.title)
            qusNum=ret.rows;
            //倒计时
            var total=parseInt(ret.examTime)*60

            function timeCounter() {
                obj = document.getElementById('timeCounter');
                var s = (total%60) < 10 ? ('0' + total%60) : total%60;
                var h = total/3600 < 10 ? ('0' + parseInt(total/3600)) : parseInt(total/3600);
                var m = (total-h*3600)/60 < 10 ? ('0' + parseInt((total-h*3600)/60)) : parseInt((total-h*3600)/60);
                obj.innerHTML = h + ' : ' + m + ' : ' + s;
                total--;

                //int = setTimeout("timeCounter('" + elemID + "')", 100);
                if(total < 0) {
                    confirmPaper('0')
                }
            }
            setInterval(timeCounter,1000)
            //=======================================
        });
        /*$('#submitPaper').click(function(){
         var answerLi=new Array(0)
         var j= 1;
         for(var i= 0;i<qusNum;i++){
         var answer={}
         answer.checkNum = $('input[name='+j+']:checked').val()
         answer.testNum = $('input[name='+j+']:checked').attr("id")
         answerLi.push(answer)
         j++
         }
         var final=JSON.stringify(answerLi)
         $.post('../api/stuAnswer',final,function(){
         });

         console.log(final)
         })*/


    }
});
function confirmPaper(no) {
    console.log("提交")
    if (no == 1) {
        var needConfirm = confirm("确认提交试卷吗")
        if (needConfirm == false) {
            return;
        }
    }

    var finalDat = {}
    var answerLi = new Array(0)
    var j = 1;
    for (var i = 0; i < qusNum; i++) {
        var answer = {}
        answer.checkNum = $('input[name=' + j + ']:checked').val()
        answer.testNum = $('input[name=' + j + ']:checked').attr("id")
        if (no == 1) {
            if (!answer.checkNum) {
                alert("您的题目没有完成！")
                return;
            }
        }
        answerLi.push(answer)
        j++
    }
    finalDat.dat = JSON.stringify(answerLi)
    finalDat.uid=uid
    var newId=window.location.search.substring(6)
    finalDat.newId=newId;
    console.log(finalDat)
    $.post('../api/stuAnswer', finalDat, function (res) {
        if (res >= 1) {
            alert("提交成功！您已经完成考试")
            window.location.href = "index.html"
        }
        else {
            alert("提交失败，请稍候在进行提交")
        }
    });

}





/* window.onbeforeunload = close;*/
/*window.onbeforeunload = function(){
    confirmPaper('1');
    return "离开会自动提交试卷！";
}
      function close(){
          alert(">>>>>>>")
          console.log("%$^&#^*&%^")
      confirmPaper('1')
  }*/
/*$('#submitPaper').click(function(){
 var answerLi={}
 var j= 1;
 for(var i= 0;i<qusNum;i++){
 var answer={}
 answer.checkNum = $('input[name='+j+']:checked').val()
 answer.testNum = $('input[name='+j+']:checked').attr("id")
     var num;
 answerLi.a=answer
 j++
 }
 $.post('../api/stuAnswer',answerLi,function(){

 })
 console.log(answerLi)
 })*/

