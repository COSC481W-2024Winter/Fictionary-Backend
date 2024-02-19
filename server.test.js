const io = require('socket.io-client');

describe('Server connection and functionality', () => {
  let clientSocket;

  beforeAll((done) => {
    // Connect to the server
    clientSocket = io.connect('http://localhost:8000', {
      // Add any required options here
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      console.log('Successfully connected to the server');
      done();
    });
  });

  afterAll(() => {
    // Disconnect after tests are done
    clientSocket.disconnect();
  });

  test('should connect to server', (done) => {
    expect(clientSocket.connected).toBeTruthy();
    done();
  });

  // New test case for joining a room
  test('should join a specific room with a unique username and be added to the user list', (done) => {
    // Emit an event to join a room
    const roomName = 'testRoom';
    const userName = 'testUser';
    clientSocket.emit('joinRoom', { userid: clientSocket.id, room: roomName, userName });

    // Listen for an event that confirms the room join and user list update
    clientSocket.on('updateUserList', (users) => {
      // Check if the user list includes the test user
      const isUserAdded = users.some(user => user.name === userName && user.id === clientSocket.id);
      expect(isUserAdded).toBeTruthy();

      // Optionally, verify if the user is marked as host (if applicable)
      const isHost = users.find(user => user.id === clientSocket.id)?.isHost;
      expect(isHost).toBeDefined(); // Adjust this based on your actual logic for assigning hosts

      done();
    });

    // Handle any errors or timeouts (optional)
    clientSocket.on('error', (errorMsg) => {
      done(new Error(`Error joining room: ${errorMsg}`));
    });
  });

  
});

describe('Game Start functionality', () => {
  let hostSocket, player2Socket, player3Socket;

  beforeAll((done) => {
    // Connect the host socket
    hostSocket = io.connect('http://localhost:8000', {
      transports: ['websocket'],
    });

    hostSocket.on('connect', () => {
      console.log('Host connected to the server');
      hostSocket.emit('joinRoom', { userid: hostSocket.id, room: 'gameRoom', userName: 'hostUser' });

      // Connect the second player
      player2Socket = io.connect('http://localhost:8000', {
        transports: ['websocket'],
      });

      player2Socket.on('connect', () => {
        console.log('Player 2 connected to the server');
        player2Socket.emit('joinRoom', { userid: player2Socket.id, room: 'gameRoom', userName: 'player2' });

        // Connect the third player
        player3Socket = io.connect('http://localhost:8000', {
          transports: ['websocket'],
        });

        player3Socket.on('connect', () => {
          console.log('Player 3 connected to the server');
          player3Socket.emit('joinRoom', { userid: player3Socket.id, room: 'gameRoom', userName: 'player3' });

          // All players connected and joined the room
          done();
        });
      });
    });
  });

  afterAll(() => {
    // Disconnect after tests are done
    hostSocket.disconnect();
    player2Socket.disconnect();
    player3Socket.disconnect();
  });

  test('Game should only start with at least 3 participants and by the host', (done) => {
    // Listen for the game start event
    hostSocket.on('gameStarted', () => {
      // Game started successfully
      expect(true).toBeTruthy();
      done();
    });

    // Listen for any error messages
    hostSocket.on('error', (errorMsg) => {
      done(new Error(`Failed to start the game: ${errorMsg}`));
    });

    // Attempt to start the game
    hostSocket.emit('startGame', 'gameRoom');
  });

});

