import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api.js";

function Dashboard() {
   const { user } = useAuth();
   const [isPending, setIsPending] = useState(false);
   const [error, setError] = useState(null);
   const [recipes, setRecipes] = useState([]);

   const fetchRecipes = async () => {
      setIsPending(true);
      setError(null);
      try {
         const res = await api.get("/recipes");
         console.log(res);
         setRecipes(res.data.data);
      } catch (error) {
         setError(error);
      } finally {
         setIsPending(false);
      }
   };

   useEffect(() => {
      fetchRecipes();
   }, []);

   if (!user) {
      return (
         <div>
            First you need to do{" "}
            <a href="/auth/login" className="seondary-btn">
               Login
            </a>
            !
         </div>
      );
   }

   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold text-sky-600 mb-4">All recipes are here!</h1>

         {isPending && (
            <div className="text-6xl font-semibold text-blue-600">
               Loading...
            </div>
         )}
         {error && <p className="error">{error}</p>}

         <ul className="grid grid-cols-5 bg-white p-8 rounded-2xl shadow-lg shadow-slate-500/25">
            {recipes?.length === 0 && <div>Bandhu ahi koi recipe add kareli!</div>}
            {recipes &&
               recipes.map((item) => (
                  <Link
                     key={item.title}
                     to={`/recipe/${item._id}`}
                     className="flex flex-col max-w-48 border border-slate-400 p-2 bg-slate-400/20 hover:bg-slate-400/40 rounded-xl shadow-md cursor-pointer"
                  >
                     <span className="font-semibold text-xl">{item.title}</span>
                     <span className="opacity-50">{item.category}</span>
                  </Link>
               ))}
         </ul>
      </div>
   );
}

export default Dashboard;
