const express = require('express');
const app = express();
const PORT = 8080;

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server and listen for connections
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
