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
    res.sendFile(__dirname + '/dist/src/index.html');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvZXZhbi9Qcm9qZWN0cy9ndWVzcy10aGUtd29yZC9zZXJ2ZXIudHMiLCJzb3VyY2VzIjpbIi9ob21lL2V2YW4vUHJvamVjdHMvZ3Vlc3MtdGhlLXdvcmQvc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUUsWUFBWTtBQUNkLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxJQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsMENBQTBDO0FBQzFDLHdCQUF3QjtBQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0MsNENBQTRDO0FBQzVDLGNBQWM7QUFDZCxJQUFNLFFBQVEsR0FBRztJQUNmLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtRQUM3QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FDbEIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUMvQyxDQUFDO1FBQ0osQ0FBQztRQUNELElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0QsbUJBQW1CO0FBQ25CLHNCQUFzQjtBQUN0QixhQUFhO0FBQ2Isc0JBQXNCO0FBRXRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLFVBQUMsR0FBRyxFQUFDLEdBQUc7SUFDbEIsR0FBRyxDQUFDLFFBQVEs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QUMsT0FBTyxFQUFFLFVBQVUsSUFBUSxFQUFFLE1BQVU7UUFDOUMsS0FBSyxFQUFFLENBQUM7UUFDUixFQUFFLENBQUEsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQSxDQUFDO1lBQzNFLElBQUksS0FBSyxHQUFVLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7WUFDMUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7UUFDbEQsQ0FBQztRQUFBLElBQUk7WUFDSixlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsZ0NBQWdDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakcsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQU87UUFDakMsNkRBQTZEO1FBQzdELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELE1BQU8sR0FBRyxDQUFDO1FBQ1osQ0FBQztJQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsQ0FBQyxDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiICAvLyBzZXJ2ZXIuanNcbmNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG52YXIgZXhwcmVzc1dzID0gcmVxdWlyZSgnZXhwcmVzcy13cycpKGFwcCk7XG4vLyBSdW4gdGhlIGFwcCBieSBzZXJ2aW5nIHRoZSBzdGF0aWMgZmlsZXNcbi8vIGluIHRoZSBkaXN0IGRpcmVjdG9yeVxuYXBwLnVzZShleHByZXNzLnN0YXRpYyhfX2Rpcm5hbWUgKyAnL2Rpc3QnKSk7XG4vLyBTdGFydCB0aGUgYXBwIGJ5IGxpc3RlbmluZyBvbiB0aGUgZGVmYXVsdFxuLy8gSGVyb2t1IHBvcnRcbmNvbnN0IGZvcmNlU1NMID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICBpZiAocmVxLmhlYWRlcnNbJ3gtZm9yd2FyZGVkLXByb3RvJ10gIT09ICdodHRwcycpIHtcbiAgICAgIHJldHVybiByZXMucmVkaXJlY3QoXG4gICAgICAgWydodHRwczovLycsIHJlcS5nZXQoJ0hvc3QnKSwgcmVxLnVybF0uam9pbignJylcbiAgICAgICk7XG4gICAgfVxuICAgIG5leHQoKTtcbiAgfVxufVxuLy8gSW5zdHJ1Y3QgdGhlIGFwcFxuLy8gdG8gdXNlIHRoZSBmb3JjZVNTTFxuLy8gbWlkZGxld2FyZVxuLy9hcHAudXNlKGZvcmNlU1NMKCkpO1xuXG5hcHAuZ2V0KCcvJywocmVxLHJlcyk9PntcbiAgcmVzLnNlbmRGaWxlKF9fZGlybmFtZSArICcvZGlzdC9zcmMvaW5kZXguaHRtbCcpO1xufSlcblxuaW1wb3J0IHsgTWVzc2FnZSwgQ2hhdFJvb20gfSBmcm9tICcuL0NoYXRSb29tJztcblxubGV0IGNoYXRSb29tczpDaGF0Um9vbVtdID0gW107Ly9BcnJheSBvZiBDaGF0Um9vbXNcbmxldCB0b3RhbDpudW1iZXIgPSAwOyAvL1RvdGFsIG9mIHVzZXJzIGNvbm5lY3RlZFxuXG5hcHAud3MoJy9zb2NrZXQnLChjb25uLHJlcSk9Pntcblx0Ly9uZXcgdXNlciBlbnRlcmVkIHRoZSB3ZWJzaXRlLiBjb25uIGlzIHRoZSB1c2VyJ3MgY29ubmVjdGlvblxuXHRsZXQgY3VycmVudENoYXRSb29tOkNoYXRSb29tOyAvL1RoaXMgdmFyaWFibGUgd2lsbCBob2xkIHRoZSBjdXJyZW50IHVzZXIncyBDaGF0Um9vbVxuXHRpZihjaGF0Um9vbXMubGVuZ3RoID09PSAwKXsgLy9ObyBjaGF0Um9vbXMgeWV0XG5cdFx0Y29uc29sZS5sb2coJ25vIGNoYXQgcm9vbXMuIExldCB1cyBjcmVhdGUgb25lJyk7XG5cdFx0bGV0IGNoYXRSb29tID0gbmV3IENoYXRSb29tKGNvbm4sNCk7IC8vY3JlYXRlIG9uZSwgcGFzcyB1c2VyIGFzIGFyZ3VtZW50IHNvIGhlJ2xsIGJlIHRoaXMgcm9vbSdzIG1hc3RlclxuXHRcdGNoYXRSb29tcy5wdXNoKGNoYXRSb29tKTsvL3NhdmUgbmV3IHJvb20gaW4gdGhlIGFycmF5XG5cdFx0Y3VycmVudENoYXRSb29tID0gY2hhdFJvb207Ly9zYXZlIHJlZmVyZW5jZSB0byB0aGlzIHJvb20gYXMgY3VycmVudCByb29tXG5cdH1lbHNleyAvLyBUaGVyZSBpcyBvbmUgb3IgbW9yZSBjaGF0Um9vbXNcblx0XHRjb25zb2xlLmxvZygnV2UgaGF2ZSBzb21lIGNoYXRSb29tcy4gbGV0IHVzIGZpbmQgdGhlIGZpcnN0IG9uZSB3aXRoIGxlc3MgcGVvcGxlIHRoYW4gdGhlIGxpbWl0Jyk7XG5cdFx0bGV0IGZvdW5kOmJvb2xlYW4gPSBmYWxzZTsgLy9GbGFnIHRvIHNpZ25hbCBpZiB3ZSBoYXZlIGZvdW5kIGEgY2hhdFJvb20gd2l0aCBzcGFjZVxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBjaGF0Um9vbXMubGVuZ3RoOyBpKyspeyAvL0ZvciBldmVyeSBjaGF0Um9vbVxuXHRcdFx0bGV0IGNoYXRSb29tID0gY2hhdFJvb21zW2ldOyAvL3NhdmUgcmVmZXJlbmNlXG5cdFx0XHRjb25zb2xlLmxvZygnY2hhdCByb29tIG51bWJlcicsaSwnIC0gJyxjaGF0Um9vbS5jb3VudCwnIG91dCBvZiAnLGNoYXRSb29tLmxpbWl0KTtcblx0XHRcdGlmKGNoYXRSb29tLmNvdW50IDwgY2hhdFJvb20ubGltaXQpeyAvL2lmIGN1cnJlbnQgbnVtYmVyIGlzIHNtYWxsZXIgdGhhbiBsaW1pdFxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInRoZXJlJ3Mgc3BhY2UuIExldCdzIGFkZCB0aGlzIGd1eSBoZXJlXCIpO1xuXHRcdFx0XHRjaGF0Um9vbS5hZGRVc2VyKGNvbm4pOy8vYWRkIHVzZXIgdG8gY2hhdFJvb21cblx0XHRcdFx0Y3VycmVudENoYXRSb29tID0gY2hhdFJvb207IC8vc2F2ZSB0aGlzIGNoYXRSb29tIGFzIGN1cnJlbnRcblx0XHRcdFx0Zm91bmQgPSB0cnVlO1xuXHRcdFx0XHRicmVhazsgLy9icmVhayBvdXQgb2YgbG9vcC4gV2UgZG9uJ3QgbmVlZCB0byBsb29rIGludG8gdGhlIG5leHQgcm9vbXNcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoIWZvdW5kKXsvL0lmIHdlIGxvb2tlZCBpbnRvIGFsbCByb29tcyBidXQgdGhleSBkb24ndCBoYXZlIGFueSBzcGFjZS4uLlxuXHRcdFx0Y29uc29sZS5sb2coXCJBbGwgcm9vbXMgYXJlIGZ1bGwuIExldCdzIGNyZWF0ZSBhIG5ldyBvbmVcIik7XG5cdFx0XHRsZXQgY2hhdFJvb206Q2hhdFJvb20gPSBuZXcgQ2hhdFJvb20oY29ubiw0KTsvL2NyZWF0ZSBuZXcgcm9vbVxuXHRcdFx0Y2hhdFJvb21zLnB1c2goY2hhdFJvb20pOyAvL3B1c2ggaXQgaW50byBhcnJheVxuXHRcdFx0Y3VycmVudENoYXRSb29tID0gY2hhdFJvb207Ly9zYXZlIHRoaXMgY2hhdFJvb20gYXMgY3VycmVudFxuXHRcdH1cblx0fVxuXHR0b3RhbCsrOyAvL2FkZCB0byB0b3RhbCBvZiB1c2Vyc1xuXHRjb25zb2xlLmxvZygnTmV3IENoYXQgY29ubmVjdGlvbiBlc3RhYmxpc2hlZC4nLCBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpKTtcblxuXHQvL05vdywgbGV0J3MgaGFuZGxlIHVzZXIgYWN0aXZpdHlcblxuXHRjb25uLm9uKCd0ZXh0JywgZnVuY3Rpb24gKHRleHQ6c3RyaW5nKSB7Ly9pZiB3ZSByZWNlaXZlIHNvbWUgdGV4dCB0aHJvdWdoIHRoaXMgdXNlclxuXHRcdGxldCBtc2c6TWVzc2FnZSA9IEpTT04ucGFyc2UodGV4dCk7Ly9wYXJzZSBpdCBpbnRvIGEgSlMgb2JqZWN0XG5cdFx0Y3VycmVudENoYXRSb29tLnNlbmRNZXNzYWdlVG9BbGwobXNnKTsvL1NlbmQgdG8gYWxsIHVzZXJzIGluIHRoaXMgY2hhdFJvb21cblx0fSk7XG5cblx0Y29ubi5vbignY2xvc2UnLCBmdW5jdGlvbiAoY29kZTphbnksIHJlYXNvbjphbnkpIHsvL0lmIHRoaXMgdXNlciBkaXNjb25uZWN0cy4uLlxuXHRcdHRvdGFsLS07XG5cdFx0aWYoY29ubiA9PT0gY3VycmVudENoYXRSb29tLm1hc3RlciAmJiBjdXJyZW50Q2hhdFJvb20uY2xpZW50cy5sZW5ndGggPT09IDApey8vIG5vIHVzZXJzIGxlZnQsIGRlc3Ryb3kgcm9vbVxuXHRcdFx0bGV0IGluZGV4Om51bWJlciA9IGNoYXRSb29tcy5pbmRleE9mKGN1cnJlbnRDaGF0Um9vbSk7IC8vc2F2ZSByb29tJ3MgaW5kZXhcblx0XHRcdGNoYXRSb29tcy5zcGxpY2UoaW5kZXgsMSk7IC8vcmVtb3ZlIGl0IGZyb20gYXJyYXlcblx0XHR9ZWxzZSAvL0lmIHRoZXJlIGFyZSBzdGlsbCB1c2VycyBsZWZ0IGluIHRoaXMgcm9vbVxuXHRcdFx0Y3VycmVudENoYXRSb29tLnJlbW92ZVVzZXIoY29ubik7Ly9Sb29tIGhhbmRsZXMgcmVtb3ZpbmcgdGhlIHVzZXJcblx0XHRjb25zb2xlLmxvZygnQ2hhdCBjb25uZWN0aW9uIGNsb3NlZC4nLCBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpLCAnY29kZTogJywgY29kZSwgcmVhc29uKTtcblx0fSk7XG5cblx0Y29ubi5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyOmFueSkge1xuXHRcdC8vIE9ubHkgdGhyb3cgaWYgc29tZXRoaW5nIGVsc2UgaGFwcGVucyB0aGFuIENvbm5lY3Rpb24gUmVzZXRcblx0XHRpZiAoZXJyLmNvZGUgIT09ICdFQ09OTlJFU0VUJykge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGluIENoYXQgU29ja2V0IGNvbm5lY3Rpb24nLCBlcnIpO1xuXHRcdFx0dGhyb3cgIGVycjtcblx0XHR9XG5cdH0pXG5cbn0pO1xuYXBwLmxpc3Rlbig4MDgwKTtcbiJdfQ==