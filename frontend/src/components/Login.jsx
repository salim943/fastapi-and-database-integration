import { api } from "../api/client";
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", formData.username);
      params.append("password", formData.password);

      const res = await api.post('auth/login/', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      localStorage.setItem('access_token', res.data.access_token);

      const redirectTo = location.state?.from?.pathname || '/profiles';
      navigate(redirectTo, { replace: true });

    } catch (error) {
      alert("Login failed.");
      console.error(error);
    }
  };

  return (
    <div className="App bg-transparent flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
      <section className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="username" placeholder="Email" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Login</button>
        </form>
      </section>
      <p>New user? <a href="./signup" className="text-blue-600 underline">Signup</a></p>
    </div>
  );
}

export default Login;
