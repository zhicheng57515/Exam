/*http路由分发
 接口模式server/:app/:api

 注意事项！！！！！！！！！！！
 不要轻易修改他人接口，
 再写接口写在自己的部分的最下方，注意分割线

 */

var _rotr = {};

//http请求的路由控制
_rotr = new $router();

//访问的请求
_rotr.get('api', '/api/:apiname', apihandler);
_rotr.post('api', '/api/:apiname', apihandler);
var _mysql=require('./_mysql')
var _ctnu = require('./ctnu');




/*所有api处理函数都收集到这里
 必须是返回promise
 各个api处理函数用promise衔接,return传递ctx
 */
_rotr.apis = {};

/*处理Api请求
 默认tenk的api直接使用
 每个app的独立api格式appname_apiname
 */
function * apihandler(next) {
    var ctx = this;
    var apinm = ctx.params.apiname;

    console.log('API RECV:', apinm);

    //匹配到路由函数,路由函数异常自动返回错误,创建xdat用来传递共享数据
    var apifn = _rotr.apis[apinm];
    ctx.xdat = {
        apiName: apinm
    };

    if (apifn && apifn.constructor == Function) {
        yield apifn.call(ctx, next).then(function() {

            //所有接口都支持JSONP,限定xx.x.xmgc360.com域名
            var jsonpCallback = ctx.query.callback || ctx.request.body.callback;
            if (jsonpCallback && ctx.body) {
                if (_cfg.regx.crossDomains.test(ctx.hostname)) {
                    ctx.body = ctx.query.callback + '(' + JSON.stringify(ctx.body) + ')';
                };
            };

        }, function(err) {
            ctx.body = __newMsg(__errCode.APIERR, [err.message, 'API proc failed:' + apinm + '.']);
            __errhdlr(err);
        });
    } else {
        ctx.body = __newMsg(__errCode.NOTFOUND, ['服务端找不到接口程序', 'API miss:' + apinm + '.']);
    };

    yield next;
}

//===================================================杨玉玲的接口===============================================


//用户登录信息写入数据库
_rotr.apis.insertUser = function(){
    var ctx = this;
    var co = $co(function* () {
        var id = ctx.query.id || ctx.request.body.id;
        if (!id ) throw Error('请输入id.');

        console.log(id);

        var nick = ctx.query.nick || ctx.request.body.nick;
        if (!nick ) throw Error('请输入nick.');

        var phone = ctx.query.phone || ctx.request.body.phone;
        if (!phone ) throw Error('请输入phone.');

        var res;
        var sqlstr="select * from usertable where userNo="+id;
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        var rows1;
        var lastData=0;
        if(rows.length!=0){
            res='数据库中已有'
        }
        else{
            var sqlstr1=" insert into usertable(userNo,userName,telNo,familyNo,sex) values('"+id+"','普通用户','"+phone+"','1','男')";
             rows1=yield _ctnu([_mysql.conn,'query'],sqlstr1);
            if(!rows1)throw Error("失败");
            console.log(rows1)
            lastData=rows1.affectedRows
        }
        ctx.body = lastData;
        return ctx;
    });
    return co;
};

//======================================管理账户界面
//显示所有教师信息
_rotr.apis.ManageUser = function(){
    var ctx = this;
    var co = $co(function* () {
        var user = ctx.query.user || ctx.request.body.user;
        if (!user ) throw Error('请输入user.');

        var sqlstr="select userNo,userName,sex,userDeptNo,telNo from usertable where userDeptNo="+user;
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        ctx.body = rows;
        return ctx;
    });
    return co;
};
//根据userNo查询信息
_rotr.apis.ManageUserSel = function(){
    var ctx = this;
    var co = $co(function* () {

        var search_name = ctx.query.search_name || ctx.request.body.search_name;
        if (!search_name ) throw Error('请输入search_name.');

        var sqlstr="select userNo,userName,sex,userDeptNo,telNo from usertable where userName like'%"+search_name+"%'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        // console.log(rows)
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//根据userNo修改账号身份
_rotr.apis.ManageUserUpd = function(){
    var ctx = this;
    var co = $co(function* () {

        var userNo = ctx.query.userNo || ctx.request.body.userNo;
        if (!userNo ) throw Error('请输入userNo.');

        var check_result = ctx.query.check_result || ctx.request.body.check_result;
        if (!check_result ) throw Error('请输入check_result.');

        var sqlstr="update usertable set userDeptNo="+check_result+"  where userNo = "+userNo;
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        // console.log(rows.affectedRows);
        ctx.body = rows.affectedRows;
        return ctx;
    });
    return co;
};

//======================================考试统计界面
//排序
//该教师创建的所有考试
_rotr.apis.ManageExam = function(){
    var ctx = this;
    var co = $co(function* () {

        var uid = ctx.query.uid || ctx.request.body.uid;

        var sqlstr="select * from (" +
            "select count(*) as num,t1.testPlNo as 考试编号,t2.testPlName as 考试名称,t2.addTime from testtable t1 inner join testplan t2" +
            " on t1.testPlNo= t2.testPlNo and t2.testPlUserNo="+uid+" " +
            "GROUP BY t1.testPlNo) tmp1,(select t.testPlName,t.testPlNo as tt," +
            "c.className,u.userName from testplan t inner join examtable e inner join usertable u " +
            "inner join classtable c on t.testPlExamNo=e.examNo and u.userNo=t.testPlUserNo " +
            " and c.classNo=e.examClassNo and t.testPlNo in " +
            "(select testPlNo from testtable where testUserNo="+uid+")) tmp2 where tmp1.考试编号 = tmp2.tt ORDER BY addTime desc";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        /*   var sqlstr1="select count(*) as 人数,t1.testPlNo as 考试编号," +
         "t2.testPlName as 考试名称 from testtable t1 inner join testplan t2 " +
         "on  mark=1 and t1.testPlNo= t2.testPlNo and t2.testPlUserNo=39 GROUP BY t1.testPlNo";*/
        ctx.body = rows;
        return ctx;
    });
    return co;
};

//教师查看试卷
_rotr.apis.ManageExamPaper = function(){
    var ctx = this;
    var co = $co(function* () {

        var newId = ctx.query.newId || ctx.request.body.newId;
        if (!newId ) throw Error('请输入userNo.');

        var sqlstr="select * from banktable where testNo in (" +
            "select examDetBankNo from examdetail where examDetNo in( select testPlExamNo from testplan where testPlNo ='"+newId+"'))";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        var sqlstr2="select testPlName from testplan where testPlNo='"+newId+"'";
        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows2)throw Error("失败");


        for(var i=0;i<rows.length;i++){
            rows[i].num=i+1;
        }
        var res={
            rows:rows,
            rows2:rows2
        }

        ctx.body = res;
        return ctx;
    });
    return co;
};

//根据试卷编号读取学生分数
_rotr.apis.ManageScore = function(){
    var ctx = this;
    var co = $co(function* () {

        var newId = ctx.query.newId || ctx.request.body.newId;
        if (!newId ) throw Error('请输入newId.');

        var sqlstr="select testScore,userName from testtable t," +
            "(select userName,userNo from usertable) u " +
            "where  t.testUserNo=u.userNo and testPlNo="+newId+" and mark=1";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        var sqlstr2="select testPlName from testplan where testPlNo='"+newId+"'";
        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows2)throw Error("失败");


        var sqlstr3="select count(*) from banktable where testNo in (select examDetBankNo from examdetail where examDetNo in( select testPlExamNo from testplan where testPlNo ='"+newId+"'))"
        var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);
        if(!rows3)throw Error("失败");

        var res={
            rows:rows,
            rows2:rows2,
            rows3:rows3
        }
        // console.log(rows);
        ctx.body = res;
        return ctx;
    });
    return co;
};


