/**
 * Created by sudipta.c.das on 6/18/2017.
 */
//var http = require("http");
//var url = require('url');
//var dt = require('./Authentication/auth');
//
//http.createServer(function (request, response) {
//    response.writeHead(200, {'Content-Type': 'application/json'});
//    var q = url.parse(request.url, true).query;
//    response.write("Current time is: " + dt.currentDateAndTime() + "\n");
//    response.write("Name: " + q.loginName + "\n");
//    response.end('Hello World\n');
//}).listen(8080);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var firebase = require("firebase-admin");
var serviceAccount = require("./Witty-App-ServiceAccount.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://witty-app.firebaseio.com/"
});

var db = firebase.database();

app.get('/category', function (req, res) {
    var timer = setTimeout(function () {
        fetchCategoryFromFirebase(res);
    }, 1000);
    req.once('timeout', function () {
        clearTimeout(timer);
    });
});

var fetchCategoryFromFirebase = function (response) {
    var ref = db.ref("category");
    ref.on("value", function(snapshot) {
        var categoryDataSource = [];
        snapshot.forEach(function (data) {
            categoryDataSource.push(data.val());
        });
        response.send(categoryDataSource);
        response.end();
    }, function (errorObject) {
        response.send("The read failed: " + errorObject.code);
    });
};

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
console.log("Running on port " + server_port + "....");