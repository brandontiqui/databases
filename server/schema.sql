CREATE DATABASE chat;

USE chat;


CREATE TABLE Users (
  userId int(6) PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(15) NOT NULL
);

-- CREATE TABLE Rooms (
--   roomId int(6) PRIMARY KEY AUTO_INCREMENT,
--   name VARCHAR(15)
-- );

CREATE TABLE Messages (
  /* Describe your table here.*/
  messageId int(6) PRIMARY KEY AUTO_INCREMENT,
  message VARCHAR(255) NOT NULL,
  roomName VARCHAR(15) NOT NULL,
  userId int(6) NOT NULL,

  -- FOREIGN KEY (roomId) REFERENCES Rooms(roomId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);
/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

