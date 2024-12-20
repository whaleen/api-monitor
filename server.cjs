// server.cjs
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Keep track of web clients
const webClients = new Set();

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  // Log how many clients we have
  console.log('Total clients:', webClients.size + 1);

  // Add new client to our set
  webClients.add(ws);

  // Remove client when they disconnect
  ws.on('close', () => {
    webClients.delete(ws);
    console.log('Client disconnected');
    console.log('Remaining clients:', webClients.size);
  });

  // When we receive a message (from the extension)
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received message:', message);

      // Broadcast to all web clients
      webClients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          console.log('Sending to a client');
          client.send(JSON.stringify(message));
          console.log('Server forwarded message');
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

console.log('WebSocket server running on port 8080');