//============================================问卷统计界面

//该教师创建的所有问卷
_rotr.apis.ManageQues = function(){
    var ctx = this;
    var co = $co(function* () {

        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('Id不合法.');

        var sqlstr="select * from surPlan where surPlUserNo='"+uid+"' order by addTime desc";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        // console.log(rows);
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//教师查看问卷
_rotr.apis.ManageQuePaper = function(){
    var ctx = this;
    var co = $co(function* () {

        var newId = ctx.query.newId || ctx.request.body.newId;
        if (!newId ) throw Error('请输入newId.');

        var sqlstr="select * from surveyBank where surBankNo in( " +
            "select surBankNo from survey where surNo="+newId+")";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        var sqlstr2="select surName from surPlan where surNo='"+newId+"'";
        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows2)throw Error("失败");
        for(var i=0;i<rows.length;i++){
            rows[i].num=i+1;
        }
        var res={
            rows:rows,
            rows2:rows2
        }

        ctx.body = res;
        return ctx;
    });
    return co;
};

//根据问卷编号读取学生答案
_rotr.apis.ManageAns = function(){
    var ctx = this;
    var co = $co(function* () {

        var newId = ctx.query.newId || ctx.request.body.newId;
        if (!newId ) throw Error('请输入newId.');

        //查询题目
        var sqlstr1="select * from surveyBank where surBankNo in(select surBankNo from survey where surNo="+newId+")"
        var rows1=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows1)throw Error("失败");

        var sqlstr5="select surName from surPlan where surNo='"+newId+"'";
        var rows5=yield _ctnu([_mysql.conn,'query'],sqlstr5);
        if(!rows5)throw Error("失败");

        // console.log(rows5);

        for(var j=0;j<rows1.length;j++){

            var newC=[];
            var surBankNo=rows1[j]['surBankNo'];


            var a=rows1[j]['optionA'];
            var sqlstr="select count(*) from survey where surBankNo="+surBankNo+" and userAnswer='"+a+"'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
            newC[0]=rows[0]['count(*)'];

            var b=rows1[j]['optionB'];
            var sqlstr2="select count(*) from survey where surBankNo="+surBankNo+" and userAnswer='"+b+"'";
            var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
            newC[1]=rows2[0]['count(*)'];

            var c=rows1[j]['optionC'];
            var sqlstr3="select count(*) from survey where surBankNo="+surBankNo+" and userAnswer='"+c+"'";
            var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);
            newC[2]=rows3[0]['count(*)'];

            rows1[j].chooseNum=newC;
            rows1[j].idNum=j+1;
        }

        if(rows1.length==0){
            var a={
                surContent:'暂无'
            }
            rows1[0]=a;
        }
        var res={
            rows1:rows1,
            rows5:rows5[0]['surName']
        }
        ctx.body = res;
        return ctx;
    });
    return co;
};

//==================================================随机产生试题
//读取课程名
_rotr.apis.ManageClass = function(){
    var ctx = this;
    var co = $co(function* () {

        var sqlstr="select * from classtable";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        ctx.body = rows;
        return ctx;
    });
    return co;
};
//查询课程在题库中的题目数量
_rotr.apis.ManageCount = function(){
    var ctx = this;
    var co = $co(function* () {

        var checkClass = ctx.query.checkClass || ctx.request.body.checkClass;
        if (!checkClass ) throw Error('请输入课程名称.');
        //console.log(checkClass);

        var sqlstr="select count(*) from banktable where testClaNo = "+checkClass;
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        // console.log(rows);
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//随机生成题目
_rotr.apis.ManageRandom = function(){
    var ctx = this;
    var co = $co(function* () {

        var checkClass1 = ctx.query.checkClass1 || ctx.request.body.checkClass1;
        if (!checkClass1 ) throw Error('请输入题目数量.');
        // console.log("请输入题目数量",checkClass1);

        var checkClass = ctx.query.checkClass || ctx.request.body.checkClass;
        if (!checkClass ) throw Error('请输入课程编号.');

        var sqlstr="select * from banktable where testClaNo = "+checkClass;
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        for(var i = 0;i < rows.length;i++){
            rows[i].id=i+1;
        }

        var output = [];
        function numbers(num) {
            var numbercount = num;
            var maxnumbers = rows.length;

            // console.log("rows.length",rows.length);
            // console.log("rows.num"+num);
            var ok = 1;
            r = new Array (numbercount);
            // console.log("numbercount111",numbercount);
            for (var i = 1; i <= numbercount; i++) {
                r[i] = Math.round(Math.random() * (maxnumbers-1))+1;
            }
            for (var i = numbercount; i >= 1; i--) {
                for (var j = numbercount; j >= 1; j--) {
                    if ((i != j)  &&  (r[i] == r[j])) ok = 0;
                }
            }
            if (ok) {

                // console.log("numbercount2222",numbercount);
                for (var k = 1; k <= numbercount; k++) {
                    output.push(r[k]) ;
                }
                //document.lotto.results.value = output;

                // console.log(output);

            }
            else numbers(num);
        }
        var num = parseInt(checkClass1);
        // console.log(num);
        numbers(num);

        var res=[];
        for(var key in rows){
            for(var c = 0;c < output.length;c++){
                if(rows[key]['id'] == output[c]){
                    //console.log("aaa",rows[key])
                    res.push(rows[key]);
                }
                else{
                    //console.log('随机数比较出错')
                }
            }
        }
        // console.log(">>>",output);
        // console.log("结果",res);
        ctx.body = res;
        return ctx;
    });
    return co;
};


//angularjs数据
_rotr.apis.angularjs = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select usertable.userNo,usertable.userName from usertable";

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        ctx.body = rows;
        //console.log(rows)
        return ctx;
    });
    return co;
};


