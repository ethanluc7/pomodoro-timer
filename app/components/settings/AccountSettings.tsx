"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AccountSettings({
  onLoginSuccess,
  isLoggedIn,
  onLogout,
}: {
  onLoginSuccess: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}) {
  const router = useRouter(); // Use the Next.js router for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        email,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      setMessage("Login successful!");
      setTimeout(() => {
        onLoginSuccess();
        setMessage("");
      }, 1500);
    } catch (error: any) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg max-w-md mx-auto relative">
      {isLoggedIn ? (
        <>
          <h2 className="text-2xl font-bold mb-4">You are logged in</h2>
          <button
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            onClick={onLogout}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Sync timer settings, sounds, and data with an account!
          </h2>

          <form>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md text-black"
            />

            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md text-black"
            />

            <button
              type="button"
              className="w-full px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 mb-4"
              onClick={handleLogin}
            >
              Log in
            </button>
          </form>

          <button
            onClick={() => router.push("/register")} // Navigate to the /register page
            className="w-full px-4 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-600"
          >
            Don't have an account? Register
          </button>

          {message && <p className="text-green-500 mt-2">{message}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
