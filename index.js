/**
 * @file: index.js
 * @description: This file sets up a Node.js server with Express, HTTP, and Socket.IO to manage real-time communication in a 
 *               collaborative drawing application. It initializes the server, configures Socket.IO for handling WebSocket 
 *               connections, and manages user interactions in drawing rooms. The server allows users to join specific rooms, 
 *               grants drawing privileges to the first user in each room, and handles the broadcasting of drawing actions to 
 *               other users in the same room. Additionally, it manages user disconnections and reassigns privileges as necessary.
 * @author: Ali Al-Jabur
 * @createdOn: 2024-02-03
 * @lastModified: 2024-02-03
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

// Object to track users in rooms
const roomUsers = {};

// Event listener for new socket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Event listener for joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room); // Join the specified room
    roomUsers[room] = roomUsers[room] || []; // Initialize room if not already present
    roomUsers[room].push(socket.id); // Add the user to the room

    // Grant drawing privilege to the first user in the room
    if (roomUsers[room][0] === socket.id) {
      socket.emit('drawingPrivilege', true);
    }

    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Event listener for drawing actions
  socket.on('draw', (data) => {
    // Broadcast drawing data if user has drawing privilege
    if (roomUsers[data.room] && roomUsers[data.room][0] === socket.id) {
      socket.to(data.room).emit('drawing', data);
    }
  });

  // Event listener for socket disconnections
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    for (const room in roomUsers) {
      const index = roomUsers[room].indexOf(socket.id);
      // Remove user from the room
      if (index !== -1) {
        roomUsers[room].splice(index, 1);
        // Pass drawing privilege to the next user in line
        if (index === 0 && roomUsers[room].length > 0) {
          io.to(roomUsers[room][0]).emit('drawingPrivilege', true);
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
