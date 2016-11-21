// 路径配置
require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});

var uid;
$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
    }
});
var newId = window.location.search.substring(4);
console.log(newId);
var dat={
    newId:newId
}
// console.log(dat)

var paper = angular.module('paper', ['ui.bootstrap']);
paper.config(function($controllerProvider) {
    paper.controller = $controllerProvider.register;
});
paper.run(function($rootScope) {});

paper.controller('adminAllExam', function($scope) {

    $.post('../api/ManageScore',dat,function (res) {

        console.log(uid);
        $scope.$apply(function () {
            if(res.rows.length==0){

                var obj={
                    testScore:'暂无',
                    userName:'暂无'
                }
                res.rows.push(obj)
            }
            $scope.rows=res.rows;
            $scope.examName=res.rows2[0]['testPlName'];
            $scope.count=res.rows3[0]['count(*)']*5;
            console.log( res.rows);
            $scope.a=0;
            $scope.b=0;
            $scope.c=0;

            for(var i=0;i<res.rows.length;i++){
                var score=res.rows[i].testScore;
                var compare=(score/$scope.count).toFixed(4);
                // console.log(compare)
                if(compare<0.6){$scope.a+=1;}
                else if(0.6<=compare<0.8){$scope.b+=1;}
                else if(0.8<=compare<=1){$scope.c+=1;}

            }
            // console.log($scope.a+'分数60以上'+$scope.b+'分数80以上'+$scope.c)

            require(
                [
                    'echarts',
                    'echarts/chart/bar',// 使用柱状图就加载bar模块，按需加载
                    'echarts/chart/pie',// 使用柱状图就加载bar模块，按需加载
                    'echarts/chart/funnel',// 使用柱状图就加载bar模块，按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    var myChart = ec.init(document.getElementById('main'));

                    var option =  {
                        title : {
                            text:$scope.examName,
                            subtext: '考试名称',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient : 'vertical',
                            x : 'left',
                            data:['成绩低于总分60%','成绩在总分60%和80%之间','成绩在总分80%和100%之间']
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {
                                    show: true,
                                    type: ['pie', 'funnel'],
                                    option: {
                                        funnel: {
                                            x: '25%',
                                            width: '50%',
                                            funnelAlign: 'left',
                                            max: 1548
                                        }
                                    }
                                },
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        series : [
                            {
                                name:'访问来源',
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:[
                                    {value:$scope.a, name:'成绩低于总分60%'},
                                    {value:$scope.b, name:'成绩在总分60%和80%之间'},
                                    {value:$scope.c, name:'成绩在总分80%和100%之间'},
                                ]
                            }
                        ]
                    };


                    // 为echarts对象加载数据
                    myChart.setOption(option);
                }
            );

        })

    })

});