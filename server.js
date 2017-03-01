var http = require("http");
var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

var port_number = process.env.PORT || 3000;

function send404(response) {
  response.writeHead(404, {"Content-type" : "text/plain"});
  response.write("Error 404: resource not found");
  response.end();
}

function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

function serverWorking(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response)
        } else {
          sendPage(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}

var server = http.createServer(function(request, response) {
  var filePath = false;

  if (request.url == '/') {
    filePath = "src/client/app/index.html";
  } else {
    filePath = "src/client/app" + request.url;
  }

  var absPath = "./" + filePath;
  serverWorking(response, absPath);
}).listen(port_number);
