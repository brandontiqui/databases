var models = require('../models');
var db = require('../db/index');
var Promise = require('bluebird');


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
    checkIfUserExists: function(name) {
      return new Promise(function(resolve, reject) {
        var queryString = 'SELECT count(*) cnt from Users where name ="' + name + '"';
        var query = db.dbConnection.query(queryString, function(error, results) {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].cnt !== 0);
          }
        });
      });
    },

    queryDB: function(queryString, queryObj) {
      return new Promise(function(resolve, reject) {
        var newQuery = db.dbConnection.query(queryString, queryObj, function(error, results) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },

    get: function (request, response) {
      console.log('Messages GET request...');
      // getMessages();
      var query = 'SELECT name username, roomName, message FROM Messages m, Users u WHERE m.userId=u.userId';
      module.exports.messages.queryDB(query).then(function(results) {
        response.writeHead(200, module.exports.headers);
        response.end(JSON.stringify(results));
      });
    },

    options: function(request, response) {
      console.log('Messages OPTIONS request...');

      // on GET request to our Messages table, we should Query our Messages and
      // GET what we're asked for

      var query = 'SELECT * FROM Messages ORDER BY messageId DESC;';
      module.exports.messages.queryDB(query)
        .then(function(results) {
          response.writeHead(200, module.exports.headers);
          response.end(JSON.stringify(results));
        })
        .catch(function(error) {
          console.log('Messages GET Error');
        });     
    },

    // a function which handles posting a message to the database
    post: function (request, response) {
      console.log('Messages POST request');

      var post = {
        name: request.body.username
      };

      module.exports.messages.checkIfUserExists(post.name).then(function(exists) {
        if (!exists) {
          var nextQuery = 'INSERT INTO Users SET ?';
          module.exports.messages.queryDB(nextQuery, post).catch(function(error) {
            console.log('INSERT INTO Users SET error!');
          });
        }

        var userIdQuery = 'SELECT userId from Users where name ="' + post.name + '"';
        module.exports.messages.queryDB(userIdQuery)
          .then(function(result) {
            // use id in message
            var messagePost = {
              message: request.body.text,
              roomName: request.body.roomname,
              userId: result[0].userId
            };

            console.log(request.data);
            console.log(request.message);
            console.log(request.body);
            // console.log(messagePost);

            var insertQuery = 'INSERT INTO Messages SET ?';
            module.exports.messages.queryDB(insertQuery, messagePost);
              // .then(function(result) {
              //   console.log('POST to Users table success');
              //   db.dbConnection.commit(function(error) {
              //     if (error) {
              //       db.dbConnection.rollback(function() {
              //         console.log(error);
              //       });
              //     } else {
              //       console.log('Closing connection');
              //       response.writeHead(302, module.exports.headers);
              //       response.end();
              //     }
              //   });
              // })
              // .catch(function(error) {
              //   throw new Error('Error inserting into table Messages!');
              // });
          })
          .catch(function(error) {
            throw new Error('Error selecting userId from Users!');
          });
      });
    }


            // if (error) {
            //   // if there's an error, probably means that the user isn't in the table
            //   // add the user to the table
            //   console.log('Messages POST error ', error);
            // } else {
            //   console.log('Query success, result is ', result[0]);
            //   var messagePost = {
            //     message: request.body.message,
            //     roomName: request.body.roomname,
            //     userId: result[0].userId
            //   };

            //   // messageId int(6) PRIMARY KEY AUTO_INCREMENT,
            //   // message VARCHAR(255) NOT NULL,
            //   // roomName VARCHAR(15) NOT NULL,
            //   // userId int(6) NOT NULL,

            //   console.log(messagePost);

            //   var query2 = db.dbConnection.query('INSERT INTO Messages SET ?', messagePost, function(error, result) {
            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log('POST to Users table success');
            //       db.dbConnection.commit(function(error) {
            //         if (error) {
            //           db.dbConnection.rollback(function() {
            //             console.log(error);
            //           });
            //         } else {
            //           console.log('Closing connection');
            //           response.writeHead(302, module.exports.headers);
            //           response.end();
            //         }
            //       });
            //     }
            //   });
            // }
      // },

      // On post to Messages table, check to see if the user is in our Users table
      // If user is in our user table, get that user's userID and post to Messages table using that ID

    //   var query = db.dbConnection.query('SELECT userId from Users where name ="' + post.name + '"', function(error, result) {
    //     if (error) {
    //       // if there's an error, probably means that the user isn't in the table
    //       // add the user to the table
    //       console.log('Messages POST error ', error);
    //     } else {
    //       console.log('Query success, result is ', result[0]);
    //       var messagePost = {
    //         message: request.body.message,
    //         roomName: request.body.roomname,
    //         userId: result[0].userId
    //       };

    //       // messageId int(6) PRIMARY KEY AUTO_INCREMENT,
    //       // message VARCHAR(255) NOT NULL,
    //       // roomName VARCHAR(15) NOT NULL,
    //       // userId int(6) NOT NULL,

    //       console.log(messagePost);

    //       var query2 = db.dbConnection.query('INSERT INTO Messages SET ?', messagePost, function(error, result) {
    //         if (error) {
    //           console.log(error);
    //         } else {
    //           console.log('POST to Users table success');
    //           db.dbConnection.commit(function(error) {
    //             if (error) {
    //               db.dbConnection.rollback(function() {
    //                 console.log(error);
    //               });
    //             } else {
    //               console.log('Closing connection');
    //               response.writeHead(302, module.exports.headers);
    //               response.end();
    //             }
    //           });
    //         }
    //       });
    //     }
    //   });

    // }
  },

  users: {
    // Ditto as above
    get: function (request, response) {

      // on GET request to our Messages table, we should Query our Messages and
      // GET what we're asked for

      var queryString = 'SELECT * FROM Users';
      module.exports.messages.queryDB(queryString).then(function(values) {
        response.writeHead(200, module.exports.headers);
        response.end(JSON.stringify(results));
      });

    },
    post: function (request, response) {

      var post = { name: request.body.username };
      var queryString = 'INSERT INTO Useres SET ?';

      module.exports.messages.checkIfUserExists(post.name).then(function(exists) {
        if (!exists) {
          module.exports.messages.queryDB(queryString, post).catch(function(error) {
            throw new Error('Error posting to User table!');
          }); 
        } else {
          response.writeHead(201, module.exports.headers);
          response.end();
        }
      });
      // console.log('users POST request');
      // var post = {
      //   name: request.body.username
      // };
      // var queryExists = db.dbConnection.query('SELECT count(*) cnt from Users where name ="' + post.name + '"', function(error, result) {
      //   if (error) {
      //     console.log('Messages post error ', error);
      //   } else if (result[0].cnt === 0) {
      //     var query = db.dbConnection.query('INSERT INTO Users SET ?', post, function(error, result) {
      //       if (error) {
      //         console.log(error);
      //       } else {
      //         console.log('Post to Users table success');
      //         response.end();
      //       }
      //     });
      //     // if there's an error, probably means that the user isn't in the table
      //     // add the user to the table
      //   } else { // user is already in table
      //     response.writeHead(201, module.exports.headers);
      //     response.end();
      //   }

      // });
    }
  }
};

