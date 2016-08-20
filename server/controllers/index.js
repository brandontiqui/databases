var models = require('../models');
var db = require('../db/index');



module.exports = {
  messages: {
    get: function (request, response) {
      console.log('messages get hi');
      var post = {};

    }, // a function which handles a get request for all messages

    // a function which handles posting a message to the database
    post: function (request, response) {
      console.log('Messages POST request');

      var post = {
        name: request.body.username
      };
      var query = db.dbConnection.query('SELECT userId from users where name =' + post.name, function(error, result) {
        if (error) {
          // if there's an error, probably means that the user isn't in the table
          // add the user to the table
          console.log('Messages post error ', error);
        } else {
          // replace the username in the original post message with the id that we
          // got from query
          console.log('GET from Users table success');
          console.log(result.name);
          console.log(result.userId);
          console.log('something');

        }
      });

    }
  },

  users: {
    // Ditto as above
    get: function (request, response) {
      console.log('get user hi');
    },
    post: function (request, response) {
      console.log('users POST request');
      var post = {
        name: request.body.username
      };
      var query = db.dbConnection.query('INSERT INTO Users SET ?', post, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log('Post to Users table success');
        }
      });
    }
  }
};

