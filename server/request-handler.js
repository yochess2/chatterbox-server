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

var routes = {
  '/classes/messages': handleMessages,
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (routes[request.url]) {
    routes[request.url](request, response);
  } else {
    handle404(request, response);
  }
};

module.exports = {
  requestHandler: requestHandler
};

function handleMessages(request, response) {
  if (request.method === 'GET') {
    response.writeHead(200, defaultCorsHeaders);
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST') {
    request.on('data', function(incoming) {
      data.results.push(JSON.parse(incoming));
    });
    request.on('end', function() {
      response.writeHead(201, defaultCorsHeaders);
      response.end(JSON.stringify(data));
    });
  } else {
    console.log('not possible');
  }
}

function handle404(request, response) {
  response.writeHead(404, defaultCorsHeaders);
  response.end();
}
