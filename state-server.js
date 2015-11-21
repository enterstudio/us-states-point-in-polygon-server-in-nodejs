// HTTP server: Takes a POST request of a coordinate point
//              Outputs what state the point lies in, or null if no state
// Experimenting with node
// The json file read-in contains coordinate points of US state borders

var express = require('express');
var bodyParser = require('body-parser');
var inside = require('point-in-polygon');
var lineReader = require('line-reader');
var states = [];
var app = express();

app.use(bodyParser.urlencoded({
		extended: true
}));

app.post('/', function(req, res){
  var longitude = parseFloat(req.body.longitude);
  var latitude = parseFloat(req.body.latitude);
  var polygon = [];
  var result;
    
  for (var i in states){
    polygon = states[i].border;
	
	if (inside([longitude, latitude], polygon)){
		result = '["' + states[i].state + '"]\n';
        break;
	}
	else
		result = '[NULL]\n';
  }

  res.sendStatus(result); 
});

var server = app.listen(3000, function (){
  var host = server.address().address;
  var port = server.address().port;

// blocking call at server start to load border points in  
  lineReader.eachLine('states.json', function(line, last) {
	states.push(JSON.parse(line));
  });
  
  console.log('Listening at http://%s:%s', host, port);
});
