//mysql db connection by using promise
const db_conn  = require('./async_connect_db.js');

const express = require('express');
// const port = process.env.port || 8080;
const port = 8080;
const app = express();

//enable json output
app.use(express.json());

//get
app.use('/Image', express.static('Image'));

async function getAllFoodData(){
	let sql = 'SELECT id, name, type, price, photo FROM foodtable ORDER BY id';
	let result = await db_conn.execute_query(sql);
	return result;
}

app.get('/', async function(req, res) {
	console.log('A client get food data');
	res.json(await getAllFoodData());
});


async function getLatestOrderId(){
	console.log('A client get table: foodorder - latest order id');
 	let sql = 'SELECT orderId FROM foodorder WHERE id = (SELECT max(id) FROM foodorder)';
	let result = await db_conn.execute_query(sql);
	//if it is no record
	if(result.length === 0){
		return -1;
	}
	return result[0].orderId;
}


//post
async function addNewRow(data){
	var latest_order_id = await getLatestOrderId();
	var order_id = latest_order_id + 1;

	console.log('new order id ' + order_id);

	let sql = 'INSERT INTO foodorder(foodId, price, qty ,orderId, date) VALUES(?, ?, ?, ?, ? )';
	let query = db_conn.mysql.format(sql, [data.id, data.price, data.quantity, order_id, new Date()]);

	console.log('executed sql: ' + query);
	db_conn.execute_query(query);
	console.log('Inserted food id ' + data.id + ' order id: ' + order_id);
}

app.post('/add', async function(req, res) {
	console.log('A client called add!');
	let data = req.body;
	console.table(data);
	for(let i= 0; i < data.length; i++){
		await addNewRow(data[i]);
	}
	res.json({result: 'OK'});
});

//display port number
app.listen(port, () => console.log(`Listening on port ${port}...`));