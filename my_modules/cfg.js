/*所有设置参数
必须在app文件夹外面有合法的xcfg.json用以保存私密参数
xcfg文件json的读写功能
*/

var _cfg = {};

//全局app路径
global.__path = $path.dirname(require.main.filename);
global.__domain = 'http://m.xmgc360.com/';
global.__home = 'http://m.xmgc360.com/pie/';

//全局错误代码
var __errCode = global.__errCode = {
    APIERR: 8788, //API接口异常，未知错误
    NOTFOUND: 4312, //找不到目标
};

//正则表达式
_cfg.regx = {
    phone: /^1\d{10}$/,
    phoneCode: /^\d{6}$/,
    pw: /^[0-9a-zA-Z]{32}$/, //md5之后的格式
    nick: /^[a-zA-Z\u0391-\uFFE5]+[0-9a-zA-Z\u0391-\uFFE5\.]{2,17}$/, //昵称，非数字开头3~18位
    color: /^#[a-fA-F0-9]{6}$/, //颜色值，#开头十六进制
    icon: /^fa-[\w-]{1,32}$/, //fa图标值
    ukey: /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/, //user.ukey的格式
    fileName: /^[0-9a-zA-Z\u0391-\uFFE5]+\.(js|css|html|json|txt)$/, //文件名，中英文数字加点加2~4位字母数字
    crossDomains: /^\w*\.?\w*\.?xmgc360\.com$/, //接收跨域的请求
    appName: /^[a-zA-Z]+[0-9a-zA-Z]{2,31}$/, //app名称格式，非数字开头3~31位
    appAlias: /^[a-zA-Z\u0391-\uFFE5]+[0-9a-zA-Z\u0391-\uFFE5]{2,17}$/, //app别名，非数字开头3~18位
    avatar: /^http:\/\/[\s\S]{0,1024}$/, //用户头像，标准http格式才行
};



//各种长度持续时间(秒)
_cfg.dur = {
    phoneCode: 3600, //手机验证号码过期时间1小时
    browserUkey: 365 * 24 * 60 * 60 * 1000, //浏览器端m_ukey存放1年
};



//导出模块
module.exports = _cfg;
