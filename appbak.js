var http = require('http')
var mongoose = require('monogoose');
var connectionString = process.env.CUSTOMCNNSTR_MONGOLAB_URL;
mongoose.connect(connectionString);

var port = process.env.PORT || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);