//注册发送验证码
_rotr.apis.SendMes = function () {
    var ctx = this;
    var co = $co(function * () {
        var res = yield _fns.getUidBySendMes(ctx);
        //返回结果
        ctx.body = res;
        return ctx;
    });
    return co;

};
//项目工厂的注册接口调用
_rotr.apis.reg = function () {
    var ctx = this;
    var co = $co(function * () {
        var res = yield _fns.reg(ctx);
        //返回结果
        var phone = ctx.query.phone || ctx.request.body.phone;
        if (!phone ) throw Error('请输入手机号.');
        var pw = ctx.query.pw || ctx.request.body.pw;
        if (!pw ) throw Error('请输入密码.');

        var regResult;
        var sqlstr="insert into usertable set userNo='"+ phone +"',userPwd=MD5('"+ pw +"')";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }
        console.log(">>>>>>")
        ctx.body = res;
        return ctx;
    });
    return co;

};
//项目工厂的登录接口
var userNo;
_rotr.apis.login = function () {
    var ctx = this;
    var co = $co(function * () {
        var res = yield _fns.login(ctx);
        //返回结果
        userNo=res.data.phone
        var uId=res.data.id
        var pw = ctx.query.pw || ctx.request.body.pw;
        if (!pw ) throw Error('请输入手机号.');

        var checkUser;
        var regResult;
        var sqlstr1="select count(*) from usertable where usertable.userNo='"+userNo+"'"
        var rows1=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows1)throw Error("失败");
        var count=rows1[0]['count(*)']
        console.log(count)
        if(count!=1){
            var sqlstr="insert into usertable set userNo='"+ userNo +"',userPwd=MD5('"+ pw +"'),uId='"+uId+"'"
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
            if(!rows)throw Error("失败");
            else{
                regResult=1;
            }
        }
        ctx.body = res;
        return ctx;
    });
    return co;

};
//读取cookie
_rotr.apis.cookie = function () {
    var ctx = this;
    var co = $co(function * () {
        var res = yield _fns.getUidByCtx(ctx);
        //返回结果
        ctx.body = res;
        return ctx;
    });
    return co;

};

//自己写的注册接口
/*_rotr.apis.reg = function() {
 var ctx = this;
 var co = $co(function* () {
 var name = ctx.query.name || ctx.request.body.name;
 if (!name ) throw Error('姓名格式不合法.');

 var pw = ctx.query.pw || ctx.request.body.pw;
 if (!pw) throw Error('密码格式不合法.');
 var regResult;
 var sqlstr="insert into usertable set userNo='"+ name +"',userPwd=MD5('"+ pw +"')"
 var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
 if(!rows)throw Error("失败");
 else{
 regResult=1;
 }

 var res=(regResult)
 ctx.body = res
 return ctx;
 });
 return co;
 };*/
//注册查询用户名是否重复
_rotr.apis.regSel = function() {
    var ctx = this;
    var co = $co(function* () {
        var name = ctx.query.name || ctx.request.body.name;
        var regResult;
        var sqlstr="select count(*) from usertable where userNo='"+name+"'"
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        regResult= rows[0]['count(*)'];
        var res=(regResult)
        console.log(regResult,name)
        ctx.body = res
        return ctx;
    });
    return co;
};
//登录接口

/*_rotr.apis.login = function() {
 var res={}
 var ctx = this;
 var co = $co(function* () {
 var name = ctx.query.name || ctx.request.body.name;
 if (!name ) throw Error('姓名格式不合法.');
 userNo=name
 var pw = ctx.query.pw || ctx.request.body.pw;
 if (!pw) throw Error('密码格式不合法.');

 var sqlstr="select count(*) from usertable where userNo='"+name+"' and userPwd=md5('"+pw+"')"
 var dat={};
 var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
 if(!rows)throw Error("失败");

 dat.num = rows[0]['count(*)'];
 console.log(dat)
 ctx.body = dat;
 return ctx;
 });
 return co;
 };*/


