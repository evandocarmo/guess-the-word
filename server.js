"use strict";
exports.__esModule = true;
// server.js
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
var forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    };
};
// Instruct the app
// to use the forceSSL
// middleware
//app.use(forceSSL());
var ChatRoom_1 = require("./ChatRoom");
var chatRooms = []; //Array of ChatRooms
var total = 0; //Total of users connected
app.ws('/socket', function (conn, req) {
    //new user entered the website. conn is the user's connection
    conn.on('open', function () {
        console.log('opened');
    });
    var currentChatRoom; //This variable will hold the current user's ChatRoom
    if (chatRooms.length === 0) {
        console.log('no chat rooms. Let us create one');
        var chatRoom = new ChatRoom_1.ChatRoom(conn, 4); //create one, pass user as argument so he'll be this room's master
        chatRooms.push(chatRoom); //save new room in the array
        currentChatRoom = chatRoom; //save reference to this room as current room
    }
    else {
        console.log('We have some chatRooms. let us find the first one with less people than the limit');
        var found = false; //Flag to signal if we have found a chatRoom with space
        for (var i = 0; i < chatRooms.length; i++) {
            var chatRoom = chatRooms[i]; //save reference
            console.log('chat room number', i, ' - ', chatRoom.count, ' out of ', chatRoom.limit);
            if (chatRoom.count < chatRoom.limit) {
                console.log("there's space. Let's add this guy here");
                chatRoom.addUser(conn); //add user to chatRoom
                currentChatRoom = chatRoom; //save this chatRoom as current
                found = true;
                break; //break out of loop. We don't need to look into the next rooms
            }
        }
        if (!found) {
            console.log("All rooms are full. Let's create a new one");
            var chatRoom = new ChatRoom_1.ChatRoom(conn, 4); //create new room
            chatRooms.push(chatRoom); //push it into array
            currentChatRoom = chatRoom; //save this chatRoom as current
        }
    }
    total++; //add to total of users
    console.log('New Chat connection established.', new Date().toLocaleTimeString());
    //Now, let's handle user activity
    conn.on('message', function (text) {
        console.log(text);
        var msg = JSON.parse(text); //parse it into a JS object
        currentChatRoom.sendMessageToAll(msg); //Send to all users in this chatRoom
    });
    conn.on('close', function (code, reason) {
        total--;
        if (conn === currentChatRoom.master && currentChatRoom.clients.length === 0) {
            var index = chatRooms.indexOf(currentChatRoom); //save room's index
            chatRooms.splice(index, 1); //remove it from array
        }
        else
            currentChatRoom.removeUser(conn); //Room handles removing the user
        console.log('Chat connection closed.', new Date().toLocaleTimeString(), 'code: ', code, reason);
    });
    conn.on('error', function (err) {
        // Only throw if something else happens than Connection Reset
        if (err.code !== 'ECONNRESET') {
            console.log('Error in Chat Socket connection', err);
            throw err;
        }
    });
});
app.listen(8080);
