"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/services/login"; // Adjust the import path to where your login function is located
import { toast } from 'react-toastify'; // Ensure react-toastify is installed
import axios from 'axios';
import { setAccessToken, setRefreshToken } from "@/utils/auth";

// Define error types based on the response structure
interface ValidationErrors {
  username?: string[];
  password?: string[];
}

interface LoginError {
  detail: string;
}

export default function SigninForm() {
  // State to manage form input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true);
    setErrors({}); // Clear previous errors
    const response = await login(username, password);
    if (response.status == 200) {
      console.log('response.data.data :>> ', response.data.data);
      const resData = response.data.data;
      const { access, refresh } = resData;
      setAccessToken(access);
      setRefreshToken(refresh);
    }
    else {
      setErrors(response.data.data.errors || {});
    }
    setLoading(false);
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          <span>Don't have an account?</span>
          <Link className="underline ml-2" href="/signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
};