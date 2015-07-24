/**
 * Created by michael on 24/07/15.
 */

var http = require('http');

var server = http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end('Nothing to see');
});

var io = require('socket.io').listen(server);

io.on('connection',function(socket){
    socket.emit('welcome',{
        message: 'Welcome!',
        id: socket.id
    })
});

server.listen(2209);