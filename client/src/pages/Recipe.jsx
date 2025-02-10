import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function Recipe() {
  const { id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRecipeDetails = async () => {
    setIsPending(true);
    setError(null);
    try {
      const res = await api.get(`recipes/${id}`);
      setRecipe(res.data.data);
    } catch (error) {
      setError(error);
    } finally {
      setTimeout(() => {
        setIsPending(false);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/recipes/${recipe._id}`);
      if(res.status === 200) {
        navigate('/')
      }
    } catch (error) {

    }
  };
  useEffect(() => {
    if (id) fetchRecipeDetails();
  }, [id]);

  if (isPending)
    return (
      <div className="text-7xl font-semibold text-blue-600">
        Loading thay che bhai shanti rakh! 😌
      </div>
    );

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="">
      <header className="flex items-center">
        <h1 className="head flex-1 my-4">Recipe Details</h1>
        {user && (
          <div>
            <button
              disabled={isPending}
              onClick={() => navigate(`/recipe/edit/${recipe._id}`)}
              className={`h-fit px-4 py-2 rounded-md bg-amber-400/30 hover:bg-amber-400 border border-amber-600 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className={`h-fit mx-4 px-4 py-2 rounded-md bg-red-400/30 hover:bg-red-400 border border-red-600 cursor-pointer ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Delete
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-rows-2  xl:grid-rows-1 grid-cols-1 xl:grid-cols-[0.25fr_.75fr_1fr] gap-8 bg-white rounded-xl shadow-md p-8">
        <div className="h-fit flex flex-col gap-4 bg-slate-400/20 border border-slate-300 rounded-md shadow-md p-4">
          <span className="text-2xl font-semibold">{recipe.title}</span>
          <span className="">{recipe.category}</span>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Ingredients:</h2>
          <ul className="grid grid-cols-3 p-4 gap-4 bg-slate-400 rounded-xl">
            {recipe.ingredients &&
              recipe?.ingredients.map((ingre) => (
                <li
                  key={ingre}
                  className="px-4 py-2 bg-white shadow-md rounded-md max-w-48"
                >
                  {ingre}
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Instructions:</h2>
          <ul className="grid grid-cols-1 p-4 gap-4 bg-slate-400 rounded-xl">
            {recipe.instructions &&
              recipe?.instructions.map((inst) => (
                <li key={inst.srNo} className="flex gap-1">
                  <span className="item font-medium">{inst.srNo}.</span>
                  <span className="item w-full">{inst.text}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
