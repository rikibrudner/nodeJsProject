const mongoose = require('mongoose');

const LayerSchema = new mongoose.Schema({
    description: { type: String, required: true },
    ingredients: { type: [String], required: true }, 
});

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    preparationTime: { type: Number, required: true }, 
    difficulty: { type: Number, min: 1, max: 5, required: true },
    dateAdded: { type: Date, default: Date.now },
    layers: { type: [LayerSchema], required: true },
    preparationInstructions: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
