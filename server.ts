  // server.js
const express = require('express');
const app = express();
var expressWs = require('express-ws')(app);
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}
// Instruct the app
// to use the forceSSL
// middleware
//app.use(forceSSL());

import { Message, ChatRoom } from './ChatRoom';

let chatRooms:ChatRoom[] = [];//Array of ChatRooms
let total:number = 0; //Total of users connected

app.ws('/socket',(conn,req)=>{
  	//new user entered the website. conn is the user's connection
    conn.on('open',()=>{
      console.log('opened');
    })
  	let currentChatRoom:ChatRoom; //This variable will hold the current user's ChatRoom
  	if(chatRooms.length === 0){ //No chatRooms yet
  		console.log('no chat rooms. Let us create one');
  		let chatRoom = new ChatRoom(conn,4); //create one, pass user as argument so he'll be this room's master
  		chatRooms.push(chatRoom);//save new room in the array
  		currentChatRoom = chatRoom;//save reference to this room as current room
  	}else{ // There is one or more chatRooms
  		console.log('We have some chatRooms. let us find the first one with less people than the limit');
  		let found:boolean = false; //Flag to signal if we have found a chatRoom with space
  		for(let i = 0; i < chatRooms.length; i++){ //For every chatRoom
  			let chatRoom = chatRooms[i]; //save reference
  			console.log('chat room number',i,' - ',chatRoom.count,' out of ',chatRoom.limit);
  			if(chatRoom.count < chatRoom.limit){ //if current number is smaller than limit
  				console.log("there's space. Let's add this guy here");
  				chatRoom.addUser(conn);//add user to chatRoom
  				currentChatRoom = chatRoom; //save this chatRoom as current
  				found = true;
  				break; //break out of loop. We don't need to look into the next rooms
  			}
  		}
  		if(!found){//If we looked into all rooms but they don't have any space...
  			console.log("All rooms are full. Let's create a new one");
  			let chatRoom:ChatRoom = new ChatRoom(conn,4);//create new room
  			chatRooms.push(chatRoom); //push it into array
  			currentChatRoom = chatRoom;//save this chatRoom as current
  		}
  	}
  	total++; //add to total of users
  	console.log('New Chat connection established.', new Date().toLocaleTimeString());

  	//Now, let's handle user activity

  	conn.on('message', function (text:string) {//if we receive some text through this user
      console.log(text);
  		let msg:Message = JSON.parse(text);//parse it into a JS object
  		currentChatRoom.sendMessageToAll(msg);//Send to all users in this chatRoom
  	});

  	conn.on('close', function (code:any, reason:any) {//If this user disconnects...
  		total--;
  		if(conn === currentChatRoom.master && currentChatRoom.clients.length === 0){// no users left, destroy room
  			let index:number = chatRooms.indexOf(currentChatRoom); //save room's index
  			chatRooms.splice(index,1); //remove it from array
  		}else //If there are still users left in this room
  			currentChatRoom.removeUser(conn);//Room handles removing the user
  		console.log('Chat connection closed.', new Date().toLocaleTimeString(), 'code: ', code, reason);
  	});

  	conn.on('error', function (err:any) {
  		// Only throw if something else happens than Connection Reset
  		if (err.code !== 'ECONNRESET') {
  			console.log('Error in Chat Socket connection', err);
  			throw  err;
  		}
  	})
  });
app.listen(process.env.PORT || 8080);
