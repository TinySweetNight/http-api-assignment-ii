const http = require('http'); // pull in http module
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/getUsers': jsonHandler.getUsers,
  '/addUser': jsonHandler.addUser,
  '/notReal': jsonHandler.notFound,
  '/style.css': htmlHandler.getCSS,
  notFound: jsonHandler.notFound,
};

const parseBody = (request, response, handler) => {
  // body array.
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });


  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    request.body = JSON.parse(bodyString);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    handler(request, response);
  });
};


const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // check if method was POST, otherwise assume GET
  // for the sake of this example
  if (request.method === 'POST') {
    parseBody(request, response, jsonHandler.addUser);
  } else {
    if (urlStruct[parsedUrl.pathname]) {
      urlStruct[parsedUrl.pathname](request, response);
    } else {
      urlStruct.notFound(request, response);
    }
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});