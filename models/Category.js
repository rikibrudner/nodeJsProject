const mongoose = require('mongoose'); // Import mongoose

const CategorySchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    numberOfRecipes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Category', CategorySchema);
