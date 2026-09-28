const users = {};

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body with their response.
  // Similarly, 204 status codes are "no content" responses
  // so they also do not get a response body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }
  response.end();
};

const addUser = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };
  
  const { name, age } = request.body;


  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    users[name] = {
      name: name,
    };
    users[age] ={
      age: age,
    };
  } else{
    //204 error
     return respondJSON(request, response, responseCode, {});
  }



  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

 
  return respondJSON(request, response, responseCode, {});
};


const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
   const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);

};

module.exports = {
    getUsers,
    notFound,
    addUser
}