//考试专区页面教师信息读取
_rotr.apis.examZone = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {

        var sqlstr="select userName,telNo,QQ,avatar from usertable where userDeptNo='2'";

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

       /* console.log(rows)

        var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/examZone.ejs', 'utf8');

        var ret = ejs.render(str,{rows});*/

        ctx.body = rows;
        return ctx;
    });
    return co;
};
//排序
//未参加的考试页面考试信息读取
_rotr.apis.nextTest = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {
        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');

        var sqlstr="select t.testPlName,t.testPlNo,c.className,u.userName,t.addTime from testplan t inner " +
            "join examtable e inner join usertable u inner join classtable c " +
            "on t.testPlExamNo=e.examNo and u.userNo=t.testPlUserNo and c.classNo=e.examClassNo  " +
            " and t.testPlNo in (select testPlNo from testtable where testUserNo="+uid+" and mark=0) order by t.addTime desc"

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

  /*      var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/nextTest.ejs', 'utf8');

        var ret = ejs.render(str,{rows});*/
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//考试试题题目
var $examId,$examName,$examTime;
_rotr.apis.examQue = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {
        var examId = ctx.query.name || ctx.request.body.name;
        if (!examId ) throw Error('姓名格式不合法.');
        $examId=examId
        //查询对应的试题信息
        var sqlstr="select * from banktable where testNo in (" +
            "select examDetBankNo from examdetail where examDetNo in(" +
            "select testPlExamNo from testplan where testPlNo='"+examId+"'))";
         //查询考试的信息
        var sqlstr2="select * from testplan where testPlNo='"+examId+"'"
        /*var sqlstr3="select examTime from testplan where testPlExamNo='"+examId+"'"*/
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        console.log('在哪输出的？',rows)
        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        /*var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);*/
        if(!rows)throw Error("失败");
        if(!rows2)throw Error("失败");
       /* if(!rows3)throw Error("失败");*/


        $examName=rows2[0]['testPlName']
        $examTime=rows2[0]['examTime']
        var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/startExam.ejs', 'utf8');
        var ret={}

        ret.text = ejs.render(str,{rows});
        $examSubject=rows
        ret.rows=rows.length
        ret.title=$examName
        ret.examTime=$examTime

        ctx.body = ret;
        return ctx;
    });
    return co;
};
//参加过的考试
//排序
_rotr.apis.exTest = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {
        var uid = ctx.query.uid || ctx.request.body.uid;
       if (!uid ) throw Error('姓名格式不合法.');

        var sqlstr=" select t.testPlName,t.testPlNo,c.className,u.userName from testplan t inner " +
        "join examtable e inner join usertable u inner join classtable c " +
        "on t.testPlExamNo=e.examNo and u.userNo=t.testPlUserNo and c.classNo=e.examClassNo " +
        " and t.testPlNo in (select testPlNo from testtable where testUserNo="+uid+" and mark=1) ORDER BY t.addTime desc"

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");


      /*  var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/extest.ejs', 'utf8');
        var ret = ejs.render(str,{rows});
*/
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//学生答案题号存入数据库,更改mark标记为1
var checkNumDat;
_rotr.apis.stuAnswer = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {
        /*var dataObj={
         checkNumDat :  ctx.request.body.checkNum,
         testNumDat :  ctx.request.body.testNum
         }

         var dataArray=new Array(0)
         var i=0;
         dataArray[i]=dataObj
         i++
         console.log(dataArray)*/
        // var checkNumDat = JSON.parse( ctx.request.body)

        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');
        var testPlNo = ctx.query.newId || ctx.request.body.newId;
        if (!testPlNo ) throw Error('姓名格式不合法.');

        var   finalDat =JSON.parse(ctx.request.body.dat)//接收传过来的学生选择的答案内容和对应题目编号
        var finalScore=0;//定义一个总成绩，接收每道题的分值相加
        /*var answerLi=new Array(0)
         var i=0;
         for(var key in rows3){
         var answerObj={
         answerTestNo:rows3[key]['testNo'],
         answerRight:rows3[key]['answer'],
         answerScore:rows3[key]['examSetScore']
         }
         answerLi[i]=answerObj
         i++
         }
         console.log("正确答案",answerLi)*/
        for(var key in finalDat){
            //题号
            var testNumDat=finalDat[key]['testNum']
            //学生答案
            checkNumDat =finalDat[key]['checkNum']
            console.log("学生答案",testNumDat,checkNumDat)
            //查询testId
            var testIdNo;
            var selcetTestId = "select testId from testtable where testPlNo='"+testPlNo+"' and testUserNo='"+uid+"'";
            var testIdRes=yield _ctnu([_mysql.conn,'query'],selcetTestId);
            console.log('查询testId',testIdRes)
            if(!testIdRes){throw Error("失败");}
            else{
                testIdNo=testIdRes[0].testId;
            }

            var sqlstr="insert into testdetail set testId='"+testIdNo+"',testDetBankNo='"+testNumDat+"'," +
                "testAnswer='"+checkNumDat+"',userNo='"+uid+"'"

            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
            if(!rows)throw Error("失败");

            var sqlstr3="select * from banktable where testNo='"+testNumDat+"'"
   /*             "select examDetBankNo,examSetScore from examdetail where examDetBankNo='"+testNumDat+"' " +
                " and examDetNo='"+$examId+"')a  where  testNo='"+testNumDat+"'" +
                " and a.examDetBankNo=banktable.testNo"*/
            //查询对应题目编号的答案
            var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);
            if(!rows3)throw Error("失败");
            console.log('这又是啥？？？？？',rows3)
            var rightAnswer=rows3[0]['answer']

            if(checkNumDat==rightAnswer){
                console.log("答案正确")
                finalScore+=5;
            }
            else {
                console.log("答案错误")
            }
        }

        console.log(finalScore)

        var sqlstr2="update testtable set mark=1,testScore='"+finalScore+"' where testUserNo='"+uid+"' and testPlNo ='"+testPlNo+"'"
        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows2)throw Error("失败");

        var res=rows2['changedRows']
        console.log("改变行",rows2)

        ctx.body = res;
        return ctx;
    });
    return co;
};
//问卷调查页面问卷标题读取
//排序
_rotr.apis.question = function(){
    var ctx = this;
    var co = $co(function* () {
        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');

        var sqlstr="select userName,surNo,surName,mark from usertable inner join(" +
            "select s.surNo,surName,surPlUserNo,mark,s.addTime  from surPlan s," +
            "(select distinct surNo,mark from survey where surUserNo="+uid+") a" +
            " where a.surNo=s.surNo )as test  on usertable.userNo=test.surPlUserNo order by addTime desc"

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");


      /*  var userLi=new Array(0);
      var i=0;
       for (var key in rows){
            var sqlstr2="select userName from usertable where userNo='"+rows[key]['surPlUserNo']+"' "
            var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
            if(!rows2)throw Error("失败");

            userLi[i]=rows2[0]['userName']
            i++;
        }*/
/*
        var sqlstr3="select distinct surNo from survey s where s.mark='0'  and surUserNo="+uid

        var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);
        if(!rows3)throw Error("失败");

        var unread=rows3.length*/


      /*  var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/question.ejs', 'utf8');

        var ret = ejs.render(str,{rows,userLi});*/
        var res=rows;

        //console.log(ret)
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//问卷题目读取
_rotr.apis.startQuestion = function(){
    var ctx = this;
    var co = $co(function* () {
        var surNo = ctx.query.surNo || ctx.request.body.surNo;
        console.log("surNo",surNo)

        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');

        $surNo=surNo;
        var sqlstr="select * from surveyBank where surBankNo in(" +
            "select surBankNo from survey where surNo='"+surNo+"' and survey.surUserNo='"+uid+"')";

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        //查询MARK为1的题目答案
        var sqlstr2="select b.*,a.userAnswer,a.mark from surveyBank b,(select * from survey " +
            "where survey.surUserNo='"+uid+"'" +
            ")a where b.surBankNo =a.surBankNo and surNo='"+surNo+"' and a.mark='1'";

        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows2)throw Error("失败");


        var sqlstr3="select surName from surPlan where surNo='"+surNo+"'";

        var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);
        if(!rows3)throw Error("失败");

        var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/startQuestion.ejs', 'utf8');
        var ret={};

        ret.text = ejs.render(str,{rows,rows2});
        ret.title=rows3[0]['surName'];
        ret.rows=rows.length;
        ret.rows2=rows2;
        console.log(ret.title);


        ctx.body = ret;
        return ctx;
    });
    return co;
};
//问卷学生答案更新至数据库，修改MARK为1
_rotr.apis.stuQueAnswer = function(){
    var res={};
    var ctx = this;
    var co = $co(function* () {

        var   finalDat =JSON.parse(ctx.request.body.dat)//接收传过来的学生选择的答案内容和对应题目编号

        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');

        for(var key in finalDat){
            var testDat=finalDat[key]['testNum']
            var checkDat =finalDat[key]['checkNum']
            console.log("学生答案",testDat,checkDat)
            //学生答案存入数据库
            var sqlstr="update survey set userAnswer='"+checkDat+"',mark='1' where " +
                " surNo='"+$surNo+"' and surBankNo='"+testDat+"' and surUserNo='"+uid+"'"

            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
            if(!rows)throw Error("失败");
        }

        var res=rows['changedRows']
        console.log(res)

        ctx.body = res;
        return ctx;
    });
    return co;
};
//问卷学生答案读取显示
_rotr.apis.checkQueAnswer = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {

        for(var key in finalDat){
            var testDat=finalDat[key]['testNum']
            var checkDat =finalDat[key]['checkNum']
            console.log("学生答案",testDat,checkDat)
            //学生答案存入数据库
            var sqlstr="update survey set userAnswer='"+checkDat+"',mark='1' where " +
                " surNo='"+$surNo+"' and surBankNo='"+testDat+"' and surUserNo='"+userNo+"'"

            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
            if(!rows)throw Error("失败");
        }
        var res=rows['changedRows']
        console.log(res)

        ctx.body = res;
        return ctx;
    });
    return co;
};
//更改该学生的某个问卷为已读
_rotr.apis.delQues = function(){
    var res={}
    var ctx = this;
    var co = $co(function* () {
        var clickName = ctx.query.clickName || ctx.request.body.clickName;
        if (!clickName ) throw Error('姓名格式不合法.');

        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');

        console.log(clickName)
        var sqlstr="update survey set mark=1 where surNo="+clickName+" and surUserNo="+uid;

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        var res=rows['affectedRows']
        console.log(res)

        ctx.body = res;
        return ctx;
    });
    return co;
};

