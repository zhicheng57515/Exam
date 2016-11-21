/**
 * Created by yyl15 on 2016/9/6.
 */
/**
 * Created by 13275 on 2016/9/2.
 */

var _mysql ={};

var conn =_mysql.conn = $mysql.createConnection({
    host:"182.254.133.190",
    user:"user1",
    password:"@Aa@123456",
    database:"examdb"
});
conn.connect();

module.exports = _mysql;

