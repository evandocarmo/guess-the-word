"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
var ChatRoom_1 = require("./ChatRoom");
var chatRooms = []; //Array of ChatRooms
var total = 0; //Total of users connected
app.ws('/socket', function (conn, req) {
    //new user entered the website. conn is the user's connection
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
    conn.on('text', function (text) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvZXZhbi9Qcm9qZWN0cy9ndWVzcy10aGUtd29yZC9zZXJ2ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2V2YW4vUHJvamVjdHMvZ3Vlc3MtdGhlLXdvcmQvc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUUsWUFBWTtBQUNkLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxJQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsMENBQTBDO0FBQzFDLHdCQUF3QjtBQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0MsNENBQTRDO0FBQzVDLGNBQWM7QUFDZCxJQUFNLFFBQVEsR0FBRztJQUNmLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUM3QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FDbEIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUMvQyxDQUFDO1FBQ0osQ0FBQztRQUNELElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0QsbUJBQW1CO0FBQ25CLHNCQUFzQjtBQUN0QixhQUFhO0FBQ2Isc0JBQXNCO0FBRXRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLFVBQUMsR0FBRyxFQUFDLEdBQUc7SUFDbEIsR0FBRyxDQUFDLFFBQVEs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QUMsT0FBTyxFQUFFLFVBQVUsSUFBUSxFQUFFLE1BQVU7UUFDOUMsS0FBSyxFQUFFLENBQUM7UUFDUixFQUFFLENBQUEsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQzNFLElBQUksS0FBSyxHQUFVLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7WUFDMUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7UUFDbEQsQ0FBQztRQUFBLElBQUk7WUFDSixlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsZ0NBQWdDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakcsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQU87UUFDakMsNkRBQTZEO1FBQzdELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELE1BQU8sR0FBRyxDQUFDO1FBQ1osQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiICAvLyBzZXJ2ZXIuanNcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG52YXIgZXhwcmVzc1dzID0gcmVxdWlyZSgnZXhwcmVzcy13cycpKGFwcCk7XG4vLyBSdW4gdGhlIGFwcCBieSBzZXJ2aW5nIHRoZSBzdGF0aWMgZmlsZXNcbi8vIGluIHRoZSBkaXN0IGRpcmVjdG9yeVxuYXBwLnVzZShleHByZXNzLnN0YXRpYyhfX2Rpcm5hbWUgKyAnL2Rpc3QnKSk7XG4vLyBTdGFydCB0aGUgYXBwIGJ5IGxpc3RlbmluZyBvbiB0aGUgZGVmYXVsdFxuLy8gSGVyb2t1IHBvcnRcbmNvbnN0IGZvcmNlU1NMID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBpZiAocmVxLmhlYWRlcnNbJ3gtZm9yd2FyZGVkLXByb3RvJ10gIT09ICdodHRwcycpIHtcbiAgICAgIHJldHVybiByZXMucmVkaXJlY3QoXG4gICAgICAgWydodHRwczovLycsIHJlcS5nZXQoJ0hvc3QnKSwgcmVxLnVybF0uam9pbignJylcbiAgICAgICk7XG4gICAgfVxuICAgIG5leHQoKTtcbiAgfVxufVxuLy8gSW5zdHJ1Y3QgdGhlIGFwcFxuLy8gdG8gdXNlIHRoZSBmb3JjZVNTTFxuLy8gbWlkZGxld2FyZVxuLy9hcHAudXNlKGZvcmNlU1NMKCkpO1xuXG5hcHAuZ2V0KCcvJywocmVxLHJlcyk9PntcbiAgcmVzLnNlbmRGaWxlKF9fZGlybmFtZSArICcvZGlzdC9pbmRleC5odG1sJyk7XG59KVxuXG5pbXBvcnQgeyBNZXNzYWdlLCBDaGF0Um9vbSB9IGZyb20gJy4vQ2hhdFJvb20nO1xuXG5sZXQgY2hhdFJvb21zOkNoYXRSb29tW10gPSBbXTsvL0FycmF5IG9mIENoYXRSb29tc1xubGV0IHRvdGFsOm51bWJlciA9IDA7IC8vVG90YWwgb2YgdXNlcnMgY29ubmVjdGVkXG5cbmFwcC53cygnL3NvY2tldCcsKGNvbm4scmVxKT0+e1xuXHQvL25ldyB1c2VyIGVudGVyZWQgdGhlIHdlYnNpdGUuIGNvbm4gaXMgdGhlIHVzZXIncyBjb25uZWN0aW9uXG5cdGxldCBjdXJyZW50Q2hhdFJvb206Q2hhdFJvb207IC8vVGhpcyB2YXJpYWJsZSB3aWxsIGhvbGQgdGhlIGN1cnJlbnQgdXNlcidzIENoYXRSb29tXG5cdGlmKGNoYXRSb29tcy5sZW5ndGggPT09IDApeyAvL05vIGNoYXRSb29tcyB5ZXRcblx0XHRjb25zb2xlLmxvZygnbm8gY2hhdCByb29tcy4gTGV0IHVzIGNyZWF0ZSBvbmUnKTtcblx0XHRsZXQgY2hhdFJvb20gPSBuZXcgQ2hhdFJvb20oY29ubiw0KTsgLy9jcmVhdGUgb25lLCBwYXNzIHVzZXIgYXMgYXJndW1lbnQgc28gaGUnbGwgYmUgdGhpcyByb29tJ3MgbWFzdGVyXG5cdFx0Y2hhdFJvb21zLnB1c2goY2hhdFJvb20pOy8vc2F2ZSBuZXcgcm9vbSBpbiB0aGUgYXJyYXlcblx0XHRjdXJyZW50Q2hhdFJvb20gPSBjaGF0Um9vbTsvL3NhdmUgcmVmZXJlbmNlIHRvIHRoaXMgcm9vbSBhcyBjdXJyZW50IHJvb21cblx0fWVsc2V7IC8vIFRoZXJlIGlzIG9uZSBvciBtb3JlIGNoYXRSb29tc1xuXHRcdGNvbnNvbGUubG9nKCdXZSBoYXZlIHNvbWUgY2hhdFJvb21zLiBsZXQgdXMgZmluZCB0aGUgZmlyc3Qgb25lIHdpdGggbGVzcyBwZW9wbGUgdGhhbiB0aGUgbGltaXQnKTtcblx0XHRsZXQgZm91bmQ6Ym9vbGVhbiA9IGZhbHNlOyAvL0ZsYWcgdG8gc2lnbmFsIGlmIHdlIGhhdmUgZm91bmQgYSBjaGF0Um9vbSB3aXRoIHNwYWNlXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGNoYXRSb29tcy5sZW5ndGg7IGkrKyl7IC8vRm9yIGV2ZXJ5IGNoYXRSb29tXG5cdFx0XHRsZXQgY2hhdFJvb20gPSBjaGF0Um9vbXNbaV07IC8vc2F2ZSByZWZlcmVuY2Vcblx0XHRcdGNvbnNvbGUubG9nKCdjaGF0IHJvb20gbnVtYmVyJyxpLCcgLSAnLGNoYXRSb29tLmNvdW50LCcgb3V0IG9mICcsY2hhdFJvb20ubGltaXQpO1xuXHRcdFx0aWYoY2hhdFJvb20uY291bnQgPCBjaGF0Um9vbS5saW1pdCl7IC8vaWYgY3VycmVudCBudW1iZXIgaXMgc21hbGxlciB0aGFuIGxpbWl0XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwidGhlcmUncyBzcGFjZS4gTGV0J3MgYWRkIHRoaXMgZ3V5IGhlcmVcIik7XG5cdFx0XHRcdGNoYXRSb29tLmFkZFVzZXIoY29ubik7Ly9hZGQgdXNlciB0byBjaGF0Um9vbVxuXHRcdFx0XHRjdXJyZW50Q2hhdFJvb20gPSBjaGF0Um9vbTsgLy9zYXZlIHRoaXMgY2hhdFJvb20gYXMgY3VycmVudFxuXHRcdFx0XHRmb3VuZCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrOyAvL2JyZWFrIG91dCBvZiBsb29wLiBXZSBkb24ndCBuZWVkIHRvIGxvb2sgaW50byB0aGUgbmV4dCByb29tc1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZighZm91bmQpey8vSWYgd2UgbG9va2VkIGludG8gYWxsIHJvb21zIGJ1dCB0aGV5IGRvbid0IGhhdmUgYW55IHNwYWNlLi4uXG5cdFx0XHRjb25zb2xlLmxvZyhcIkFsbCByb29tcyBhcmUgZnVsbC4gTGV0J3MgY3JlYXRlIGEgbmV3IG9uZVwiKTtcblx0XHRcdGxldCBjaGF0Um9vbTpDaGF0Um9vbSA9IG5ldyBDaGF0Um9vbShjb25uLDQpOy8vY3JlYXRlIG5ldyByb29tXG5cdFx0XHRjaGF0Um9vbXMucHVzaChjaGF0Um9vbSk7IC8vcHVzaCBpdCBpbnRvIGFycmF5XG5cdFx0XHRjdXJyZW50Q2hhdFJvb20gPSBjaGF0Um9vbTsvL3NhdmUgdGhpcyBjaGF0Um9vbSBhcyBjdXJyZW50XG5cdFx0fVxuXHR9XG5cdHRvdGFsKys7IC8vYWRkIHRvIHRvdGFsIG9mIHVzZXJzXG5cdGNvbnNvbGUubG9nKCdOZXcgQ2hhdCBjb25uZWN0aW9uIGVzdGFibGlzaGVkLicsIG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCkpO1xuXG5cdC8vTm93LCBsZXQncyBoYW5kbGUgdXNlciBhY3Rpdml0eVxuXG5cdGNvbm4ub24oJ3RleHQnLCBmdW5jdGlvbiAodGV4dDpzdHJpbmcpIHsvL2lmIHdlIHJlY2VpdmUgc29tZSB0ZXh0IHRocm91Z2ggdGhpcyB1c2VyXG5cdFx0bGV0IG1zZzpNZXNzYWdlID0gSlNPTi5wYXJzZSh0ZXh0KTsvL3BhcnNlIGl0IGludG8gYSBKUyBvYmplY3Rcblx0XHRjdXJyZW50Q2hhdFJvb20uc2VuZE1lc3NhZ2VUb0FsbChtc2cpOy8vU2VuZCB0byBhbGwgdXNlcnMgaW4gdGhpcyBjaGF0Um9vbVxuXHR9KTtcblxuXHRjb25uLm9uKCdjbG9zZScsIGZ1bmN0aW9uIChjb2RlOmFueSwgcmVhc29uOmFueSkgey8vSWYgdGhpcyB1c2VyIGRpc2Nvbm5lY3RzLi4uXG5cdFx0dG90YWwtLTtcblx0XHRpZihjb25uID09PSBjdXJyZW50Q2hhdFJvb20ubWFzdGVyICYmIGN1cnJlbnRDaGF0Um9vbS5jbGllbnRzLmxlbmd0aCA9PT0gMCl7Ly8gbm8gdXNlcnMgbGVmdCwgZGVzdHJveSByb29tXG5cdFx0XHRsZXQgaW5kZXg6bnVtYmVyID0gY2hhdFJvb21zLmluZGV4T2YoY3VycmVudENoYXRSb29tKTsgLy9zYXZlIHJvb20ncyBpbmRleFxuXHRcdFx0Y2hhdFJvb21zLnNwbGljZShpbmRleCwxKTsgLy9yZW1vdmUgaXQgZnJvbSBhcnJheVxuXHRcdH1lbHNlIC8vSWYgdGhlcmUgYXJlIHN0aWxsIHVzZXJzIGxlZnQgaW4gdGhpcyByb29tXG5cdFx0XHRjdXJyZW50Q2hhdFJvb20ucmVtb3ZlVXNlcihjb25uKTsvL1Jvb20gaGFuZGxlcyByZW1vdmluZyB0aGUgdXNlclxuXHRcdGNvbnNvbGUubG9nKCdDaGF0IGNvbm5lY3Rpb24gY2xvc2VkLicsIG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCksICdjb2RlOiAnLCBjb2RlLCByZWFzb24pO1xuXHR9KTtcblxuXHRjb25uLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnI6YW55KSB7XG5cdFx0Ly8gT25seSB0aHJvdyBpZiBzb21ldGhpbmcgZWxzZSBoYXBwZW5zIHRoYW4gQ29ubmVjdGlvbiBSZXNldFxuXHRcdGlmIChlcnIuY29kZSAhPT0gJ0VDT05OUkVTRVQnKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgaW4gQ2hhdCBTb2NrZXQgY29ubmVjdGlvbicsIGVycik7XG5cdFx0XHR0aHJvdyAgZXJyO1xuXHRcdH1cblx0fSlcblxufSk7XG5hcHAubGlzdGVuKDgwODApO1xuIl19