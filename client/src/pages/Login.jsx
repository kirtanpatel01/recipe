import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router";

function Login() {
   const [isPending, setIsPending] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const { login } = useAuth();
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsPending(true);
      setError(null);
      setSuccess(null);

      try {
         const res = await api.post("/users/login", formData);
         if (res.status === 200) {
            setSuccess("Login successful!");
            setFormData({ email: "", password: "" });
            login(res.data.data);
            navigate("/");
         }
      } catch (err) {
         setError(
            err.response?.data?.message || "Login failed. Please try again.",
         );
      } finally {
         setIsPending(false);
      }
   };

   return (
      <div>
         <h1 className="head">Login Page</h1>
         <form className="form-box" onSubmit={handleSubmit}>
            <input
               type="email"
               name="email"
               className="input"
               placeholder="Email"
               value={formData.email}
               onChange={handleChange}
               required
            />
            <input
               type="password"
               name="password"
               className="input"
               placeholder="Password"
               value={formData.password}
               onChange={handleChange}
               required
            />
            <button type="submit" className={`btn ${isPending ? 'cursor-not-allowed bg-neutral-950/75' : 'cursor-pointer bg-neutral-950/75 hover:bg-black'}`} disabled={isPending}>
               {isPending ? "Logging in..." : "Login"}
            </button>

            <span>Don't have an account ? <a href="/auth/register" className="px-2 text-blue-600 font-medium text-lg cursor-pointer">Register</a></span>
         </form>

         {error && <p className="error">{error}</p>}
         {success && <p className="success">{success}</p>}
      </div>
   );
}

export default Login;
