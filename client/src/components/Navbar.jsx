import React from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function Navbar() {
   const { user, logout } = useAuth();

   const handleLogout = async () => {
      logout();
      await api.post("/users/logout");
   };

   return (
      <div className="fixed w-full flex justify-between p-4 bg-slate-300 z-10">
         <a href="/" className="font-bold text-xl text-orange-600">Recipe.in</a>
         {user ? (
            <div className="flex gap-4">
               <a
                  href="/recipe/add"
                  className="cursor-pointer px-4 py-2 rounded-full border border-slate-400 hover:border-slate-600 hover:bg-slate-400 transform duration-300"
               >
                  Add Recipe
               </a>

               <button
                  onClick={handleLogout}
                  className="border hover:text-white border-red-500 bg-red-300 hover:bg-red-800 cursor-pointer px-4 py-2 rounded-md"
               >
                  Logout
               </button>
            </div>
         ) : (
            <div className="flex items-center gap-2 p-2 rounded-full bg-slate-400/20 border border-slate-500">
               <a href="/auth/login" className="cursor-pointer px-2 py-1 rounded-full hover:bg-sky-400/20">
                  Login
               </a>
               |
               <a href="/auth/register" className="cursor-pointer px-2 py-1 rounded-full hover:bg-sky-400/20">
                  Register
               </a>
            </div>
         )}
      </div>
   );
}

export default Navbar;
