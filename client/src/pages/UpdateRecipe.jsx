import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api";

function UpdateRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    ingredients: [],
    instructions: [],
  });

  const fetchRecipeDetails = async () => {
    setIsPending(true);
    setError(null);
    try {
      const res = await api.get(`recipes/${id}`);
      setRecipe(res.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => setIsPending(false), 1000);
    }
  };

  useEffect(() => {
    if (id) fetchRecipeDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe((prevRecipe) => ({ ...prevRecipe, ingredients: updatedIngredients }));
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions[index].text = value;
    setRecipe((prevRecipe) => ({ ...prevRecipe, instructions: updatedInstructions }));
  };

  const handleSubmit = async (e) => {
    setIsPending(true);
    setError(null);
    e.preventDefault();

    try {
      const res = await api.put(`recipes/${id}`, recipe);
      if(res.status === 200) {
        navigate('/')
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(error)
    } finally {
      setIsPending(false)
    }
  };

  if (isPending)
    return (
      <div className="text-7xl font-semibold text-blue-600">
        Loading thay che bhai shanti rakh! 😌
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Update Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={recipe.category}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="input"
            />
          ))}
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Instructions</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={instruction._id} className="grid grid-cols-[.02fr_1fr] items-center gap-4">
              <span className="font-semibold">{instruction.srNo}.</span>
              <input
                type="text"
                value={instruction.text}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer "
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
}

export default UpdateRecipe;
