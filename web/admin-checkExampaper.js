var newId = window.location.search.substring(4);
console.log(newId);
var dat={
    newId:newId
}
var uid;
$.post('../api/cookie',function(retCoo) {
    if (retCoo.code == 8788) {
        window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
    }
    else{
        uid=retCoo.data.uid;
    }
});

var paper = angular.module('paper', ['ui.bootstrap']);
paper.config(function($controllerProvider) {
    paper.controller = $controllerProvider.register;
});
paper.run(function($rootScope) {});

    paper.controller('adminAllExampaper', function($scope) {

        $.post('../api/ManageExamPaper',dat,function (res) {

            console.log(uid)
            $scope.$apply(function () {
                $scope.rows=res.rows;
                $scope.rows2=res.rows2[0]['testPlName'];
                // console.log($scope.rows)
            })

        })

    });

