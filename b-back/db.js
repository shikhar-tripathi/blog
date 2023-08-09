const { MongoClient } = require('mongodb');

// const url = 'mongodb://0.0.0.0:27017'; // Modify this if your MongoDB server is running on a different URL
const url='mongodb+srv://shikhartripathi961:shikhar123@cluster0.pqughmi.mongodb.net/';
const dbName = 'my_database'; // Change 'my_database' to your preferred database name

let db;

async function connectToDatabase() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

function getDatabase() {
  return db;
}

module.exports = { connectToDatabase, getDatabase };