/**
 * @file: index.js
 * @description: This file sets up a Node.js server with Express, HTTP, and Socket.IO to manage real-time communication in a 
 *               collaborative Ficitonary Game. It initializes the server, configures Socket.IO for handling WebSocket 
 *               connections, and manages user interactions rooms...TBD
 * @author: Ali Al-Jabur
 * @createdOn: 2024-02-03
 * @lastModified: 2024-02-12
 * @remarks: Ensure that all necessary node modules are installed and environment variables are set before running this file. 
 *           It listens on port 3000 for incoming connections.
 */

require("dotenv").config();
const FRONTEND_URL = process.env.FRONTEND_URL;
console.log(process.env.DATABASE_USER);
// console.log(process.env.DATABASE_PASSWORD);

// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const cors = require('cors');
const seedrandom = require('seedrandom'); //seed random generation
//Mongo DB conection
const { MongoClient } = require("mongodb");
const dbUser = process.env.DATABASE_USER;
const dbPass = process.env.DATABASE_PASSWORD; //Make sure these work on deployment
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster.ieggqf8.mongodb.net/?retryWrites=true&w=majority&appName=cluster`;
const client = new MongoClient(uri);
const bodyParser = require('body-parser');


//getWords testing
async function getWords() {
  try {
    const database = client.db('FictionaryDB');
    const words = database.collection('words');
    const category = 'animals'; //TODO: will be changed by request param
    // Query for a word for given category
    const cursor = words.find({ category: category }).project({ word: 1, _id: 0 });

    let wordsFromcategory = [];

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      wordsFromcategory.push(doc['word']);
      //console.log(doc['word']);
    }

    //get random word
    //let random = Math.floor(Math.random() * wordsFromCategory.length);
    //randomWord = wordsFromCategory[random]; //get random words

  } finally {
    await client.close();
  }
}
//getWords().catch(console.dir);

// Initialize Express app, HTTP server, and Socket.IO
const app = express();
//app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, methods: ["GET"] })) //Allow CORS  -> Swap url later (needs to be front end url)
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allowing cross-origin requests
    methods: ["GET", "POST"]
  }
});

//getWords testing
async function getWords(){
  try{
    //make new connection
    await client.connect();

    const database = client.db('FictionaryDB');
    const words = database.collection('words');
    const category = 'animals'; //TODO: will be changed by request param
    // Query for a word for given category
    const cursor = words.find({category: category}).project({word:1 , _id:0});

    let wordsFromCategory = [];

    while(await cursor.hasNext()){
      const doc = await cursor.next();
      wordsFromCategory.push(doc['word']);
      //console.log(doc['word']);
    }
    
    //get random word
    let random = Math.floor(Math.random() * wordsFromCategory.length);
    randomWord = wordsFromCategory[random]; 
    console.log("random word:"+randomWord);
  } catch (error) {
    console.log(error);
  }
}
//getWords().catch(console.dir);

//get categories
app.get('/categories', (req, res) => {
  async function run() {
    //New connection
    await client.connect();
    const theSeed = req.query.seed;
    //console.log("seed:" + theSeed);

    try {
      const database = client.db('FictionaryDB');
      const words = database.collection('words');
      // Query for a distinct categories
      const categories = await words.distinct('category');
      let randomCategories = [];

      //get 3 random items from the list
      for (let i = 0; i < 3; i++) {
        const rng = seedrandom(theSeed);
        //console.log(rng());
        let random = Math.floor(rng() * categories.length - 1);
        randomCategories = randomCategories.concat(categories.splice(random, 1));
      }

      //console.log(randomCategories);
      let myJson = JSON.stringify(randomCategories);
      //console.log(myJson);
      res.send(myJson);//convert to json before sending
    } catch(error) {
      // Ensures that the client will close when you finish/error
      console.log(error);
    }
  }
  run().catch(console.dir);
})

//get words
//takes in category param
app.get('/words',(req,res)=>{
  async function getWords(){
    try{
      await client.connect();

      const theSeed = req.query.seed; //retrieve seed

      const chosenCategory = req.query.category;//retrieve category param

      const database = client.db('FictionaryDB');
      const words = database.collection('words');
      //const category = 'animals'; //TODO: will be changed by request param
      // Query for a word for given category
      const cursor = words.find({category: chosenCategory}).project({word:1 , _id:0});
  
      let wordsFromCategory = [];
      let randomWord;
  
      while(await cursor.hasNext()){

        const doc = await cursor.next();
        wordsFromCategory.push(doc['word']);
        //console.log(doc['word']); //uncomment it you want to see the list of words
      }

      await cursor.close();
      //get random word
      const rng = seedrandom(theSeed);
      let random = Math.floor(rng() * wordsFromCategory.length - 1); 
      //let random = Math.floor(Math.random() * wordsFromCategory.length);
      randomWord = wordsFromCategory[random]; //get random word

      //send
      let myJson = JSON.stringify(randomWord);
      //console.log(myJson);
      res.send(myJson);//convert to json before sending
  
    }catch (error) {
      console.log(error);
    }
  }
  getWords().catch(console.dir);
})

// add room ids to database
app.use(bodyParser.json());
app.post('/addRoomId', async (req, res) => {
  const { roomId } = req.body;
  try {
    await client.connect();
    const database = client.db('FictionaryDB');
    const roomsCollection = database.collection('rooms');

    const result = await roomsCollection.insertOne({ roomId });
    res.status(200).json({ message: 'RoomId received successfully', roomId });
  } catch (error) {
    console.error('Error adding roomId to database:', error);
    res.status(500).json({ error: 'Failed to add roomId to database' });
  } finally {
    await client.close();
  }

});

// 
app.get('/validateRoom/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    // Connect to MongoDB
    await client.connect();

    // Access database and collection
    const database = client.db('FictionaryDB');
    const roomsCollection = database.collection('rooms');

    // Check if room ID exists in the collection
    const room = await roomsCollection.findOne({ roomId });

    if (room) {
      // Room ID exists, return success response
      res.status(200).json({ message: 'Room ID is valid' });
    } else {
      // Room ID does not exist, return error response
      res.status(404).json({ error: 'Room ID not found' });
    }
  } catch (error) {
    console.error('Error validating room ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
});
// Modified object to track users in rooms, including their names
const roomUsers = {};
const gameState = {};
const roomGuesses = {};
let gameStart = {};

const chatLog = {};
let chatLogToString = "";

const submits = {};
const roundCount = {};
const status = {};
const canvasImage = {};


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.emit('yourSocketId', { id: socket.id });

  socket.on("greatDocumentation", () => {
    socket.emit("GREATDOCUMENTATION", {id: socket.id});
  })

  // Modified event listener for joining a room, now includes userName
  socket.on('joinRoom', ({ userid, room, userName }) => {
    if(!gameStart[room]) {
      gameStart[room] = { isStarted: false };
    }
    if(!gameStart[room].isStarted) {
    socket.join(room);
    roomUsers[room] = roomUsers[room] || [];
    roomGuesses[room] = roomGuesses[room] || [];
    const isHost = roomUsers[room].length === 0; // First user to join is the host
    const totalScore = 0;
    const trickScore = 0;
    const artScore = 0;
    roomUsers[room].push({ id: userid, name: userName, isHost, totalScore, trickScore, artScore });

    console.log(roomUsers[room]);
    // Broadcast updated user list to the room
    io.to(room).emit('updateUserList', roomUsers[room].map(user => ({
      id: user.id,
      name: user.name,
      isHost: user.isHost,
      totalScore: user.totalScore,
      trickScore: user.trickScore,
      artScore: user.artScore
    })));
    // Grant drawing privilege to the host
    if (isHost) {
      socket.emit('drawingPrivilege', true);
    }

    console.log(`User ${socket.id} (${userName}) joined room: ${room}`);
  }
  });
  // Listen for game start event, only allow host to start
  socket.on('startGame', (room) => {
    if (roomUsers[room] && roomUsers[room][0].id === socket.id) { // Check if sender is the host
      if (roomUsers[room].length >= 3) { // Check for minimum number of participants
        if(!gameStart[room].isStarted) {
          gameStart[room].isStarted = true;
        }
        // initalize variables
        submits[room] = 0;
        roundCount[room] = 0;
        status[room] = false;
        io.to(room).emit('gameStarted');
      } else {
        socket.emit('error', 'Not enough players to start the game.');
      }
    }
  });

  socket.on('requestUserList', (roomId) => {
    console.log("Requesting user list for room:", roomId);
    // Check if the room exists and has users
    if (roomUsers[roomId]) {
      // Emit an event to the requesting socket with the current user list
      socket.emit('updateUserList', roomUsers[roomId].map(user => ({
        id: user.id,
        name: user.name,
        isHost: user.isHost,
        totalScore: user.totalScore,
        trickScore: user.trickScore,
        artScore: user.artScore
      })));
    } else {
      socket.emit('error', 'Room not found or no users in room.');
    }
  });

  socket.on('voteCategory', ({ roomId, category }) => {
    submits[roomId]++;
   // console.log(roomId, category);
    if (!gameState[roomId]) {
      gameState[roomId] = { votes: {} }; // Initialize if not present
    }

    // Initialize votes for the category if not present
    if (!gameState[roomId].votes[category]) {
      gameState[roomId].votes[category] = 0;
    }

    gameState[roomId].votes[category] += 1; // Increment vote count
    if(submits[roomId] == roomUsers[roomId].length) {
      submits[roomId] = 0;
      io.to(roomId).emit('allVoted', submits[roomId]);
    }
    // Optional: Broadcast updated votes to the room if desired
    // io.to(roomId).emit('updateVotes', gameState[roomId].votes);
  });

  socket.on('endVoting', (roomId) => {
    if (gameState[roomId] && gameState[roomId].votes) {
      const votes = gameState[roomId].votes;
      const categories = Object.keys(votes);
      let maxVotes = 0;
      let winningCategories = [];

      categories.forEach(category => {
        if (votes[category] > maxVotes) {
          winningCategories = [category];
          maxVotes = votes[category];
        } else if (votes[category] === maxVotes) {
          winningCategories.push(category);
        }
      });

      // Handle ties by selecting randomly
      const selectedCategory = winningCategories[Math.floor(Math.random() * winningCategories.length)];

      // Store the selected category in the gameState object
      gameState[roomId].selectedCategory = selectedCategory;

      // Broadcast the selected category to the room
      io.to(roomId).emit('categorySelected', selectedCategory);
    }
  });

  socket.on('requestCurrentCategory', (roomId) => {
    if (gameState[roomId] && gameState[roomId].selectedCategory) {
      socket.emit('currentCategory', gameState[roomId].selectedCategory);
    }
  });
  socket.on('draw', (data) => {
    //console.log("Draw Emitted");
    if (roomUsers[data.room]) {
      const user = roomUsers[data.room].find(user => user.id === socket.id);

      if (user && user.isHost) {
        //console.log(data);
        socket.to(data.room).emit('drawing', data);
      }
    }
  });

  socket.on('sendMessage', ({room, chat}) => {
    // chatLog[chatLog.length] = chat;
    chatLog[room] = chatLog[room] || [];
    chatLog[room].push(chat);
    // console.log("Index of user: " + index);
    let chatTemp = "";
    for(let i = 0 ; i < chatLog[room].length ; i++)
    {
      chatTemp += (chatLog[room][i] + "\n");
      // console.log("chat data:\n" + chatTemp);
    }
    chatLogToString = chatTemp;

    io.to(room).emit('getChat', chatLogToString);
  });

  // Listener to update the scores of players after submitting their votes on guesses
  socket.on('updateScores', ({ room, authorId, voterId }) => {
    const author = roomUsers[room][roomUsers[room].findIndex(user => user.id === authorId)];
    const voter = roomUsers[room][roomUsers[room].findIndex(user => user.id === voterId)];

    // checking the role of the author
    if (author.isHost) {
      // the voter gains a single bonus point that doesn't count towards either hidden score
      voter.totalScore++;

      // The author (in this case, the artist) gains two artist points [hidden] as well as two more points for their visible score
      author.artScore += 2;
      author.totalScore += 2;
    }
    else {
      // if the voter's total score is already 0, they cannot lose more points
      if (voter.totalScore > 0) {
        // the voter's total score is reduced to simulate the author stealing them for their total score
        voter.totalScore--;
      }
      // The author's trickster score [hidden] and total score [visible] go up by the same amount of points they just "stole" from the voter
      author.trickScore++;
      author.totalScore++;
    }

    console.log(`updateScores:`);
    console.log(roomUsers[room]);

    // Broadcast updated user list to the room
    io.to(room).emit('updateUserList', roomUsers[room].map(user => ({
      id: user.id,
      name: user.name,
      isHost: user.isHost,
      totalScore: user.totalScore,
      trickScore: user.trickScore,
      artScore: user.artScore
    })));
  }); 


  // method that adds a new guess onto the end of the guess array
  socket.on('submitGuess', ({room, guess}) => {
    console.log(`submitGuess room: ${room}, guess: ${guess}`);
    roomGuesses[room].push({text: guess, userId: socket.id, voterIds: []});

    // emitting the new guess list out into the room for other players
    io.to(room).emit('updateGuesses', roomGuesses[room].map(guess => ({ //null?
      text: guess.text,
      userId: guess.userId,
      voterIds: guess.voterIds.map(id => ({voterId: id}))
    })));
  });

  // method to change the guesses array when a guess button is selected
  socket.on('changeGuesses', ({room, authorId, voterId}) => {
    // will remove a voters id if it was already associated with another guess (voter can only select one guess)
    //Print guess
    console.log("Result.js - Guesses: "+JSON.stringify(roomGuesses[room], null, 2));//FINE
    roomGuesses[room].map((guess) => { // roomGuesses[room] = 
      if(guess.voterIds.find((id) => id === voterId)){
        let index = guess.voterIds.indexOf(voterId);
        guess.voterIds.splice(index, 1);
      }
    });
    console.log("Result.js - Guesses again!: "+JSON.stringify(roomGuesses[room], null, 2));//NOT FINE
    // adds the voters id to the voterids array inside of the guess
    roomGuesses[room].map((guess) => {
      if(guess.userId === authorId){ //GUESS IS NULL
        guess.voterIds.push({voterId: voterId});
      }
    });
    // roomGuesses[room] = roomGuesses[room].map((guess) => {
    //   if(guess.userId === authorId){
    //     guess.voterIds.push({voterId: voterId});
    //   }
    // });

    // emiting the new guess list to the room for other players
    io.to(room).emit('updateGuesses', roomGuesses[room].map(guess => ({
      text: guess.text,
      userId: guess.userId,
      voterIds: guess.voterIds.map(id => ({voterId: id}))
    })));
  });

  
//this is for the guessing on the drawing page
  socket.on('guessSubmitted', ( {room} ) => {
    submits[room]++;
    if(submits[room] == (roomUsers[room].length - 1) && status[room]) {
      submits[room] = 0;
      //this never fired
      io.to(room).emit('allGuessed', submits[room]);
    }
  });

  socket.on('drawingSubmitted', ( {room, base64} ) => {
    status[room] = true;
    canvasImage[room] = base64;
    io.to(room).emit('timeToGuess', status[room]);
  });

  socket.on('getCanvas',  ({room} ) => {
    io.to(room).emit('returnCanvas', canvasImage[room]);
  });

  // this is for the voting on the voting page
  socket.on('voteSubmitted', ( {room} ) => {
    submits[room]++;
    if(submits[room] == roomUsers[room].length - 1) {
      submits[room] = 0;
      io.to(room).emit('votingDone', 'Voting is done');
    }
});


socket.on('resultsSubmitted', ( {room} ) => {
  submits[room]++;
  if(submits[room] == roomUsers[room].length) {
    submits[room] = 0;
    io.to(room).emit('resultsDone', 'results are done');
  }
});

socket.on('scoreSubmitted', ( {room} ) => {
  submits[room]++;
  if(submits[room] == roomUsers[room].length) {
    roomGuesses[room].length = 0;
    submits[room] = 0;
    roundCount[room]++;
    io.to(room).emit('scoreDone', roundCount[room]);
  }
});
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    for (const room in roomUsers) {
      const index = roomUsers[room].findIndex(user => user.id === socket.id);
      if (index !== -1) {
        const wasHost = roomUsers[room][index].isHost;
        roomUsers[room].splice(index, 1);
        // Broadcast updated user list
        io.to(room).emit('updateUserList', roomUsers[room].map(user => ({ id: user.id, name: user.name, isHost: user.isHost, totalScore: user.totalScore, trickScore: user.trickScore, artScore: user.artScore })));
        // If the host disconnected, pass host and drawing privilege to the next user
        if (wasHost && roomUsers[room].length > 0) {
          roomUsers[room][0].isHost = true; // Designate new host
          io.to(roomUsers[room][0].id).emit('drawingPrivilege', true);
          // Notify users of the new host
          io.to(room).emit('updateUserList', roomUsers[room].map(user => ({ id: user.id, name: user.name, isHost: user.isHost, totalScore: user.totalScore, trickScore: user.trickScore, artScore: user.artScore })));
        }
        break;
      }
    }
  });
});

// Start the server
server.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});
