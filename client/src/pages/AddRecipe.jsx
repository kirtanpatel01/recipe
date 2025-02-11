import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";

function AddRecipe() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    ingredients: [],
    instructions: [],
  });

  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }));
      setIngredient("");
    }
  };

  const handleAddInstruction = () => {
    if (instruction.trim()) {
      setFormData((prev) => ({
        ...prev,
        instructions: [
          ...prev.instructions,
          { srNo: prev.instructions.length + 1, text: instruction },
        ],
      }));
      setInstruction("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveInstruction = (index) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((inst, i) => ({ srNo: i + 1, text: inst.text })),
    }));
  };

  const handleSubmit = async () => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.post("/recipes/new", formData, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setSuccess(`${formData.title} added successfully!`);
        setFormData({
          title: "",
          category: "",
          ingredients: [],
          instructions: [],
        });
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Recipe adding failed. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 p-16">
      <h1 className="head">Add Recipe</h1>
      <div className="w-full grid grid-cols-[0.5fr_1fr_1fr] gap-8">
        <div className="flex flex-col gap-8">
          <div>
            <label className="font-bold p-2">Title</label>
            <input
              type="text"
              name="title"
              className="input h-fit mt-2"
              placeholder="Enter the title of the recipe..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="font-bold px-2">Category</label>
            <input
              type="text"
              name="category"
              className="input h-fit mt-2"
              placeholder="Enter the category..."
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="p-4 bg-slate-200/60 rounded-2xl flex flex-col gap-4">
          <h3 className="font-bold">Ingredients</h3>
          <div className="flex gap-4">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter an ingredient..."
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()} // Handle Enter key
            />
            <button
              onClick={handleAddIngredient}
              className="border border-slate-500 px-4 py-2 bg-black/75 hover:bg-black rounded-2xl text-white"
            >
              + Add
            </button>
          </div>
          <ul className="mt-2">
            {formData.ingredients.map((ing, index) => (
              <li
                key={index}
                className="flex justify-between bg-white p-2 rounded-md my-1"
              >
                {ing}
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-red-500 font-bold"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-slate-200/60 rounded-2xl flex flex-col gap-4">
          <h3 className="font-bold">Instructions</h3>
          <div className="flex gap-4">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter a step..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInstruction()}
            />
            <button
              onClick={handleAddInstruction}
              className="border border-slate-500 px-4 py-2 bg-black/75 hover:bg-black rounded-2xl text-white"
            >
              + Add
            </button>
          </div>
          <ul className="mt-2">
            {formData.instructions.map((step, index) => (
              <li
                key={index}
                className="flex justify-between bg-white p-2 rounded-md my-1"
              >
                {step.srNo}. {step.text}
                <button
                  onClick={() => handleRemoveInstruction(index)}
                  className="text-blue-500 font-bold"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className={`btn my-8 bg-neutral-950/75 ${
          isPending ? "cursor-not-allowed" : "cursor-pointer hover:bg-black"
        }`}
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add Recipe"}
      </button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default AddRecipe;
