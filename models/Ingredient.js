const mongoose = require('mongoose'); // Import mongoose

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
