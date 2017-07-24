"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
function createSecretWord() {
    var dictionary = fs.readFileSync('./dictionary.txt').toString();
    var lines = dictionary.split('\n'); //splits it into an array
    var secretWord = lines[Math.floor(Math.random() * lines.length)]; //randomly selects a word from the array
    return secretWord;
}
var ChatRoom = (function () {
    function ChatRoom(master, limit) {
        this.master = master;
        this.limit = limit;
        this.secretWord = createSecretWord(); //uses the helper function to generate word
        this.count = 1; //master counts as first user in room
        this.clients = []; //initialize empty array of clients
        this.sendMessageToMaster({
            author: 'Server',
            message: 'You are the master of this room. Your word is ' + this.secretWord.toUpperCase() + '. Describe it, but do not write it.',
            newDate: new Date().toLocaleString(),
            role: 'Master',
            secretWord: this.secretWord
        });
    }
    ChatRoom.prototype.addUser = function (client) {
        if (this.count < this.limit) {
            this.clients.push(client); //push connection into array
            this.count++;
            client.sendText(JSON.stringify({
                author: 'Server',
                message: 'You are a player. Try to guess the word!',
                newDate: new Date().toLocaleString(),
                role: 'Player'
            }));
        }
    };
    ChatRoom.prototype.removeUser = function (client) {
        if (client === this.master) {
            this.master = this.clients[0]; //oldest client becomes master
            this.clients.shift(); //remove client from array. He's alone in the room now.
            this.sendMessageToMaster({
                author: 'Server',
                message: 'You are the master of this room. Your word is ' + this.secretWord.toUpperCase() + '. Describe it, but do not write it.',
                newDate: new Date().toLocaleString(),
                role: 'Master',
                secretWord: this.secretWord
            });
        }
        else {
            var index = this.clients.indexOf(client); //check what his index in the array is
            this.clients.splice(index, 1); //remove him
        }
        this.count--;
    };
    ChatRoom.prototype.sendMessageToMaster = function (message) {
        message.newDate = new Date().toLocaleString();
        if (this.master)
            this.master.sendText(JSON.stringify(message));
    };
    ChatRoom.prototype.sendMessageToAll = function (message) {
        //check if message contains correct answer
        var isWinningMsg = message.message.toLowerCase().includes(this.secretWord) ? true : false;
        var winningMsg = {
            author: 'Server',
            message: 'The secret word was guessed! ' + message.author + ' wins!' + ' The word was ' + this.secretWord.toUpperCase(),
            newDate: new Date().toLocaleString()
        };
        message.newDate = new Date().toLocaleString(); //add time to it
        this.clients.forEach(function (client) {
            client.sendText(JSON.stringify(message)); //send the message
            if (isWinningMsg) {
                client.sendText(JSON.stringify(winningMsg)); //if message is winningMsg, notify room
            }
        });
        this.sendMessageToMaster(message); //send original msg to master too
        if (isWinningMsg) {
            this.sendMessageToMaster(winningMsg); //notify master
            this.win(); //call win method to assign new roles and a new secret word
        }
    };
    ChatRoom.prototype.win = function () {
        this.sendMessageToMaster({
            author: 'Server',
            message: 'You are a player now. Try to guess the new word!',
            newDate: new Date().toLocaleString(),
            role: 'Player'
        });
        this.clients.push(this.master); //push him into clients array
        this.master = this.clients[0]; //make oldest client the master (implementing thus a queue)
        this.clients.shift(); //remove oldest client from array since he's now the master
        this.secretWord = createSecretWord(); //create new secret word
        this.sendMessageToMaster({
            author: 'Server',
            message: 'You are the master of this room. Your word is ' + this.secretWord.toUpperCase() + '. Describe it, but do not write it.',
            newDate: new Date().toLocaleString(),
            role: 'Master',
            secretWord: this.secretWord
        });
    };
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvZXZhbi9Qcm9qZWN0cy9ndWVzcy10aGUtd29yZC9DaGF0Um9vbS50cyIsInNvdXJjZXMiOlsiL2hvbWUvZXZhbi9Qcm9qZWN0cy9ndWVzcy10aGUtd29yZC9DaGF0Um9vbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUV0QjtJQUNDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoRSxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEseUJBQXlCO0lBQzVELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBLHdDQUF3QztJQUN6RyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ25CLENBQUM7QUFVRDtJQU1DLGtCQUFZLE1BQVUsRUFBQyxLQUFZO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLDJDQUEyQztRQUNqRixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFDQUFxQztRQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDLG1DQUFtQztRQUN0RCxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDeEIsTUFBTSxFQUFDLFFBQVE7WUFDZixPQUFPLEVBQUMsZ0RBQWdELEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsR0FBRyxxQ0FBcUM7WUFDaEksT0FBTyxFQUFDLElBQUksSUFBSSxF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QUFDLHdCQUF3QjtRQUM5RCxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDeEIsTUFBTSxFQUFDLFFBQVE7WUFDZixPQUFPLEVBQUMsZ0RBQWdELEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsR0FBRyxxQ0FBcUM7WUFDaEksT0FBTyxFQUFDLElBQUksSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFO1lBQ25DLElBQUksRUFBQyxRQUFRO1lBQ2IsVUFBVSxFQUFDLElBQUksQ0FBQyxVQUFVO1NBQzFCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFDRixlQUFDO0FBQUQsQ0FBQyxBQS9GRCxJQStGQztBQS9GWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImxldCBmcyA9IHJlcXVpcmUoJ2ZzJylcblxuZnVuY3Rpb24gY3JlYXRlU2VjcmV0V29yZCgpOnN0cmluZ3sgLy9GdW5jdGlvbiByZWFkcyBzeW5jaHJvbm91c2x5IGZyb20gZGljdGlvbmFyeS50eHRcblx0bGV0IGRpY3Rpb25hcnkgPSBmcy5yZWFkRmlsZVN5bmMoJy4vZGljdGlvbmFyeS50eHQnKS50b1N0cmluZygpO1xuXHRsZXQgbGluZXMgPSBkaWN0aW9uYXJ5LnNwbGl0KCdcXG4nKTsvL3NwbGl0cyBpdCBpbnRvIGFuIGFycmF5XG5cdGxldCBzZWNyZXRXb3JkID0gbGluZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGluZXMubGVuZ3RoKV07Ly9yYW5kb21seSBzZWxlY3RzIGEgd29yZCBmcm9tIHRoZSBhcnJheVxuXHRyZXR1cm4gc2VjcmV0V29yZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlIHtcblx0YXV0aG9yOiBzdHJpbmcsXG5cdG1lc3NhZ2U6IHN0cmluZyxcblx0bmV3RGF0ZT86IHN0cmluZyxcbiAgcm9sZT86c3RyaW5nLC8vTWFzdGVyIG9yIHBsYXllci4gVGhpcyB3aWxsIGJlIHVzZWQgdG8gYXNzaWduIHRoZSBjbGllbnQgdGhlaXIgcm9sZVxuICBzZWNyZXRXb3JkPzpzdHJpbmdcbn1cblxuZXhwb3J0IGNsYXNzIENoYXRSb29tIHtcblx0bWFzdGVyOmFueTsgLy9hIHNvY2tldCBjb25uZWN0aW9uXG5cdHNlY3JldFdvcmQ6c3RyaW5nO1xuXHRjbGllbnRzOkFycmF5PGFueT47Ly8gYW4gYXJyYXkgb2Ygc29ja2V0IGNvbm5lY3Rpb25zXG5cdGNvdW50Om51bWJlcjtcblx0bGltaXQ6bnVtYmVyO1xuXHRjb25zdHJ1Y3RvcihtYXN0ZXI6YW55LGxpbWl0Om51bWJlcil7IC8vdGFrZXMgYSBjb25uZWN0aW9uIGFuZCBhIGxpbWl0IGFzIGFyZ3VtZW50c1xuXHRcdHRoaXMubWFzdGVyID0gbWFzdGVyO1xuICAgIHRoaXMubGltaXQgPSBsaW1pdDtcblx0XHR0aGlzLnNlY3JldFdvcmQgPSBjcmVhdGVTZWNyZXRXb3JkKCk7IC8vdXNlcyB0aGUgaGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHdvcmRcblx0XHR0aGlzLmNvdW50ID0gMTsgLy9tYXN0ZXIgY291bnRzIGFzIGZpcnN0IHVzZXIgaW4gcm9vbVxuXHRcdHRoaXMuY2xpZW50cyA9IFtdOyAvL2luaXRpYWxpemUgZW1wdHkgYXJyYXkgb2YgY2xpZW50c1xuXHRcdHRoaXMuc2VuZE1lc3NhZ2VUb01hc3Rlcih7IC8vc2VuZCBhIG1lc3NhZ2UgdG8gbWFzdGVyIHRvIHN0YXJ0IGdhbWVcblx0XHRcdGF1dGhvcjonU2VydmVyJyxcblx0XHRcdG1lc3NhZ2U6J1lvdSBhcmUgdGhlIG1hc3RlciBvZiB0aGlzIHJvb20uIFlvdXIgd29yZCBpcyAnICsgdGhpcy5zZWNyZXRXb3JkLnRvVXBwZXJDYXNlKCkgKyAnLiBEZXNjcmliZSBpdCwgYnV0IGRvIG5vdCB3cml0ZSBpdC4nLFxuXHRcdFx0bmV3RGF0ZTpuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCksXG5cdFx0XHRyb2xlOidNYXN0ZXInLFxuXHRcdFx0c2VjcmV0V29yZDp0aGlzLnNlY3JldFdvcmRcblx0XHR9KTtcblx0fVxuXHRhZGRVc2VyKGNsaWVudDphbnkpey8vTWV0aG9kIHRvIGFkZCBhIHVzZXIuIFRha2VzIGEgY29ubmVjdGlvbiBhcyBhcmd1bWVudFxuXHRcdGlmKHRoaXMuY291bnQgPCB0aGlzLmxpbWl0KXsvL2lmIG51bWJlciBvZiB1c2VycyBpcyBzbWFsbGVyIHRoYW4gbGltaXRcblx0XHRcdHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7Ly9wdXNoIGNvbm5lY3Rpb24gaW50byBhcnJheVxuXHRcdFx0dGhpcy5jb3VudCsrO1xuXHRcdFx0Y2xpZW50LnNlbmRUZXh0KEpTT04uc3RyaW5naWZ5KHsgLy9zZW5kIHRoaXMgbmV3Y29tZXIgYSBtZXNzYWdlXG5cdFx0XHRcdGF1dGhvcjonU2VydmVyJyxcblx0XHRcdFx0bWVzc2FnZTonWW91IGFyZSBhIHBsYXllci4gVHJ5IHRvIGd1ZXNzIHRoZSB3b3JkIScsXG5cdFx0XHRcdG5ld0RhdGU6bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpLFxuXHRcdFx0XHRyb2xlOidQbGF5ZXInXG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9XG5cdHJlbW92ZVVzZXIoY2xpZW50OmFueSl7IC8vbWV0aG9kIHRvIGFkZCBhIHVzZXJcblx0XHRpZihjbGllbnQgPT09IHRoaXMubWFzdGVyKXsgLy9pZiBjbGllbnQgaXMgbWFzdGVyXG5cdFx0XHR0aGlzLm1hc3RlciA9IHRoaXMuY2xpZW50c1swXTsgLy9vbGRlc3QgY2xpZW50IGJlY29tZXMgbWFzdGVyXG5cdFx0XHR0aGlzLmNsaWVudHMuc2hpZnQoKTsvL3JlbW92ZSBjbGllbnQgZnJvbSBhcnJheS4gSGUncyBhbG9uZSBpbiB0aGUgcm9vbSBub3cuXG5cdFx0XHR0aGlzLnNlbmRNZXNzYWdlVG9NYXN0ZXIoeyAvL3NlbmQgYSBtZXNzYWdlIHRvIG1hc3RlciB0byBzdGFydCBnYW1lXG5cdFx0XHRcdGF1dGhvcjonU2VydmVyJyxcblx0XHRcdFx0bWVzc2FnZTonWW91IGFyZSB0aGUgbWFzdGVyIG9mIHRoaXMgcm9vbS4gWW91ciB3b3JkIGlzICcgKyB0aGlzLnNlY3JldFdvcmQudG9VcHBlckNhc2UoKSArICcuIERlc2NyaWJlIGl0LCBidXQgZG8gbm90IHdyaXRlIGl0LicsXG5cdFx0XHRcdG5ld0RhdGU6bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpLFxuXHRcdFx0XHRyb2xlOidNYXN0ZXInLFxuXHRcdFx0XHRzZWNyZXRXb3JkOnRoaXMuc2VjcmV0V29yZFxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7IC8vaWYgY2xpZW50IHRoYXQgaXMgbGVhdmluZyBpcyBub3QgdGhlIG1hc3RlclxuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTsgLy9jaGVjayB3aGF0IGhpcyBpbmRleCBpbiB0aGUgYXJyYXkgaXNcblx0XHRcdHRoaXMuY2xpZW50cy5zcGxpY2UoaW5kZXgsMSk7Ly9yZW1vdmUgaGltXG5cdFx0fVxuXHRcdHRoaXMuY291bnQtLTtcblx0fVxuXHRzZW5kTWVzc2FnZVRvTWFzdGVyKG1lc3NhZ2U6TWVzc2FnZSl7Ly9tZXRob2QgdG8gbWVzc2FnZSB0aGUgcm9vbSdzIG1hc3RlclxuXHRcdG1lc3NhZ2UubmV3RGF0ZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKTtcblx0XHRpZih0aGlzLm1hc3Rlcilcblx0XHRcdHRoaXMubWFzdGVyLnNlbmRUZXh0KEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcblx0fVxuXHRzZW5kTWVzc2FnZVRvQWxsKG1lc3NhZ2U6TWVzc2FnZSl7Ly9tZXRob2QgdG8gbWVzc2FnZSBhbGwgaW4gdGhlIHJvb20uIE1vc3QgbWVzc2FnZXMgd2lsbCBwYXNzIHRocm91Z2ggdGhpc1xuICAgIC8vY2hlY2sgaWYgbWVzc2FnZSBjb250YWlucyBjb3JyZWN0IGFuc3dlclxuICAgIGxldCBpc1dpbm5pbmdNc2c6Ym9vbGVhbiA9IG1lc3NhZ2UubWVzc2FnZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRoaXMuc2VjcmV0V29yZCkgPyB0cnVlIDogZmFsc2U7XG4gICAgbGV0IHdpbm5pbmdNc2cgPSB7XG4gICAgICBhdXRob3I6ICdTZXJ2ZXInLFxuICAgICAgbWVzc2FnZTogJ1RoZSBzZWNyZXQgd29yZCB3YXMgZ3Vlc3NlZCEgJyArIG1lc3NhZ2UuYXV0aG9yICsgJyB3aW5zIScgKyAnIFRoZSB3b3JkIHdhcyAnICsgdGhpcy5zZWNyZXRXb3JkLnRvVXBwZXJDYXNlKCksXG4gICAgICBuZXdEYXRlOiBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICB9O1xuICAgIG1lc3NhZ2UubmV3RGF0ZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKTsgLy9hZGQgdGltZSB0byBpdFxuXHRcdHRoaXMuY2xpZW50cy5mb3JFYWNoKGNsaWVudD0+ey8vZm9yIGV2ZXJ5IGNsaWVudFxuXHRcdFx0Y2xpZW50LnNlbmRUZXh0KEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTsvL3NlbmQgdGhlIG1lc3NhZ2Vcblx0XHRcdGlmKGlzV2lubmluZ01zZyl7XG5cdFx0XHRcdGNsaWVudC5zZW5kVGV4dChKU09OLnN0cmluZ2lmeSh3aW5uaW5nTXNnKSk7Ly9pZiBtZXNzYWdlIGlzIHdpbm5pbmdNc2csIG5vdGlmeSByb29tXG5cdFx0XHR9XG5cdFx0fSk7XG4gICAgdGhpcy5zZW5kTWVzc2FnZVRvTWFzdGVyKG1lc3NhZ2UpOyAvL3NlbmQgb3JpZ2luYWwgbXNnIHRvIG1hc3RlciB0b29cbiAgICBpZihpc1dpbm5pbmdNc2cpeyAvL2lmIGl0J3Mgd2lubmluZyBtZXNzYWdlXG4gICAgICB0aGlzLnNlbmRNZXNzYWdlVG9NYXN0ZXIod2lubmluZ01zZyk7IC8vbm90aWZ5IG1hc3RlclxuICAgICAgdGhpcy53aW4oKTsvL2NhbGwgd2luIG1ldGhvZCB0byBhc3NpZ24gbmV3IHJvbGVzIGFuZCBhIG5ldyBzZWNyZXQgd29yZFxuICAgIH1cblx0fVxuXHR3aW4oKXsgLy9tZXRob2QgY2FsbGVkIHdoZW4gd29yZCBpcyBndWVzc2VkXG5cblx0XHR0aGlzLnNlbmRNZXNzYWdlVG9NYXN0ZXIoeyAvL25vdGlmeSBtYXN0ZXIgdGhhdCBoZSdzIG5vdyBhIHBsYXllclxuXHRcdFx0YXV0aG9yOidTZXJ2ZXInLFxuXHRcdFx0bWVzc2FnZTonWW91IGFyZSBhIHBsYXllciBub3cuIFRyeSB0byBndWVzcyB0aGUgbmV3IHdvcmQhJyxcblx0XHRcdG5ld0RhdGU6bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpLFxuXHRcdFx0cm9sZTonUGxheWVyJ1xuXHRcdH0pO1xuXHRcdHRoaXMuY2xpZW50cy5wdXNoKHRoaXMubWFzdGVyKTsgLy9wdXNoIGhpbSBpbnRvIGNsaWVudHMgYXJyYXlcblx0XHR0aGlzLm1hc3RlciA9IHRoaXMuY2xpZW50c1swXTsgLy9tYWtlIG9sZGVzdCBjbGllbnQgdGhlIG1hc3RlciAoaW1wbGVtZW50aW5nIHRodXMgYSBxdWV1ZSlcblx0XHR0aGlzLmNsaWVudHMuc2hpZnQoKTsvL3JlbW92ZSBvbGRlc3QgY2xpZW50IGZyb20gYXJyYXkgc2luY2UgaGUncyBub3cgdGhlIG1hc3RlclxuXHRcdHRoaXMuc2VjcmV0V29yZCA9IGNyZWF0ZVNlY3JldFdvcmQoKTsgLy9jcmVhdGUgbmV3IHNlY3JldCB3b3JkXG5cdFx0dGhpcy5zZW5kTWVzc2FnZVRvTWFzdGVyKHsgLy9ub3RpZnkgbmV3IG1hc3RlciBvZiBoaXMgcm9sZSBhbmQgc2VjcmV0IHdvcmRcblx0XHRcdGF1dGhvcjonU2VydmVyJyxcblx0XHRcdG1lc3NhZ2U6J1lvdSBhcmUgdGhlIG1hc3RlciBvZiB0aGlzIHJvb20uIFlvdXIgd29yZCBpcyAnICsgdGhpcy5zZWNyZXRXb3JkLnRvVXBwZXJDYXNlKCkgKyAnLiBEZXNjcmliZSBpdCwgYnV0IGRvIG5vdCB3cml0ZSBpdC4nLFxuXHRcdFx0bmV3RGF0ZTpuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKCksXG5cdFx0XHRyb2xlOidNYXN0ZXInLFxuXHRcdFx0c2VjcmV0V29yZDp0aGlzLnNlY3JldFdvcmRcblx0XHR9KTtcblx0fVxufVxuIl19