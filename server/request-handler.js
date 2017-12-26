/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var APP_ID = 'chatterbox';
var APP_KEY = 'abc123';

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-max-age': 10, // Seconds.
  'access-control-allow-headers': [
    'content-type',
    'accept',
    'X-Parse-Application-Id',
    'X-Parse-REST-API-Key'
  ].join(),
};

var data = {
  results: []
};

var checkHeader = function(request, response, header) {
  var appId = request.headers['X-Parse-Application-Id'.toLowerCase()];
  var appKey = request.headers['X-Parse-REST-API-Key'.toLowerCase()];
  if (appId !== APP_ID || appKey !== APP_KEY) {
    response.writeHead(403, header);
    response.end();
  }
};

var handleMessages = function(request, response, header) {
  header['Content-Type'] = 'application/json';
  header['X-Parse-Application-Id'] = 'chatterbox';
  header['X-Parse-REST-API-Key'] = 'abc123';

  if (request.method === 'GET') {
    checkHeader(request, response, header);
    response.writeHead(200, header);
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST') {
    checkHeader(request, response, header);
    request.on('data', function(incoming) {
      data.results.push(JSON.parse(incoming));
    });
    request.on('end', function() {
      response.writeHead(201, header);
      response.end(JSON.stringify(data));
    });
  } else {
    response.writeHead(201, header);
    response.end(JSON.stringify(null));
  }
};

var handle404 = function(request, response) {
  response.writeHead(404, defaultCorsHeaders);
  response.end();
};

var routes = {
  '/classes/messages': handleMessages,
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var header = Object.assign({}, defaultCorsHeaders);
  var currentRoute = routes[request.url];
  if (currentRoute) {
    currentRoute(request, response, header);
  } else {
    handle404(request, response);
  }
};

module.exports = {
  requestHandler: requestHandler
};
