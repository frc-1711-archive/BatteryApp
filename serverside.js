var fs = require ('fs');
var http = require('http');
http.createServer(function(req,res) {
	fs.readFile('BatteryTemplate.html', function (err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
	fs.appendFile('mynewfile1.html', data, function (err) {
		if (err) throw err; 
		console.log("there u fucker");
	});		
	res.end();
	});
}).listen(8080);