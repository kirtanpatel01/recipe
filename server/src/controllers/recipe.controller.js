import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Recipe } from "../models/recipe.model.js";

const addNewRecipe = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { title, category, ingredients, instructions } = req.body;
    console.log(title);
    console.log(category);
    console.log(ingredients);
    console.log(instructions)
    if (
        [title, category, ingredients, instructions].some((field) =>
            Array.isArray(field) ? field.length === 0 : field === "",
        )
    ) {
        throw new ApiError(409, "All fields are required!");
    }

    const existingRecipe = await Recipe.findOne({ title });
    if (existingRecipe) {
        throw new ApiError(
            409,
            existingRecipe,
            "Recipe with this title already exists!",
        );
    }

    const recipe = await Recipe.create({
        title,
        category,
        ingredients,
        instructions,
    });
    if (!recipe) {
        throw new ApiError(500, "Error while adding recipe details!");
    }

    return res.json(new ApiResponse(200, recipe, "Recipe added successfully!"));
});

const getAllRecipes = asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({});
    if (!recipes) {
        throw new ApiError(404, "No recipe data found!");
    }

    return res.json(
        new ApiResponse(200, recipes, "All recipes are fetched successfully!"),
    );
});

const getRecipeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Recipe id not found!");
    }

    const recipe = await Recipe.findById(id);
    if (!recipe || Object.keys(recipe).length === 0) {
        throw new ApiError(400, "Recipe with given id not found!");
    }

    console.log(recipe)

    return res.json(
        new ApiResponse(200, recipe, "Recipe details fetched successfully!"),
    );
});

const updateRecipeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recipe = req.body;

    if (!id) {
        throw new ApiError(400, "Recipe id not found!");
    }

    if (!recipe || Object.keys(recipe).length === 0) {
        throw new ApiError(
            400,
            "Recipe details not found that need be updated!",
        );
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, recipe, {
        new: true,
    });
    if (!updatedRecipe) {
        throw new ApiError(500, "Error while updating recipe details!");
    }

    return res.json(
        new ApiResponse(
            200,
            updatedRecipe,
            "Recipe details updated successfully!",
        ),
    );
});

const deleteRecipeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Recipe id not found!");
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
        throw new ApiError(404, "Recipe not found!");
    }

    return res.json(new ApiResponse(200, deletedRecipe, "Recipe deleted successfully!"));
});

export {
    addNewRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipeById,
    deleteRecipeById,
};
