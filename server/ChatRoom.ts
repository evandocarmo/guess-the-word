let fs = require('fs')

function createSecretWord():string{ //Function reads synchronously from dictionary.txt
	let dictionary = fs.readFileSync('./dictionary.txt').toString();
	let lines = dictionary.split('\n');//splits it into an array
	let secretWord = lines[Math.floor(Math.random() * lines.length)];//randomly selects a word from the array
	return secretWord;
}

export interface Message {
	author: string,
	message: string,
	newDate?: string,
  role?:string,//Master or player. This will be used to assign the client their role
  secretWord?:string
}

export class ChatRoom {
	master:any; //a socket connection
	secretWord:string;
	clients:Array<any>;// an array of socket connections
	count:number;
	limit:number;
	constructor(master:any,limit:number){ //takes a connection and a limit as arguments
		this.master = master;
    this.limit = limit;
		this.secretWord = createSecretWord(); //uses the helper function to generate word
		this.count = 1; //master counts as first user in room
		this.clients = []; //initialize empty array of clients
		this.sendMessageToMaster({ //send a message to master to start game
			author:'Server',
			message:'You are the master of this room. Your word is ' + this.secretWord.toUpperCase() + '. Describe it, but do not write it.',
			newDate:new Date().toLocaleString(),
			role:'Master',
			secretWord:this.secretWord
		});
	}
	addUser(client:any){//Method to add a user. Takes a connection as argument
		if(this.count < this.limit){//if number of users is smaller than limit
			this.clients.push(client);//push connection into array
			this.count++;
			client.sendText(JSON.stringify({ //send this newcomer a message
				author:'Server',
				message:'You are a player. Try to guess the word!',
				newDate:new Date().toLocaleString(),
				role:'Player'
			}));
		}
	}
	removeUser(client:any){ //method to add a user
		if(client === this.master){ //if client is master
			this.master = this.clients[0]; //oldest client becomes master
			this.clients.shift();//remove client from array. He's alone in the room now.
			this.sendMessageToMaster({ //send a message to master to start game
				author:'Server',
				message:'You are the master of this room. Your word is ' + this.secretWord.toUpperCase() + '. Describe it, but do not write it.',
				newDate:new Date().toLocaleString(),
				role:'Master',
				secretWord:this.secretWord
			});
		}else{ //if client that is leaving is not the master
			let index = this.clients.indexOf(client); //check what his index in the array is
			this.clients.splice(index,1);//remove him
		}
		this.count--;
	}
	sendMessageToMaster(message:Message){//method to message the room's master
		message.newDate = new Date().toLocaleString();
		if(this.master)
			this.master.sendText(JSON.stringify(message));
	}
	sendMessageToAll(message:Message){//method to message all in the room. Most messages will pass through this
    //check if message contains correct answer
    let isWinningMsg:boolean = message.message.toLowerCase().includes(this.secretWord) ? true : false;
    let winningMsg = {
      author: 'Server',
      message: 'The secret word was guessed! ' + message.author + ' wins!' + ' The word was ' + this.secretWord.toUpperCase(),
      newDate: new Date().toLocaleString()
    };
    message.newDate = new Date().toLocaleString(); //add time to it
		this.clients.forEach(client=>{//for every client
			client.sendText(JSON.stringify(message));//send the message
			if(isWinningMsg){
				client.sendText(JSON.stringify(winningMsg));//if message is winningMsg, notify room
			}
		});
    this.sendMessageToMaster(message); //send original msg to master too
    if(isWinningMsg){ //if it's winning message
      this.sendMessageToMaster(winningMsg); //notify master
      this.win();//call win method to assign new roles and a new secret word
    }
	}
	win(){ //method called when word is guessed

		this.sendMessageToMaster({ //notify master that he's now a player
			author:'Server',
			message:'You are a player now. Try to guess the new word!',
			newDate:new Date().toLocaleString(),
			role:'Player'
		});
		this.clients.push(this.master); //push him into clients array
		this.master = this.clients[0]; //make oldest client the master (implementing thus a queue)
		this.clients.shift();//remove oldest client from array since he's now the master
		this.secretWord = createSecretWord(); //create new secret word
		this.sendMessageToMaster({ //notify new master of his role and secret word
			author:'Server',
			message:'You are the master of this room. Your word is ' + this.secretWord.toUpperCase() + '. Describe it, but do not write it.',
			newDate:new Date().toLocaleString(),
			role:'Master',
			secretWord:this.secretWord
		});
	}
}
