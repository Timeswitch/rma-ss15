/**
 * Created by michael on 24/07/15.
 */

var config = require('./config.js');
var http = require('http');
var Knex = require('knex');
var App = require('./App.js');
var database = require('./Database.js');

var server = http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end('Nothing to see');
});

var io = require('socket.io').listen(server);

var app = new App(io,server,database,config);

app.start();