//查看试卷接口
_rotr.apis.checkPaper = function() {
    var ctx = this;
    var co = $co(function* () {
        var testPlNo = ctx.query.name || ctx.request.body.name;
        if (!testPlNo ) throw Error('姓名格式不合法.');
        var uid = ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('姓名格式不合法.');

        $examId=testPlNo;

        var sqlstr="select * from banktable where testNo in ( " +
            "select examDetBankNo from examdetail where examDetNo in (" +
            "select testPlExamNo from testplan where testPlNo='"+testPlNo+"'))"

        var sqlstr2="select testPlName from testplan where testPlNo='"+testPlNo+"'"

        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        console.log('第一个')
        var rows2=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows2)throw Error("失败");
        console.log('第2个')
        var testAnswerList=new Array(0)
        var i=0;
        var score=0;
        for(var key in rows){
            var testNo=rows[key]['testNo']
            console.log('第3个')
//学生答案
            /*var sqlstr3="select testAnswer from testdetail where testId in(" +
                "select testId from testtable where testPlNo = (" +
                "select testPlNo from testplan where testPlExamNo='"+examId+"'" +
                ")and testDetBankNo='"+testNo+"' and  testUserNo='"+uid+"') and userNo='"+uid+"'"*/
            var sqlstr3="select testAnswer from testdetail where testDetBankNo='"+testNo+"' and userNo='"+uid+"' and testId in" +
                "(select testId from testtable where testPlNo='"+testPlNo+"' and testUserNo='"+uid+"' and mark=1)"
            var rows3=yield _ctnu([_mysql.conn,'query'],sqlstr3);
            testAnswerList[i]=rows3[0]['testAnswer']
            i++;
//试卷总分
        /*    var sqlstr4="select examSetScore from examdetail where" +
                " examDetNo='"+examId+"' and examDetBankNo='"+testNo+"'"*/

            var sqlstr4="    select SUM(examSetScore) from examdetail where examDetNo = " +
                "(select testPlExamNo from testplan where testPlNo = '"+testPlNo+"')"
            var rows4=yield _ctnu([_mysql.conn,'query'],sqlstr4);
            if(!rows4)throw Error("失败");
            console.log(rows4)
            score=rows4[0]['SUM(examSetScore)']

        }
        console.log(score)
//学生总分
   /*     var sqlstr5="select testScore from testtable where testPlNo in " +
            "(select testPlNo from testplan where testPlExamNo='"+examId+"') " +
            "and testUserNo='"+uid+"' and mark='1'"*/
        var sqlstr5="select testScore from testtable where testUserNo='"+uid+"' and testPlNo='"+testPlNo+"'";
        var rows5=yield _ctnu([_mysql.conn,'query'],sqlstr5);
        if(!rows5)throw Error("失败");
        var stuCheckScore=rows5[0]['testScore']


        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");



        var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/endExam.ejs', 'utf8');

        var ret={}

        ret.text = ejs.render(str,{rows,testAnswerList});
        $examName=rows2[0]['testPlName']
        ret.title=$examName
        ret.score=score
        ret.stuCheckScore=stuCheckScore

        ctx.body = ret
        return ctx;
    });
    return co;
};


