const mysql = require('mysql');
//just for demo. Please encrypt your password before saving
const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'foodt',
    debug    :  false
});

let execute_query = function(sql, values) {
	return new Promise((resolve,reject) => {
	  pool.getConnection(function(err, conn) {
		if (err) {
		  reject(err);
		} else {
			conn.query(sql, values, (err,rows) => {
  
			if (err) {
			  reject(err);
			} else {
			  resolve(rows);
			}
			conn.release();
		  })
		}
	  })
	})
}

// module.exports.execute_query = execute_query;
// module.exports.mysql = mysql
module.exports = { execute_query, mysql }