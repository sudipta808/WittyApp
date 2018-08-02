/**
 * Created by sudipta.c.das on 6/18/2017.
 */

var express = require('express');
var firebase = require("firebase-admin");
var bodyParser = require('body-parser');
var authorization = require('./authorization/signin');
var category = require('./category/categoryList');
var uploadDocument = require('./upload/upload.js');
var fetchData = require('./getData/getFilterData.js');

var app = express();
var router = express.Router();
app.use('/api', router);

router.use(express.static('public'));
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());

router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
router.use(bodyParser.json({limit: '50mb'}));

router.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to Sudipta!', connected: true });
});

var serviceAccount = require("./Witty-App-ServiceAccount.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://witty-app.firebaseio.com/"
});

var db = firebase.database();

router.route('/signin')
        .post(function (req, res) {
            authorization.signin(req, res, firebase);
        });

router.route('/upload-profile-image')
        .post(function (req, res) {
            uploadDocument.uploadDocument(req, res, db);
        });

router.route('/category')
    .get(function (req, res) {
        category.wittyAppCategory(res, db);
    });

router.route('/upload')
    .post(function (req, res) {
        uploadDocument.uploadDocument(req, res, db);
    });

router.route('/getData')
    .get(function (req, res) {
        fetchData.getFilteredData(req, res, db);
    });

app.use(function(req, res) {
    res.status(404).send("Not Found");
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
console.log("Running on port " + server_port + "....");