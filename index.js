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
const dbPass = process.env.DATABASE_PASSWORD;
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

app.use(cors({origin: "http://localhost:3000"})) //Allow CORS AAAAA -> Swap url later (needs to be front end url)
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

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.emit('yourSocketId', { id: socket.id });

  // Modified event listener for joining a room, now includes userName
  socket.on('joinRoom', ({userid, room, userName}) => {
    socket.join(room);
    roomUsers[room] = roomUsers[room] || [];
    const isHost = roomUsers[room].length === 0; // First user to join is the host
    roomUsers[room].push({ id: userid, name: userName, isHost });

    console.log(roomUsers[room]);
    // Broadcast updated user list to the room
    io.to(room).emit('updateUserList', roomUsers[room].map(user => ({
      id: user.id,
      name: user.name,
      isHost: user.isHost
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

  socket.on('draw', (data) => {
    if (roomUsers[data.room]) {
      const user = roomUsers[data.room].find(user => user.id === socket.id);

      if (user && user.isHost) {
        socket.to(data.room).emit('drawing', data);
      }
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
        io.to(room).emit('updateUserList', roomUsers[room].map(user => ({ id: user.id, name: user.name, isHost: user.isHost })));
        // If the host disconnected, pass host and drawing privilege to the next user
        if (wasHost && roomUsers[room].length > 0) {
          roomUsers[room][0].isHost = true; // Designate new host
          io.to(roomUsers[room][0].id).emit('drawingPrivilege', true);
          // Notify users of the new host
          io.to(room).emit('updateUserList', roomUsers[room].map(user => ({ id: user.id, name: user.name, isHost: user.isHost })));
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
