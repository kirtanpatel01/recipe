import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router";

function Register() {
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
         const res = await api.post("/users/register", formData);
         if (res.status === 200) {
            setSuccess("Registration successful!");
            setFormData({ email: "", password: "" });
            login(res.data.data);
            navigate('/')
         }
      } catch (err) {
         setError(
            err.response?.data?.message || "Register failed. Please try again.",
         );
      } finally {
         setIsPending(false);
      }
   };

   return (
      <div>
         <h1 className="head">Register Page</h1>
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
            <button type="submit" className={`btn bg-neutral-950/75 ${isPending ? 'cursor-not-allowed ' : 'cursor-pointer hover:bg-black'}`} disabled={isPending}>
               {isPending ? "Registering in..." : "Regiter"}
            </button>

            <span>Already have an account ? <a href="/auth/login" className="secondary-btn">Login</a></span>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
         </form>
      </div>
   );
}

export default Register;
