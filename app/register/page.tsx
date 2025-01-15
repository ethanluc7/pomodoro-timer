"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirecting to the login page
import axios from "axios";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setMessage(""); // Clear previous messages
    setError(""); // Clear previous errors

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send registration request to Flask backend directly
      const response = await axios.post("http://127.0.0.1:5000/api/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // Handle successful registration
      setMessage("Registration successful! Redirecting to login...");
      setFirstName(""); // Clear the first name field
      setLastName(""); // Clear the last name field
      setEmail(""); // Clear the email field
      setPassword(""); // Clear the password field
      setConfirmPassword(""); // Clear the confirm password field

      // Redirect to login page after a short delay
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      // Handle error and display the message from backend
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>

      {/* First Name */}
      <div className="w-full max-w-md mb-4">
        <label htmlFor="firstName" className="block text-lg font-medium text-gray-700 mb-2">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Last Name */}
      <div className="w-full max-w-md mb-4">
        <label htmlFor="lastName" className="block text-lg font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Email */}
      <div className="w-full max-w-md mb-4">
        <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Password */}
      <div className="w-full max-w-md mb-4">
        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Confirm Password */}
      <div className="w-full max-w-md mb-6">
        <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <button
        onClick={handleRegister}
        className="px-4 py-2 bg-green-600 text-white rounded w-full max-w-md"
      >
        Register
      </button>

      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