// ==================================张鼎的接口===============================================
//随机抽题创建考试
_rotr.apis.randomTest = function() {
    var success='失败'
    var user=[];
    var ctx = this;
    var data={a:'',examNo:'',plan:'',test:''};
    var userNo=ctx.query.uid || ctx.request.body.uid;
    var classNo=ctx.query.classNo || ctx.request.body.classNo;
    var planName=ctx.query.planName || ctx.request.body.planName;
    var time=ctx.query.time || ctx.request.body.time;
    var bank=ctx.query.bank || ctx.request.body.bank;
    var familyNo=ctx.query.familyNo || ctx.request.body.familyNo;
    var co = $co(function* () {
        console.log('班级编号',familyNo)
        //查询班级里面的学生
        var selectFamilyUser="select userNo from usertable where familyNo='"+familyNo+"'";
        var userResult=yield _ctnu([_mysql.conn,'query'],selectFamilyUser);
        if(!userResult)throw Error("失败");
        for(var i=0;i<userResult.length;i++){
            user[i]=userResult[i].userNo
        }
        //在examtable中插入
        var createExam="insert into examtable set examUserNo="+userNo+",addTime=now(),examClassNo="+classNo+"";
        console.log('在examtable中插入',createExam)
        //查询出创建的编号
        /*var selectExamNo ="select MAX(examNo) from examtable where examUserNo='"+userNo+"' and examClassNo='"+classNo+"';";*/
        var rows=yield _ctnu([_mysql.conn,'query'],createExam);
        if(!rows)throw Error("失败");
        data.a=rows
        data.examNo=rows.insertId;

       /* var rows2=yield _ctnu([_mysql.conn,'query'],selectExamNo);
        if(!rows2)throw Error("失败");
        data.examNo=rows2[0]['MAX(examNo)'];*/
        //在testPlan中插入
        var insertPlan="insert into testplan set testPlName='"+planName+"',testPlExamNo='"+data.examNo+"',testPlUserNo='"+userNo+"',addTime=now(),examTime='"+time+"'"
        console.log('在testPlan中插入',insertPlan)
        var plan=yield _ctnu([_mysql.conn,'query'],insertPlan);
        if(!plan)throw Error("失败");
        data.plan=plan.insertId;

        //创建考试testtable
        for (var i=0;i<user.length;i++) {
            var testtable = "insert into testtable set testPlNo='" + data.plan + "',testUserNo='"+user[i]+"';";
            var test=yield _ctnu([_mysql.conn,'query'],testtable);
            if(!test)throw Error("失败");
            data.test=test
            console.log('创建考试testtable',testtable)
        }
        //在考试中添加试题
        for (var key in bank) {

            //把题号插入到对应的考试中()
            var insertExam = "insert into examdetail set examDetNo='" + data.examNo + "',examDetBankNo='" + bank[key][1] + "',examSetScore=5.0";
            var insertExamTable = yield _ctnu([_mysql.conn, 'query'], insertExam);
            if (!insertExamTable)throw Error('任务失败');
            // console.log("羊羊羊", data)
            success='创建成功'
        }
        // console.log("杨玉玲",data)
        ctx.body = success;
        return ctx;
    });

    return co
};

//插入数据库
_rotr.apis.insertData = function () {
    var ctx = this;
    var co = $co(function * () {
        var res = yield _fns.getMessage(ctx);
        //返回结果
        ctx.body = res;
        return ctx;
    });
    return co;

};

/*_rotr.apis.insertData = function() {
    var ctx = this;
    var co = $co(function* () {
        /!*select userDeptNo from usertable where userNo=39*!/
        // var res = yield _fns.getMessage(ctx);
        // var uid = yield _fns.getUid(ctx);
        var userData=yield _fns.getMessage(ctx);
        console.log('张鼎123',userData);
        // var uid=ctx.query.uid || ctx.request.body.uid;
       /!* if (!uid ) throw Error('ID格式不合法.');
        var sqlstr="select userDeptNo from usertable where userNo='"+uid+"'";
        console.log(sqlstr)
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");*!/

        ctx.body = userData;
        return ctx;
    });
    return co
};*/
//查询用户身份

_rotr.apis.selectDept = function() {
    var ctx = this;
    var co = $co(function* () {
        /*select userDeptNo from usertable where userNo=39*/
        var uid = yield _fns.getUid(ctx);
        console.log(uid);
        // var uid=ctx.query.uid || ctx.request.body.uid;
        if (!uid ) throw Error('ID格式不合法.');
        var sqlstr="select userDeptNo from usertable where userNo='"+uid+"'";
        console.log(sqlstr)
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        ctx.body = rows;
        return ctx;
    });
    return co
};
//创建考试
_rotr.apis.createTest = function() {
    var ctx = this;
    var user=[];

    var success='失败'
    var data={a:'',examNo:'',plan:'',test:'',bankNo:''};

  /*  var userNo=ctx.query.uid || ctx.request.body.uid;*/
    var classNo=ctx.query.classNo || ctx.request.body.classNo;
    var planName=ctx.query.planName || ctx.request.body.planName;
    var time=ctx.query.time || ctx.request.body.time;
    var bank=ctx.query.bank || ctx.request.body.bank;
    var familyNo=ctx.query.familyNo || ctx.request.body.familyNo;

    var co = $co(function* () {
        var uid = yield _fns.getUid(ctx);
        //查询班级里面的学生
        var selectFamilyUser="select userNo from usertable where familyNo='"+familyNo+"'";
        var userResult=yield _ctnu([_mysql.conn,'query'],selectFamilyUser);
        if(!userResult)throw Error("失败");
        console.log('查询班级的学生',userResult)
        for(var i=0;i<userResult.length;i++){
            user[i]=userResult[i]['userNo']
        }
        console.log('userNo',user)
        //在examtable中插入
        var createExam="insert into examtable set examUserNo="+uid+",addTime=now(),examClassNo="+classNo+"";

        //查询出创建的编号
        /*var selectExamNo ="select MAX(examNo) from examtable where examUserNo='"+uid+"' and examClassNo='"+classNo+"';";*/
        var rows=yield _ctnu([_mysql.conn,'query'],createExam);
        if(!rows)throw Error("失败");
        console.log('在examTable中的操作',rows)
        data.examNo=rows.insertId;
        data.a=rows


   /*     var rows2=yield _ctnu([_mysql.conn,'query'],selectExamNo);
        if(!rows2)throw Error("失败");*/
        console.log('examNo',data.examNo)
        //在testPlan中插入
        var insertPlan="insert into testplan set testPlName='"+planName+"',testPlExamNo='"+data.examNo+"',testPlUserNo='"+uid+"',addTime=now(),examTime='"+time+"'"
        var plan=yield _ctnu([_mysql.conn,'query'],insertPlan);
        if(!plan)throw Error("失败");
        data.plan=plan.insertId;
        console.log('在testPlan中插入',plan)

        //创建考试testtable
        for (var i=0;i<user.length;i++) {
            var testtable = "insert into testtable set testPlNo='" + data.plan + "',testUserNo='"+user[i]+"';";
            var test=yield _ctnu([_mysql.conn,'query'],testtable);
            if(!test)throw Error("失败");
            data.test=test
        }
        //在题库中添加试题
        for (var key in bank) {

            var bankInsert = "insert into banktable set testClaNo='" + classNo + "',testContent='" + bank[key][0] + "',answer='" + bank[key][5] + "'," +
                "optionA='" + bank[key][1] + "',optionB='" + bank[key][2] + "',optionC='" + bank[key][3] + "',optionD='" + bank[key][4] + "',testUserNo='" + uid + "'";
            var insertBank = yield _ctnu([_mysql.conn, 'query'], bankInsert);
            if (!insertBank)throw Error("失败");
            data.bankNo = insertBank.insertId;
            //把插入的题号插入到对应的考试中()
            var insertExam = "insert into examdetail set examDetNo='" + data.examNo + "',examDetBankNo='" + data.bankNo + "',examSetScore=5.0";
            var insertExamTable = yield _ctnu([_mysql.conn, 'query'], insertExam);
            if (!insertExamTable)throw Error('任务失败');
            // console.log("bilibilibilibili", data)
            success='创建成功'
        }
         console.log("iiiiiiii",data)
        ctx.body = success;
        return ctx;
    });

    return co
};

