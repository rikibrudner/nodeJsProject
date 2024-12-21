require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db'); // Import database configuration

const userRoutes = require('./routes/user'); 
const categoryRoutes = require('./routes/category');
const recipeRoutes = require('./routes/recipe');
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', recipeRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});