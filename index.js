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

// Initialize Express app, HTTP server, and Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allowing cross-origin requests
    methods: ["GET", "POST"]
  }
});

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
    const totalScore = 0;
    const trickScore = 0;
    const artScore = 0;
    roomUsers[room].push({ id: userid, name: userName, isHost, totalScore, trickScore, artScore });

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
