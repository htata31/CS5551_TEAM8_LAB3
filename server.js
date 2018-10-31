var cors = require('cors');
var request= require('request');
var requestclient= require('request-json');
var express = require('express');
var bodyParser=require('body-parser');
const nodemailer  = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');
var path=require("path");
var MongoClient = require('mongodb').MongoClient;
var client = requestclient.createClient('http://127.0.0.1:8080/');

var app = express();

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var url = 'mongodb://htata31:tata1994@ds135993.mlab.com:35993/htata';
var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth:{

            xoauth2:xoauth2.createXOAuth2Generator({
                user: 'saranakkiraj23@gmail.com',
                clientId: '621348341638-s2t4chhegtfbb8ienss816lu212n0105.apps.googleusercontent.com',
                clientSecret: 'PCYERMiD0XKvu98jE3jjW_SM',
                refreshToken:'1/Qib0XS2ysWWDXrzyjRopOSkuLSlaqv6VjYKtE6y8wLg'
            })
        }
    }
));

app.post('/update', function (req, res) {

    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var db= client.db('htata');

        db.collection('demoase').updateMany(
            { "username": req.body.username },
            {
                $set: { 'firstname': req.body.firstname, "lastname": req.body.lastname,"number":req.body.number }

            }
        ).then(function(err, result) {
            if (err) throw err;
            client.close();
        });


    });
})

app.post('/delete', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log(searchKeywords);
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client,callback) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var db= client.db('htata');

        db.collection('demoase').deleteOne({ "username": searchKeywords }).then(function(err, result) {
            //if (err) throw err;

            res.send("Account Succesfully deleted");
            client.close();

            //callback();
        });
    });
})

//To fetch the documents from the data base
app.get('/getDataSignIn', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
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
app.get('/getDataRegister', function (req, res) {
    var searchKeywords = req.query.keywords;
    //console.log("Param are "+searchKeywords);
    //console.log("email "+searchKeywords.substr(0,searchKeywords.indexOf('**')));
    //console.log("username "+searchKeywords.substr(searchKeywords.indexOf('**')+2,searchKeywords.length));
    var uname=searchKeywords.substr(searchKeywords.indexOf('**')+2,searchKeywords.length);
    var email=searchKeywords.substr(0,searchKeywords.indexOf('**'));
     console.log("email "+email);
     console.log("username "+uname);
    MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var db = client.db("htata");
        var query = { $or: [ { email: email },  { username:uname } ]};
        db.collection("demoase").find(query).toArray(function(err, result) {
            if (err) throw err;
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
        var mailOptions = {
            from: 'saranakkiraj23@gmail.com',
            to:req.body.email,
            subject: 'Welcome User!!!',
            text: 'You have been succesfully Registered'
        }

        transporter.sendMail(mailOptions, function (err, res) {
            if(err)
            {
                console.log(err);

            }
            else
            {
                console.log('Email is Sent');
            }

        })
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });

    });
})

app.get('/getAPIData', function (req, res) {
    var interestValue="";
    var searchKeywords = req.query.searchkey;
    var interest=searchKeywords.substr(searchKeywords.indexOf('**')+2,searchKeywords.length).toLowerCase();;
    var destination=searchKeywords.substr(0,searchKeywords.indexOf('**'));
    console.log(interest);
    switch(interest.toString())
    {
        case "select":
            interestValue="";
            break;
        case "museum":
            Setinterest("museum");
            break;
        case "devotional":
            console.log("I am here");
            Setinterest("hindu_temple");
            break;
        case "adventure":
            Setinterest("amusement_park");
            break;
        case "scenic":
            Setinterest("park");
            break;
        case "party":
            Setinterest("night_club");
            break;

    }

    function Setinterest(interest)
    {
        console.log(interest);
        interestValue ="&type="+interest;
        console.log("I am here too");
        console.log(interestValue);
    }
    console.log("destination "+destination);
    console.log("interest "+interestValue);
    client.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+destination+"+point+of+interest"+interestValue+"&language=en&key=AIzaSyAk8FdCcWPekxegcpFkUAL5frrMc73F-4E", function (error, response, body) {
        res.send(body);
    });

});

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

