
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db'); // Import database configuration
const routes = require('./routes/index'); // Import routes

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});