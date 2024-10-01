const express = require('express');
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const uuidv4 = require('uuid').v4;
const PORT = process.env.PORT || 3001;
// const WSPORT = process.env.WSPORT || 5000;

// SSL certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/ssn-travelplanner.ddns.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ssn-travelplanner.ddns.net/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
// Middleware to parse JSON
app.use(express.json());

// Define API endpoints
app.get('/api/users', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send({ message: users });
});

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);
// Create a WebSocket server
const wss = new WebSocket.Server({ server: httpsServer });

const clients = {};
const users = {};
let editorContent = null;
let userActivity = [];

// Event types
const typesDef = {
  USER_EVENT: 'userevent',
  CONTENT_CHANGE: 'contentchange',
  DATA_REQUEST: 'requestdata'
}

function broadcastMessage(json) {
  // We are sending the current data to all connected clients
  const data = JSON.stringify(json);
  for (let userId in clients) {
    let client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  };
}

function handleMessage(message, userId) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === typesDef.DATA_REQUEST) {
    json.type = 'eventdata'
    json.data = { editorContent }
  } else if (dataFromClient.type === typesDef.USER_EVENT) {
    users[userId] = dataFromClient;
    if (dataFromClient.save) {
      userActivity.push(`${dataFromClient.username} successfully saved the events! 💾`);
    } else {
      userActivity.push(`${dataFromClient.username} joined! 👋`);
    }
    json.data = { users, userActivity };
  } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
    editorContent = dataFromClient.content;
    json.data = { editorContent, userActivity };
  }
  broadcastMessage(json);
}

function handleDisconnect(userId) {
  console.log(`${userId} disconnected.`);
  const json = { type: typesDef.USER_EVENT };
  const username = users[userId]?.username || userId;
  userActivity.push(`${username} left. 🧎‍♂️`);
  json.data = { users, userActivity };
  delete clients[userId];
  delete users[userId];
  broadcastMessage(json);
}

// A new client connection request received
wss.on('connection', connection => {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log(`Received a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);

  connection.on('message', (message) => handleMessage(message, userId));
  connection.on('close', () => handleDisconnect(userId));
});

// Start the server on port 3001
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`WebSocket server is running on port: ${PORT}`);
});
