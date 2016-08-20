var models = require('../models');
var db = require('../db/index');


// WHAT IF WE POST TO MESSAGE TABLE, BUT THE USER IS NOT YET IN THE
// USER TABLE??

module.exports.defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

module.exports.headers = module.exports.defaultCorsHeaders;
// module.exports.headers['Content-Type'] = 'text/plain';


module.exports = {
  // a function which handles a get request for all messages
  messages: {
    get: function (request, response) {
      console.log('Messages GET request...');

      // on GET request to our Messages table, we should Query our Messages and
      // GET what we're asked for

      var queryString = 'SELECT * FROM Messages';
      var messagesQuery = db.dbConnection.query(queryString, function(error, results) {
        if (error) {
          console.log('Messages GET Error');
        } else {
          response.writeHead(200, module.exports.headers);
          response.end(JSON.stringify(results));
        }
      });



    },

    options: function(request, response) {
      console.log('Messages OPTIONS request...');

      // on GET request to our Messages table, we should Query our Messages and
      // GET what we're asked for

      var queryString = 'SELECT * FROM Messages ORDER BY messageId DESC;';
      var messagesQuery = db.dbConnection.query(queryString, function(error, results) {
        if (error) {
          console.log('Messages GET Error');
        } else {
          response.writeHead(200, module.exports.headers);
          response.end(JSON.stringify(results));
        }
      });      
    },

    // a function which handles posting a message to the database
    post: function (request, response) {
      console.log('Messages POST request');

      var post = {
        name: request.body.username
      };

      // On post to Messages table, check to see if the user is in our Users table
      // If user is in our user table, get that user's userID and post to Messages table using that ID

      var query = db.dbConnection.query('SELECT userId from Users where name ="' + post.name + '"', function(error, result) {
        if (error) {
          // if there's an error, probably means that the user isn't in the table
          // add the user to the table
          console.log('Messages POST error ', error);
        } else {
          console.log('Query success, result is ', result[0]);
          var messagePost = {
            message: request.body.message,
            roomName: request.body.roomname,
            userId: result[0].userId
          };

          // messageId int(6) PRIMARY KEY AUTO_INCREMENT,
          // message VARCHAR(255) NOT NULL,
          // roomName VARCHAR(15) NOT NULL,
          // userId int(6) NOT NULL,

          console.log(messagePost);

          var query2 = db.dbConnection.query('INSERT INTO Messages SET ?', messagePost, function(error, result) {
            if (error) {
              console.log(error);
            } else {
              console.log('POST to Users table success');
              db.dbConnection.commit(function(error) {
                if (error) {
                  db.dbConnection.rollback(function() {
                    console.log(error);
                  });
                } else {
                  console.log('Closing connection');
                  response.writeHead(302, module.exports.headers);
                  response.end();
                }
              });
            }
          });
        }
      });

    }
  },

  users: {
    // Ditto as above
    get: function (request, response) {
      console.log('get user hi');

      // on GET request to our Messages table, we should Query our Messages and
      // GET what we're asked for

      var queryString = 'SELECT * FROM Users';
      var messagesQuery = db.dbConnection.query(queryString, function(error, results) {
        if (error) {
          console.log('Users GET Error');
        } else {
          response.writeHead(200, module.exports.headers);
          response.end(JSON.stringify(results));
        }
      });

    },
    post: function (request, response) {
      console.log('users POST request');
      var post = {
        name: request.body.username
      };
      var queryExists = db.dbConnection.query('SELECT count(*) cnt from Users where name ="' + post.name + '"', function(error, result) {
        if (error) {
          console.log('Messages post error ', error);
        } else if (result[0].cnt === 0) {
          var query = db.dbConnection.query('INSERT INTO Users SET ?', post, function(error, result) {
            if (error) {
              console.log(error);
            } else {
              console.log('Post to Users table success');
              response.end();
            }
          });
          // if there's an error, probably means that the user isn't in the table
          // add the user to the table
        } else { // user is already in table
          response.writeHead(201, module.exports.headers);
          response.end();
        }

      });
    }
  }
};

