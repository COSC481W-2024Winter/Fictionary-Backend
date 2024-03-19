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

//getWords testing
async function getWords(){
  try{
    const database = client.db('FictionaryDB');
    const words = database.collection('words');
    const category = 'animals'; //TODO: will be changed by request param
    // Query for a word for given category
    const cursor = words.find({category: category}).project({word:1 , _id:0});

    let wordsFromcategory = [];

    while(await cursor.hasNext()){
      const doc = await cursor.next();
      wordsFromcategory.push(doc['word']);
      console.log(doc['word']);
    }
    
    //get random word
    //let random = Math.floor(Math.random() * wordsFromCategory.length);
    //randomWord = wordsFromCategory[random]; //get random words

  }finally{
    await client.close();
  }
}
//getWords().catch(console.dir);

// Initialize Express app, HTTP server, and Socket.IO
const app = express();

app.use(cors({origin: "https://fictionary-frontend-lut5d.ondigitalocean.app/"})) //Allow CORS AAAAA -> Swap url later (needs to be front end url)
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allowing cross-origin requests
    methods: ["GET", "POST"]
  }
});

//get categories
app.get('/categories',(req,res)=>{
  async function run() {
    //New connection
    const client = new MongoClient(uri);
    const theSeed = req.query.seed;
    console.log("seed:"+theSeed);    

    try {
      const database = client.db('FictionaryDB');
      const words = database.collection('words');
      // Query for a distinct categories
      const categories = await words.distinct('category');
      let randomCategories = [];

      //get 3 random items from the list
      for(let i = 0; i < 3; i++ ){
        const rng = seedrandom(theSeed);
        console.log(rng());
        let random = Math.floor(rng() * categories.length - 1); 
        randomCategories = randomCategories.concat(categories.splice(random,1));
      }

      console.log(randomCategories);
      let myJson = JSON.stringify(randomCategories);
      //console.log(myJson);
      res.send(myJson);//convert to json before sending
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
})

//get words
//takes in category param
app.get('/words',(req,res)=>{
  async function getWords(){
    try{
      const chosenCategory = req.query.category;//retrieve category param

      const database = client.db('FictionaryDB');
      const words = database.collection('words');
      //const category = 'animals'; //TODO: will be changed by request param
      // Query for a word for given category
      const cursor = words.find({category: chosenCategory}).project({word:1 , _id:0});
  
      let wordsFromcategory = [];
  
      while(await cursor.hasNext()){
        const doc = await cursor.next();
        wordsFromcategory.push(doc['word']);
        console.log(doc['word']);
      }
      
      await cursor.close();
      //get random word
      //let random = Math.floor(Math.random() * wordsFromCategory.length);
      //randomWord = wordsFromCategory[random]; //get random words
  
    }finally{
      await client.close();
    }
  }
  getWords().catch(console.dir);
})

// Modified object to track users in rooms, including their names
const roomUsers = {};
const gameState = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.emit('yourSocketId', { id: socket.id });

  // Modified event listener for joining a room, now includes userName
  socket.on('joinRoom', ({ userid, room, userName }) => {
    socket.join(room);
    roomUsers[room] = roomUsers[room] || [];
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
  });
  // Listen for game start event, only allow host to start
  socket.on('startGame', (room) => {
    if (roomUsers[room] && roomUsers[room][0].id === socket.id) { // Check if sender is the host
      if (roomUsers[room].length >= 3) { // Check for minimum number of participants
        io.to(room).emit('gameStarted');
      } else {
        socket.emit('error', 'Not enough players to start the game.');
      }
    }
  });

  socket.on('voteCategory', ({ roomId, category }) => {
    console.log(roomId, category);
    if (!gameState[roomId]) {
      gameState[roomId] = { votes: {} }; // Initialize if not present
    }

    // Initialize votes for the category if not present
    if (!gameState[roomId].votes[category]) {
      gameState[roomId].votes[category] = 0;
    }

    gameState[roomId].votes[category] += 1; // Increment vote count

    // Optional: Broadcast updated votes to the room if desired
    // io.to(roomId).emit('updateVotes', gameState[roomId].votes);
  });

  // Event to handle end of voting and selection of category
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

      // Broadcast the selected category to the room
      io.to(roomId).emit('categorySelected', selectedCategory);
    }
  });

  socket.on('requestCurrentCategory', (roomId) => {
    if (gameState[roomId] && gameState[roomId].selectedCategory) {
      console.log(roomId);
      socket.emit('currentCategory', gameState[roomId].selectedCategory);
    }
  });

  socket.on('draw', (data) => {
    console.log("Draw Emitted");
    if (roomUsers[data.room]) {
      const user = roomUsers[data.room].find(user => user.id === socket.id);

      if (user && user.isHost) {
        console.log(data);
        socket.to(data.room).emit('drawing', data);
      }
    }
  });

  // Listener to update the scores of players after submitting their votes on guesses
  socket.on('updateScores', ({room, authorId, voterId}) => {
    const author = roomUsers[room][roomUsers[room].findIndex(user => user.id === authorId)];
    const voter = roomUsers[room][roomUsers[room].findIndex(user => user.id === voterId)];

    // checking the role of the author
    if(author.isHost){
      // the voter gains a single bonus point that doesn't count towards either hidden score
      voter.totalScore++;

      // The author (in this case, the artist) gains two artist points [hidden] as well as two more points for their visible score
      author.artScore += 2;
      author.totalScore += 2;
    }
    else{
      // if the voter's total score is already 0, they cannot lose more points
      if(voter.totalScore > 0){
        // the voter's total score is reduced to simulate the author stealing them for their total score
        voter.totalScore--;
      }
      // The author's trickster score [hidden] and total score [visible] go up by the same amount of points they just "stole" from the voter
      author.trickScore++;
      author.totalScore++;
    }

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

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    for (const room in roomUsers) {
      const index = roomUsers[room].findIndex(user => user.id === socket.id);
      if (index !== -1) {
        const wasHost = roomUsers[room][index].isHost;
        roomUsers[room].splice(index, 1);
        // Broadcast updated user list
        io.to(room).emit('updateUserList', roomUsers[room].map(user => ({ id: user.id, name: user.name, isHost: user.isHost, totalScore: user.totalScore, trickScore: user.trickScore, artScore: user.artScore})));
        // If the host disconnected, pass host and drawing privilege to the next user
        if (wasHost && roomUsers[room].length > 0) {
          roomUsers[room][0].isHost = true; // Designate new host
          io.to(roomUsers[room][0].id).emit('drawingPrivilege', true);
          // Notify users of the new host
          io.to(room).emit('updateUserList', roomUsers[room].map(user => ({ id: user.id, name: user.name, isHost: user.isHost, totalScore: user.totalScore, trickScore: user.trickScore, artScore: user.artScore})));
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
