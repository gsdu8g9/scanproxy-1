var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

var timeouts = [], iterator = 1;

function errorMsg() {
  console.error("du it");
}

setInterval(function() {
                  iterator++;
                  console.log(__filename+' ->'+iterator);
                  
                }, 2000);

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', function(worker) {
    console.log('worker ' + worker.process.pid);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
}