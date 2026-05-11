import { api } from "../api/client"; 
import React, { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('./signup', formData); 

      if (response.status === 200 || response.status === 201) { 
        setMessage('Signup successful! You can now log in.');
        setFormData({ username: '', password: '' });
      } else {
        setMessage(response.data?.detail || 'Signup failed.'); 
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="App bg-transparent flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>
      <section className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>
      </section>
      {message && (
        <div className="mt-4 text-center text-sm text-red-600">{message}</div>
      )}
    </div>
  );
}

export default Signup;