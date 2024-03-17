require( '@jest/globals');
//import { myFunction } from './myModule';
// Import the required modules
const { MongoClient } = require('mongodb');

// Define the test
test('should connect to the database successfully', async () => {
    // Define the MongoDB connection URI
    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASSWORD;
    const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster.ieggqf8.mongodb.net/?retryWrites=true&w=majority&appName=cluster`;

    let client;

    try {
      //Establish connection to the db
      client = new MongoClient(uri);
      await client.connect();

      expect(client.isConnected()).toBe(true); //check id succesfull
    } 
    catch (error) {
      console.error('DB connection failed:', error);
    } finally {
      if (client) {
        await client.close();
      }
    }
});
