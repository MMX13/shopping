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
router.get('/items', (req, res)=>{
	items = mydb.collection('items').find().toArray((err, arr)=>{
		res.send(arr)	
	})	
})
router.get('/items/:item', (req, res)=>{
	mydb.collection('items').findOne({"name":req.params.item}, (err, item)=>{
		if(!item){
			res.sendStatus(404)
		}
		else{
			res.send(item)			
		}
	})
})
router.post('/items', (req, res)=>{
	console.log(req.body)
	delete(req.body._id)
	mydb.collection('items').update({"name": req.body.name}, req.body, {upsert: true})
	res.sendStatus(201)
})
router.delete('/items/:item', (req, res)=>{
	mydb.collection('items').remove({"name":req.params.item})
	res.sendStatus(200)
})

router.get('/meals', (req, res)=>{
	mydb.collection('meals').find().toArray((err, arr)=>{
		res.send(arr)
	})
})
router.get('/meals/:meal', (req, res)=>{
	mydb.collection('meals').findOne({"mealname": req.params.meal}, (err, item)=>{
		if(item){
			res.send(item)
		} else {
			sendStatus(404)
		}
	})
})
router.post('/meals', (req, res)=>{
	mydb.collection('meals').findOne({"mealname": req.body.mealname}, (err, item)=>{
		if(item){
			res.sendStatus(400)
		} else {
			mydb.collection('meals').insertOne(req.body)
			res.sendStatus(201)
		}
	})
})
router.put('/meals', (req, res)=>{
	mydb.collection('meals').update({"mealname": req.body.mealname}, req.body)
	res.sendStatus(200)
})
router.delete('/meals/:meal', (req, res)=>{
	mydb.collection('meals').remove({"mealname": req.params.meal})
	res.sendStatus(200)
})
app.use('/api', router)

app.get(/\/$/, (req, res)=>{
	res.sendFile(__dirname+'/index.html')
})
app.use(express.static(__dirname+'/'))
app.listen(8080);