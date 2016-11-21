var newId = window.location.search.substring(4);
console.log(newId);
var dat={
    newId:newId
}


var Quepaper = angular.module('Quepaper', ['ui.bootstrap']);
Quepaper.config(function($controllerProvider) {
    Quepaper.controller = $controllerProvider.register;
});
Quepaper.run(function($rootScope) {});

Quepaper.controller('adminAllQuepaper', function($scope) {
    $.post('../api/cookie',function(retCoo) {
        if (retCoo.code == 8788) {
            window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
        }
    });
    $.post('../api/ManageQuePaper',dat,function (res) {

        $scope.$apply(function () {
            $scope.rows=res.rows
            $scope.rows2=res.rows2[0]['surName']
            // console.log($scope.rows)
        })

    })

});

