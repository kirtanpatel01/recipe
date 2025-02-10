import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import {
   AddRecipe,
   Dashboard,
   Login,
   Recipe,
   Register,
   UpdateRecipe,
} from "./pages";
import { AuthLayout, ProtectedRoute } from "./components";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <AuthProvider>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<App />}>
                  <Route index element={<Dashboard />} />
                  <Route path="recipe" element={<Outlet />}>
                     <Route path=":id" element={<Recipe />} />
                     <Route element={<ProtectedRoute />}>
                        <Route
                           path="edit/:id"
                           element={<UpdateRecipe />}
                        />
                        <Route path="add" element={<AddRecipe />} />
                     </Route>
                  </Route>
               </Route>
               <Route path="auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
               </Route>
            </Routes>
         </BrowserRouter>
      </AuthProvider>
   </StrictMode>,
);
