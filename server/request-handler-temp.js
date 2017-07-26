/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With,Content-Type, Accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  let body = [];

  var objectRet = {
    results: [
      // {"createdAt": "2017-07-22T23:19:51.731Z",
      //   "objectId": "VT2ehP8Anz",
      //   "roomname": "allRooms",
      //   "text": "do you Suh",
      //   "updatedAt": "2017-07-22T23:19:51.731Z",
      //   "username": "anonymous"}
    ]
  };
  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      // See the note below about CORS headers.
      var headers = defaultCorsHeaders;

      // Tell the client we are sending them plain text.
      //
      // You will need to change this if you are sending something
      // other than plain text, like JSON or HTML.
      headers['Content-Type'] = 'text/plain';

      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.

      // Make sure to always call response.end() - Node may not send
      // anything back to the client until you do. The string you pass to
      // response.end() will be the body of the response - i.e. what shows
      // up in the browser.
      //
      // Calling .end "flushes" the response's internal buffer, forcing
      // node to actually send all the data over to the client.

      response.writeHead(200, headers);
      response.end(JSON.stringify(objectRet));
    } else if (request.method === 'POST') {
      // The outgoing status.
      var statusCode = 201;

      var postedData = '';

      // See the note below about CORS headers.
      var headers = defaultCorsHeaders;

      request.on('data', (chunk) => {
        postedData += chunk;
        body.push(chunk);
      });
      request.on('end', () => {
        objectRet.results.push(JSON.parse(postedData));
        // your code here if you want to use the results !
      });

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify(objectRet));
    }
  } else if (request.url === '/classes/room') {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(200, headers);
    response.end('Hello World');
  } else {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    response.end('Hello World');
  }
};

exports.requestHandler = requestHandler;


/*
var ObjectRet = {
  results: [
      {"createdAt": "2017-07-22T23:22:33.233Z",
        "objectId": "yWVdrw8COy",
        "updatedAt": "2017-07-22T23:22:33.233Z"},
      {"createdAt": "2017-07-22T23:20:08.605Z",
        "objectId": "hlEBbeCmVU",
        "updatedAt": "2017-07-22T23:20:08.605Z"},
      {"createdAt": "2017-07-22T23:19:51.731Z",
        "objectId": "VT2ehP8Anz",
        "roomname": "allRooms",
        "text": "do you Suh",
        "updatedAt": "2017-07-22T23:19:51.731Z",
        "username": "anonymous"}
  ]
}

*/