//创建问卷调查
_rotr.apis.createSurvey = function() {
    var ctx = this;
    var co = $co(function* () {
        user=[];
        var success='失败'
        var data={planNo:'',bankNo:'',survey:''};
        var surveyName=ctx.query.surName || ctx.request.body.surName;
        var bank=ctx.query.bank || ctx.request.body.bank;
        /*var userNo=ctx.query.uid || ctx.request.body.uid;*/
        var uid = yield _fns.getUid(ctx);
        var familyNo=ctx.query.familyNo || ctx.request.body.familyNo;
        //查询班级里面的学生
        var selectFamilyUser="select userNo from usertable where familyNo='"+familyNo+"'";
        var userResult=yield _ctnu([_mysql.conn,'query'],selectFamilyUser);
        if(!userResult)throw Error("失败");
        for(var i=0;i<userResult.length;i++){
            user[i]=userResult[i].userNo
        }
        var insertPlan="insert into surPlan set surName='"+surveyName+"'," +
            "surPlUserNo='"+uid+"',addTime=now()";
        var insertPl=yield _ctnu([_mysql.conn,'query'],insertPlan);
        if(!insertPl)throw Error("失败");
        data.planNo=insertPl.insertId;
        //插入调查的题库
        for (var key in bank){
            var insertBank = "insert into surveyBank set surContent='"+bank[key][0]+"',surUserNo='"+uid+"'," +
                "optionA='"+bank[key][1]+"',optionB='"+bank[key][2]+"',optionC='"+bank[key][3]+"',addTime=now()";
            var insertBa=yield _ctnu([_mysql.conn,'query'],insertBank);
            data.bankNo=insertBa.insertId;
            for(var k=0;k<user.length;k++) {
                var insertSurvey = "insert into survey set surNo='"+data.planNo+"',surBankNo='"+data.bankNo+"',surUserNo='"+user[k]+"'";
                var insertSu=yield _ctnu([_mysql.conn,'query'],insertSurvey);
                data.survey=insertSu;
                success='成功'
            }
        };
        // console.log("zdzdzdzdzdzdzddz",data)
        ctx.body = success;
        return ctx;
    });
    return co
};
//批量导入题库
_rotr.apis.insertBank = function() {
    var ctx = this;
       /*  var userNo=ctx.query.uid || ctx.request.body.uid;*/


    // console.log(bank)
    var co = $co(function* () {
        var bank=ctx.query.bank || ctx.request.body.bank;
        var classNo=ctx.query.classNo || ctx.request.body.classNo;
        var uid = yield _fns.getUid(ctx);
        var success='导入失败'
        for (var key in bank) {
            var bankInsert = "insert into banktable set testClaNo='" + classNo + "',testContent='" + bank[key][0] + "',answer='" + bank[key][5] + "'," +
                "optionA='" + bank[key][1] + "',optionB='" + bank[key][2] + "',optionC='" + bank[key][3] + "',optionD='" + bank[key][4] + "',testUserNo='" + uid + "'";
             insertBank1 = yield _ctnu([_mysql.conn, 'query'], bankInsert);
            if (!insertBank1)throw Error("失败");
            success='导入成功'
        }

        ctx.body = success;
        return ctx;

    });

    return co
};
//查询班级
_rotr.apis.family = function() {
    var ctx = this;
    var co = $co(function* () {
        /*select userDeptNo from usertable where userNo=39*/
        var userNo=39;
        var sqlstr="select * from familytable";
        /*console.log(sqlstr)*/
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        ctx.body = rows;
        return ctx;
    });
    return co
};
//个人信息接口
_rotr.apis.perMessage = function() {
    var ctx = this;
    var co = $co(function* () {

        /*var userNo=ctx.query.uid || ctx.request.body.uid;*/
        var uid = yield _fns.getUid(ctx);
        var sqlstr="select * from usertable where userNo='"+uid+"'";
       /* console.log(sqlstr)*/
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
      /*  if(rows[0].avatar==null){
            rows[0].avatar='images/userAvatar.png'
        }*/
        ctx.body = rows;
     /*   console.log('个人信息接口的查询结果',rows)*/
        return ctx;
    });
    return co
};
//修改个人信息
_rotr.apis.updatePer = function() {
    var ctx = this;
    var co = $co(function* () {
        /*userNo:$("#userNo").val(),
         userName:$('#userName').val(),
         IdCardNo:$('#IdCardNo').val(),
         userDeptNo:$('#userDeptNo').val(),
         telNo:$('#telNo').val(),
         college:$("#college").val(),
         sign:$('#sign').val(),
         introduce:$('#introduce').val(),
         twitter:$('#twitter').val(),
         QQ:$('#QQ').val(),
         wechat:$('#wechat').val()*/
       /* var userNo=ctx.query.uid || ctx.request.body.uid;*/
        var uid = yield _fns.getUid(ctx);
        var userName = ctx.query.userName || ctx.request.body.userName;
        var IdCardNo = ctx.query.IdCardNo || ctx.request.body.IdCardNo;
        /*var userDeptNo = ctx.query.userDeptNo || ctx.request.body.userDeptNo;*/
        var telNo = ctx.query.telNo || ctx.request.body.telNo;
        var college = ctx.query.college || ctx.request.body.college;
        var sign = ctx.query.sign || ctx.request.body.sign;
        var introduce = ctx.query.introduce || ctx.request.body.introduce;
        var twitter = ctx.query.twitter || ctx.request.body.twitter;
        var QQ = ctx.query.QQ || ctx.request.body.QQ;
        var sex  = ctx.query.sex || ctx.request.body.sex;
        var wechat = ctx.query.wechat || ctx.request.body.wechat;

        var regResult;

        var sqlstr="update usertable set userName='"+userName+"',IdCardNo='"+IdCardNo+"',telNo='"+telNo+"',"+
            "college='"+college+"',sign='"+sign+"',introduce='"+introduce+"',twitter='"+twitter+"',QQ='"+QQ+"',wechat='"+wechat+"',sex='"+sex+"' where userNo='"+uid+"'";
       /* console.log('修改信息',sqlstr)*/
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }
        var res=(regResult)
        ctx.body = res
        return ctx;
    });
    return co
};
//修改密码
_rotr.apis.updatePwd = function() {
    var ctx = this;
    var co = $co(function* () {
        /*userNo:$("#userNo").val(),
         userName:$('#userName').val(),
         IdCardNo:$('#IdCardNo').val(),
         userDeptNo:$('#userDeptNo').val(),
         telNo:$('#telNo').val(),
         college:$("#college").val(),
         sign:$('#sign').val(),
         introduce:$('#introduce').val(),
         twitter:$('#twitter').val(),
         QQ:$('#QQ').val(),
         wechat:$('#wechat').val()*/
        var pws = ctx.query.pwd || ctx.request.body.pwd;
        var uid = yield _fns.getUid(ctx);
        var regResult;

        var sqlstr="update usertable set userPwd=MD5('"+pws+"') where userNo='"+uid+"'"

    /*    console.log(sqlstr)*/
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        };
       /* console.log(regResult)*/

        ctx.body = regResult
        return ctx;
    });
    return co
};
//显示头像
_rotr.apis.perPhoto = function() {
    var ctx = this;
    var co = $co(function* () {
        var uid = yield _fns.getUid(ctx);
        var sqlstr="select avatar from usertable where userNo='"+uid+"'";
      //  console.log(sqlstr)
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败")
        ctx.body = rows;
        return ctx;
    });
    return co
};
//修改头像
_rotr.apis.updatePhoto = function() {
    var ctx = this;
    var co = $co(function* () {
        var phUrl = ctx.query.myAvatar || ctx.request.body.myAvatar;
        /*var userNo=ctx.query.uid || ctx.request.body.uid;*/
        var uid = yield _fns.getUid(ctx);
        //console.log("后台",phUrl)
        var regResult;

        if (phUrl==undefined){
            return
        }else{
            var sqlstr="update usertable set avatar='"+phUrl+"' where userNo='"+uid+"'"
        }
     //   console.log(sqlstr)
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }
        ctx.body = regResult
        return ctx;
    });
    return co
};

