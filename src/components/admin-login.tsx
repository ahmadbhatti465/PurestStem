"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Shield, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-600 mt-1">Sign in to manage your store</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 md:p-8 rounded-xl border shadow-sm"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-700 p-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2.5 rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50 shadow-lg shadow-green-700/20"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </motion.form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-green-700 hover:underline inline-flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Back to Store
          </a>
        </div>
      </motion.div>
    </div>
  );
}
