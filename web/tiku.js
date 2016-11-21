var uid;
$.post('../api/cookie',function(retCoo) {
	if (retCoo.code == 8788) {
		window.location.href = "http://m.xmgc360.com/start/web/account/?page=acc_login"
	}
	else{
		uid=retCoo.data.uid;
	}
});
app.controller('tiku', function($scope) {
	$.post("../api/ManageClass", function (dat) {
		console.log(dat)
		$scope.$apply(function () {
			$scope.myinfo = dat;
		});
	})
});

function practice(){
	$('body').click(function (evt) {
		if(!e){
			var e = window.event || evt;
		}
		var targ = e.target;
		var tname = targ.id;
		var checkClass=tname.split('-')[0]
		var dat={
			checkClass:checkClass
		}
		console.log(dat)
		$.post('../api/ManageCount',dat,function (res) {
			var classNum=res[0]['count(*)'];
			if(classNum==0){
				alert('您选择的科目在题库中暂时没有题目，请重新选择')
			}
			else{
				window.location.href='tiku-practice.html?name='+tname
			}
		})
	});



};