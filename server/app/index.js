/**
 * Created by michael on 24/07/15.
 */

var http = require('http');
var App = require('./App.js');

var server = http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end('Nothing to see');
});

var io = require('socket.io').listen(server);
var app = new App(io,server);

app.start();