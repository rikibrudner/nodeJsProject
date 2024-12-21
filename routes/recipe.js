const express = require('express');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const mongoose = require('mongoose'); // Import mongoose
const router = express.Router();

// Create a new recipe
router.post('/recipes', async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            preparationTime,
            difficulty,
            layers,
            preparationInstructions,
            isPrivate,
            user,
        } = req.body;

        // Validate category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        // Create the recipe
        const recipe = new Recipe({
            name,
            description,
            category,
            preparationTime,
            difficulty,
            layers,
            preparationInstructions,
            isPrivate,
            user,
        });
        await recipe.save();

        // Increment the number of recipes in the category
        categoryExists.numberOfRecipes += 1;
        await categoryExists.save();

        res.status(201).json({ message: 'Recipe created successfully', recipe });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all recipes
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('category', 'code description') // Populate category details
            .populate('user', 'username'); // Populate user details (if User model exists)
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 1. Get recipe details by recipe code (ID)
 */
router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('category', 'code description')
            .populate('user', 'username'); // Assuming a User model exists
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * 2. Get recipes for a specific user
 */
router.get('/recipes/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Fetch recipes for the user
        const recipes = await Recipe.find({ user: userId });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 3. Get recipes by preparation time
 */
router.get('/recipes/prep-time/:minutes', async (req, res) => {
    try {
        const maxMinutes = parseInt(req.params.minutes);
        if (isNaN(maxMinutes)) {
            return res.status(400).json({ error: 'Invalid preparation time' });
        }
        const recipes = await Recipe.find({ preparationTime: { $lte: maxMinutes } });
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 5. Update a recipe
 */
router.put('/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate category if provided
        if (updateData.category) {
            const categoryExists = await Category.findById(updateData.category);
            if (!categoryExists) {
                return res.status(400).json({ error: 'Invalid category ID' });
            }
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe updated successfully', updatedRecipe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 6. Delete a recipe
 */
router.delete('/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Decrement the number of recipes in the category
        const category = await Category.findById(recipe.category);
        if (category) {
            category.numberOfRecipes -= 1;
            await category.save();
        }

        await recipe.deleteOne();

        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
