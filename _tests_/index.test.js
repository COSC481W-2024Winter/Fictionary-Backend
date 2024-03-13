// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ioc = require('socket.io-client');

// Initialize Express app, HTTP server, and Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
cors: {
    origin: "*", // Allowing cross-origin requests
    methods: ["GET", "POST"]
}
});

describe("fictionary", () => {
    let serverSocket, clientSocket;

    //Start the client and server sockets for testing
    beforeAll((done) => {
        server.listen(8000, () => {
            clientSocket = ioc(`http://localhost:8000`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
            console.log('Server is running on http://localhost:8000');
        });
    });
  
    //close both sockets after testing
    afterAll(() => {
      server.close;
      clientSocket.disconnect();
    });

  //testing the "updateScores" method
  test("scores should be changed", () => {
    // Pushing mock users to the roomUsers["room"] array
    clientSocket.emit('joinRoom', { userid: 1, room: "room", userName: "artist" });
    clientSocket.emit('joinRoom', { userid: 2, room: "room", userName: "trickster" });

    // if the artist was the "author" then trickster voted for the correct answer
    clientSocket.emit('updateScores', {room: "room", authorId: 1, voterId: 2});
    serverSocket.on('updateScores', (arg) => {
        // The first user to enter the room (the artist) would now have a score of 2
        expect(arg[0].totalScore).toBe(2);
        expect(arg[0].artScore).toBe(2);
        // The second user to enter the room (the voter) would have a score of 1
        expect(arg[1].totalScore).toBe(1);
    });

    // in the case where both users are now tricksters, the former artist would lose one point and the original trickster would earn said point
    clientSocket.emit('updateScores', {authorId: 2, voterId: 1});
    serverSocket.on('updateScores', (arg) => {
        // the former artist now has a score of 1
        expect(arg[0].totalScore).toBe(1);
        // the original trickster now has a total score of 2 and a trickster score of 1
        expect(arg[1].totalScore).toBe(2);
        expect(arg[1].trickScore).toBe(1);
    });
  });
});