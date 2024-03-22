//create web server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/comments', function(req, res){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('Error: ', err);
            res.send('Error connecting to database');
        }else{
            var collection = db.collection('comments');
            collection.find({}).toArray(function(err, result){
                if(err){
                    res.send('Error fetching comments');
                }else{
                    res.send(result);
                }
                db.close();
            });
        }
    });
});

app.post('/comments', function(req, res){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('Error: ', err);
            res.send('Error connecting to database');
        }else{
            var collection = db.collection('comments');
            collection.insertOne(req.body, function(err, result){
                if(err){
                    res.send('Error inserting comment');
                }else{
                    res.send('Comment inserted');
                }
                db.close();
            });
        }
    });
});

app.listen(3000, function(){
    console.log('Server listening on port 3000');
});