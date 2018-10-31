var cors = require('cors');
var request= require('request');
var express = require('express');
var bodyParser=require('body-parser');
var path=require("path");
var MongoClient = require('mongodb').MongoClient;

var app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var url = 'mongodb://htata31:tata1994@ds135993.mlab.com:35993/htata';


// app.get('/', function(req, res) {
//     res.render('LoginPage');
// })

app.post('/update', function (req, res) {
    var searchKeywords = req.query.keywords;
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var db= client.db('htata');
        var query = { username: searchKeywords };
        db.collection("demoase").updateOne(searchKeywords)(req.body,function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            $set: { 'size.uom': 'cm', status: 'P' },
            client.close();
        });

    });
})

//To fetch the documents from the data base
app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var db = client.db("htata");
        var query = { username: searchKeywords };
        db.collection("demoase").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            client.close();
            res.json(result);
        });
    });
});

//Saving the data into database when the user is registering
app.post('/enroll', function (req, res) {
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var db= client.db('htata');
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });

    });
})

//To insert an document in to the data base
var insertDocument = function(db, data, callback) {
    db.collection('demoase').insertOne( data, function(err, result) {
        if(err)
        {
            //res.write("Registration Failed, Error While Registering");
            //res.end();
        }
        console.log("Inserted a document into the asedemo collection.");
        callback();
    });
};

//Requiired for managing angular routes without server routes
app.all('*', function(req, res) {
    res.sendFile(path.join(__dirname , 'public/LoginPage.html'));
})

app.listen(port, function() {
	console.log('app running')
})

