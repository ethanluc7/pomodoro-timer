"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AccountSettings() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
      setIsLoggedIn(true);
      setUserEmail(email);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg max-w-md mx-auto relative">
      {isLoggedIn ? (
        <>
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>

          <button
            className="flex items-center justify-center px-4 py-2 border text-white rounded-lg mb-6 hover:bg-gray-800"
            onClick={handleLogout}
          >
            <span className="mr-2">Log out</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4.75A.75.75 0 013.75 4h9.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V5.5H4.5v9h7.25v-.75a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75h-9.5a.75.75 0 01-.75-.75v-11z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M17.78 10.53a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06-1.06L15.69 11H9.25a.75.75 0 010-1.5h6.44l-1.97-1.97a.75.75 0 011.06-1.06l3 3z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Sync timer settings, themes and more with an account!
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

          <p className="text-sm mb-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-500">
              Register here.
            </a>
          </p>
        </>
      )}
    </div>
  );
}
