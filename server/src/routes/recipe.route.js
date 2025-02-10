import { Router } from "express";
import {
    addNewRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipeById,
    deleteRecipeById,
} from "../controllers/recipe.controller.js";
import { verifyJWT } from "../middlewares/verifyUser.js";

const router = Router();

router.route("/").get(getAllRecipes);
router.route("/new").post(verifyJWT, addNewRecipe);
router
    .route("/:id")
    .get(getRecipeById)
    .put(verifyJWT, updateRecipeById)
    .delete(verifyJWT, deleteRecipeById);

export default router;
