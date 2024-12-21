const express = require('express');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Create a new category
router.post('/categories', async (req, res) => {
    try {
        const { code, description } = req.body;

        const category = new Category({ code, description });
        await category.save();

        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all categories with their associated recipes
router.get('/categories-with-recipes', async (req, res) => {
    try {
        const categories = await Category.find();
        const categoriesWithRecipes = await Promise.all(
            categories.map(async (category) => {
                const recipes = await Recipe.find({ category: category._id });
                return {
                    ...category._doc,
                    recipes, // Include recipes for this category
                };
            })
        );
        res.status(200).json(categoriesWithRecipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get by code 
router.get('/categories/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        // Find the category by code or name
        const category = await Category.findOne({
            $or: [
                { code: identifier },
                { description: new RegExp(`^${identifier}$`, 'i') },
            ],
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Find recipes for this category
        const recipes = await Recipe.find({ category: category._id });

        res.status(200).json({
            category: {
                _id: category._id,
                code: category.code,
                description: category.description,
                numberOfRecipes: category.numberOfRecipes,
            },
            recipes,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
