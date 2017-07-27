/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// Modules
const objectFormatter = require('./object-formatter.js');
const dataCrud = require('./data-crud.js');
const path = require('path');
// Module output *** data-crud

const objectRetx = dataCrud.objectRetx;
const writeData = dataCrud.writeData;
// Module output *** objectFormatter
const createObj = objectFormatter.createObj;

const defaultCorsHeaders = {
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

  if (request.url === '/classes/messages') {
    if (request.method === 'GET' || request.method === 'OPTIONS') {
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';

      response.writeHead(200, headers);

      // response.end(JSON.stringify(objectRet) + 'hello');
      response.end(JSON.stringify(objectRet));
    } else if (request.method === 'POST') {
      // See the note below about CORS headers.
      var headers = defaultCorsHeaders;
      let body = [];

      request.on('data', function (data) {
        //From client data form is ${url}?username=Max&text=testing&roomname=Bob
        try {
          writeData(JSON.parse(data));
          body.push(JSON.parse(data));
        } catch (e) {
          data = data.toString();
          if (data.indexOf('{') >= 0) {
            writeData(JSON.parse(data));
          } else {
            data = 'Data: ' + data;
            writeData(createObj(data));
          }
        }
      });

      request.on('end', () => {
        objectRet.results = [{username: 'Jono', text: 'Do my bidding!'}];
      });

      // Tell the client we are sending them plain text.
      //
      // You will need to change this if you are sending something
      // other than plain text, like JSON or HTML.
      headers['Content-Type'] = 'text/plain';

      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(201, headers);
      // Make sure to always call response.end() - Node may not send
      // anything back to the client until you do. The string you pass to
      // response.end() will be the body of the response - i.e. what shows
      // up in the browser.
      //
      // Calling .end 'flushes' the response's internal buffer, forcing
      // node to actually send all the data over to the client.
      response.end();
    } // END POST CONDITIONAL
  } else if (request.url === '/classes/room') {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(200, headers);
    response.end();
  } else {
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    response.end();
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var getMessageHandler = function(request, response) {
  response.send(JSON.stringify(objectRet));
}

var postMessageHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  let body = [];

  request.on('data', function (data) {
    data = data.toString();
    if (data.indexOf('{') >= 0) {
      writeData(JSON.parse(data));
    } else {
      data = 'Data: ' + data;
      writeData(createObj(data));
    }
  });

  request.on('end', () => {
    objectRet.results = [{username: 'Jono', text: 'Do my bidding!'}];
  });

  headers['Content-Type'] = 'text/plain';
  response.writeHead(201, headers);
  response.end();
}

exports.getMessageHandler = getMessageHandler;
exports.postMessageHandler = postMessageHandler;
exports.requestHandler = requestHandler;