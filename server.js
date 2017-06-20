/**
 * Created by sudipta.c.das on 6/18/2017.
 */

var express = require('express');
var firebase = require("firebase-admin");
var bodyParser = require('body-parser');
var category = require('./category/categoryList');
var uploadDocument = require('./upload/upload.js');

var app = express();
var router = express.Router();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

var serviceAccount = require("./Witty-App-ServiceAccount.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://witty-app.firebaseio.com/"
});

var db = firebase.database();

router.route('/category')
    .get(function (req, res) {
        category.wittyAppCategory(res, db);
    });

router.route('/upload')
    .post(function (req, res) {
        uploadDocument.uploadDocument(req, res);
    });


app.use('/api', router);

app.use(function(req, res) {
    res.status(404).send("Not Found");
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
console.log("Running on port " + server_port + "....");