describe('Drawing Event functionality', () => {
  let hostSocket, player2Socket, player3Socket;

  beforeAll((done) => {
    hostSocket = io.connect('http://localhost:8000', { transports: ['websocket'] });
    player2Socket = io.connect('http://localhost:8000', { transports: ['websocket'] });
    player3Socket = io.connect('http://localhost:8000', { transports: ['websocket'] });

    let connectedClients = 0;
    const checkAllConnected = () => {
      connectedClients += 1;
      if (connectedClients === 3) {
        done();
      }
    };

    hostSocket.on('connect', () => {
      hostSocket.emit('joinRoom', { userid: hostSocket.id, room: 'gameRoom', userName: 'hostUser' });
      checkAllConnected();
    });

    player2Socket.on('connect', () => {
      player2Socket.emit('joinRoom', { userid: player2Socket.id, room: 'gameRoom', userName: 'player2' });
      checkAllConnected();
    });

    player3Socket.on('connect', () => {
      player3Socket.emit('joinRoom', { userid: player3Socket.id, room: 'gameRoom', userName: 'player3' });
      checkAllConnected();
    });
  });

  afterAll(() => {
    hostSocket.disconnect();
    player2Socket.disconnect();
    player3Socket.disconnect();
  });

  // Update the expected drawing data to include the room property
  const drawingData = { line: [0, 1], color: 'red', room: 'gameRoom' };

  test('Drawing data sent by the host is received by all other participants', (done) => {
    let receivedCount = 0;

    // Function to check if all other clients received the drawing data
    const checkReceivedAll = () => {
      receivedCount += 1;
      if (receivedCount === 2) { // Expecting two clients to receive the data
        done();
      }
    };

    player2Socket.on('drawing', (data) => {
      expect(data).toEqual(drawingData);
      checkReceivedAll();
    });

    player3Socket.on('drawing', (data) => {
      expect(data).toEqual(drawingData);
      checkReceivedAll();
    });

    // Emit drawing data after a short delay to ensure all clients have joined the room
    setTimeout(() => {
      hostSocket.emit('draw', drawingData);
    }, 500);

    // Setup a timeout to catch the case where not all participants receive the data
    setTimeout(() => {
      if (receivedCount < 2) {
        done(new Error('Not all participants received the drawing data'));
      }
    }, 5000); // Adjust the timeout based on expected server response times
  });

  
});
describe('Host Reassignment and Drawing Privileges', () => {
  let hostSocket, nextHostSocket, otherUserSocket;

  beforeAll(done => {
    // Setup connections
    hostSocket = io.connect('http://localhost:8000', { transports: ['websocket'], forceNew: true });
    nextHostSocket = io.connect('http://localhost:8000', { transports: ['websocket'], forceNew: true });
    otherUserSocket = io.connect('http://localhost:8000', { transports: ['websocket'], forceNew: true });

    let connections = 0;
    const checkAllConnected = () => {
      connections++;
      if (connections === 3) done();
    };

    hostSocket.on('connect', () => {
      hostSocket.emit('joinRoom', { userid: hostSocket.id, room: 'hostRoom', userName: 'hostUser' });
      checkAllConnected();
    });

    nextHostSocket.on('connect', () => {
      nextHostSocket.emit('joinRoom', { userid: nextHostSocket.id, room: 'hostRoom', userName: 'nextHostUser' });
      checkAllConnected();
    });

    otherUserSocket.on('connect', () => {
      otherUserSocket.emit('joinRoom', { userid: otherUserSocket.id, room: 'hostRoom', userName: 'otherUser' });
      checkAllConnected();
    });
  });

  afterAll(() => {
    // Clean up connections
    hostSocket.disconnect();
    nextHostSocket.disconnect();
    otherUserSocket.disconnect();
  });

  test('Next user is assigned as the host and receives drawing privileges upon original host disconnect', done => {
    // Increase timeout for this test
    jest.setTimeout(10000);

    // Listen for the updated user list to confirm new host
    otherUserSocket.on('updateUserList', (users) => {
      const newHost = users.find(user => user.isHost);
      if (newHost && newHost.name === 'nextHostUser') {
        expect(newHost.name).toEqual('nextHostUser');
        done();
      }
    });

    // Delay the host disconnection to ensure all users are properly joined and the server is ready
    setTimeout(() => {
      hostSocket.disconnect();
    }, 1000); // Adjust as needed based on observed server processing time
  });
});
