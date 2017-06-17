/**
 * Created by sudipta.c.das on 6/18/2017.
 */
var http = require("http");
var url = require('url');
var dt = require('./Authentication/auth');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var q = url.parse(request.url, true).query;
    response.write("Current time is: " + dt.currentDateAndTime() + "\n");
    response.write("Name: " + q.loginName + "\n");
    response.end('Hello World\n');
}).listen(8080);