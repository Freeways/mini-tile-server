var express = require('express');
var fs = require('fs');
var request = require('request');

var app = express();

app.use(express.static('public'));

app.get('/tiles/:z/:x/:y/:s', function (req, res) {
  var filename = './tiles/' + req.params.z + '/' + req.params.x + '/' + req.params.y + '.png';
  fs.access(filename, 2, function (err) {
    if (err) {
      var url = buildOsmUrl(req.params.z, req.params.x, req.params.y, req.params.s);
      console.log(url);
      request(url).pipe(res);
    } else {
      var img = fs.readFileSync(filename);
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(img, 'binary');
    }
  });
});

buildOsmUrl = function(z,x,y,s){
  return 'http://'+ s + '.tile.openstreetmap.org/' + z + '/' + x + '/'+ y + '.png'
}

var server = app.listen(8088, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Custom Tiles listning at http://%s:%s", host, port);
});