"use strict";
exports.__esModule = true;
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
            client.send(JSON.stringify({
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
            this.master.send(JSON.stringify(message));
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
            client.send(JSON.stringify(message)); //send the message
            if (isWinningMsg) {
                client.send(JSON.stringify(winningMsg)); //if message is winningMsg, notify room
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