//==============================写接口写在下面的位置，备注好名称和作用========================================================
//不知道的接口
_rotr.apis.addshijuan = function(){
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select * from testplan";
        var rows=_ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        var ejs = require('ejs'),
            str =$fs.readFileSync(__dirname + '/../web/addshijuan.ejs', 'utf8');
        var ret = ejs.render(str,rows);
        ctx.body = ret;
        return ctx;
    });
    return co;
};

//下载接口
_rotr.apis.xiazai1 = function() {
    var ctx = this;
    var co = $co(function* () {
        //var testClaNo= ctx.query.testNo || ctx.request.body.testNo;
        var regResult;
        var sqlstr="select testContent,testUserNo,optionA,optionB,optionC,optionD,answer from banktable into outfile 'd:/test1.csv' fields terminated by ',' optionally enclosed by '"+'"'+"' escaped by '"+'"'+"' lines terminated by '\r\n'";
       // console.log(sqlstr);
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }
        var res=(regResult);
        ctx.body = res;
        return ctx;
    });
    return co;
};
//课程类型 
 _rotr.apis.courseType = function() { 
     var res={}; 
     var ctx = this; 
     var co = $co(function* () { 
 
         var sqlstr="select className from classtable"; 
         var dat={}; 
         var rows=yield _ctnu([_mysql.conn,'query'],sqlstr); 
         if(!rows)throw Error("失败"); 
       //  console.log(rows);
         dat= rows; 
         ctx.body = dat; 
         return ctx; 
     }); 
     return co; 
 }; 
 _rotr.apis.Type = function() {//级联列表关联 
     var res={}; 
     var ctx = this; 
     var name = ctx.query.name || ctx.request.body.name; 
     var co = $co(function* () { 
	var sqlstr="select classNo from classtable where className='"+name+" '";
        // var sqlstr="select VideoclassName from videoclass where ClassId=" + 
        //     "(select ClassId from class where ClassName='"+name+"')"; 
         var dat={}; 
         var rows=yield _ctnu([_mysql.conn,'query'],sqlstr); 
         if(!rows)throw Error("失败"); 
 
 
         dat= rows; 
         //console.log(name); 
       //  console.log(dat);
         ctx.body = dat; 
         return ctx; 
     }); 
     return co; 
 }; 
_rotr.apis.tiku = function() {
    var res={};
    var ctx = this;
    var co = $co(function* () {

        var sqlstr="select className,classNo from classtable";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
      //  console.log(rows);
        dat= rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};
module.exports = _rotr;

