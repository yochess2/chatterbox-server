/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var data = {
  results: []
};


var requestHandler = function(request, response) {
  var writeResponse = function(statusCode, headers) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  };

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode;
  var headers = defaultCorsHeaders;

  if (request.method === 'GET') {
    statusCode = 200;
    writeResponse(200, headers);

  } else if (request.method === 'POST') {
    statusCode = 201;
    request.on('data', function(incoming) {
      data.results.push(JSON.parse(incoming));
    });
    request.on('end', function() {
      writeResponse(statusCode, headers);
    });

  } else if (request.method === 'PUT') {

  } else if (request.method === 'OPTIONS') {

  } else {
    statusCode = 404;
    writeResponse(statusCode, headers);
  }
};

module.exports = {
  requestHandler: requestHandler
};
