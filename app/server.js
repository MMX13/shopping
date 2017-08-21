var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/shopping'

var mydb
MongoClient.connect(url, (err, db)=>{
	mydb = db
})

var router = express.Router();
router.get('/', (req, res)=>{
	res.json({message: 'Welcome to the api!'})
})
router.get('/item', (req, res)=>{
	items = mydb.collection('items').find().toArray((err, arr)=>{
		res.send(arr)	
	})	
})
router.post('/item', (req, res)=>{
	console.log(req.body)
	item = {
		"name": req.body.name,
		"category": req.body.category
	}
	mydb.collection('items').insertOne(item)
	res.sendStatus(200)
})
app.use('/api', router)

app.get('/', (req, res)=>{
	res.sendFile(__dirname+'/index.html')
})
app.use(express.static(__dirname+'/'))
app.listen(8080);