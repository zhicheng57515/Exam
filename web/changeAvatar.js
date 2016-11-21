/**
 * Created by 张鼎 on 2016/10/13.
 */
var avatar = function(){
    var api = 'http://m.xmgc360.com/start/api/getMyInfo';
    $.get(api, function(res) {
        var dat= {
            uid: res.data.id,
          /*  avatar:res.data.avatar*/
        }
        $.post('../api/updatePhoto',dat,function(res){
            /*console.log("dat:",res);*/
            var avatar = res[0].avatar;
            var nick=res[0].mebName;
            console.log("dat:",avatar);
            console.log("dat:",nick);

            console.log(avatar);
            //var stl = $('#avatar');
            $("#avatar").attr("src",avatar)
           /* $("#nick").html(nick);*/
        })
    })
}
/*avatar();*/


$('#changePhoto').click(function () {
    /*console.log("修改头像的输出：")*/
    _fns.uploadFile('avatar', $('#changePhoto'), function (f) {
    }, function (f) {
    }, function (f) {
    }, function (f) {
    }, function (f) {
    }, function (f) {
        var api = 'http://m.xmgc360.com/start/api/getMyInfo';
        $.get(api, function(res) {
            var dattt= {
                myAvatar:f.url
            };
         /*   console.log("dat:",res);
            console.log("datrtrt:",dattt);
*/
            $.post('../api/updatePhoto',dattt,function(res){
              /*  window.location.href='http://m.xmgc360.com/exam/web/'*/
                window.location.reload();
            })
        });
    })
})

/*
function aaa() {
    console.log("修改头像的输出：")
    _fns.uploadFile('avatar', $('#photo'), function (f) {
        console.log('>>>before:', f);
    }, function (f) {
        console.log('>>>process:', f);
    }, function (f) {
        console.log('>>>success:', f);
    }, function (f) {
        console.log('>>>abort:', f);
    }, function (f) {
        console.log('>>>error:', f);
    }, function (f) {
        console.log('>>>complete:', f);
        console.log('图片路径:',f.url)
        var api = 'http://m.xmgc360.com/start/api/getMyInfo';
        $.get(api, function(res) {
            var dattt= {
                myAvatar:f.url
            };
            console.log("dat:",res);
            console.log("datrtrt:",dattt);

            $.post('../api/updatePhoto',dattt,function(res){
                console.log("zhangdingss",dattt)
                console.log(dattt.myAvatar)
                console.log("成功！")
                window.location.reload();
            })
        });
    })
}*/
