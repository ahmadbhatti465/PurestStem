"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Leaf, Loader2 } from "lucide-react";
import { AnimatedText } from "@/components/motion/animated-text";
import { Aurora, FallingLeaves } from "@/components/motion/aurora";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  function switchMode(next: "signin" | "signup") {
    setMode(next);
    setError("");
    setNotice("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (isSignup) {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to sign up");
          return;
        }

        setMode("signin");
        setPassword("");
        setName("");
        setNotice("Account created. Please sign in.");
        return;
      }

      const result = await signIn("credentials", { email, password, redirect: false });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      const session = await (await fetch("/api/auth/session")).json();
      window.location.href = session?.user?.role && session.user.role !== "user" ? "/admin" : "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[75vh] lg:grid-cols-2">
      <div className="relative isolate hidden flex-col justify-end overflow-hidden bg-green-950 p-14 text-white lg:flex">
        <Aurora />
        <FallingLeaves />
        <Leaf className="enter mb-6 h-10 w-10 text-green-200" strokeWidth={1.25} aria-hidden="true" />
        <p className="heading-lg max-w-md">
          <AnimatedText text="Nature. Purity. You." accent={["You."]} />
        </p>
        <p className="enter mt-4 max-w-sm text-green-100/85">Sixty years of mountain herbalism, one account away.</p>
      </div>

      <div className="flex items-center justify-center bg-green-50 px-4 py-12">
        <div className="surface enter w-full max-w-md p-6 sm:p-10">
          <h1 className="font-display text-3xl text-green-950">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSignup ? "Join PurestStem for natural wellness." : "Sign in to your PurestStem account."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{error}</p>}
            {notice && <p className="rounded-xl bg-green-100 p-3 text-sm text-green-900" role="status">{notice}</p>}

            {isSignup && (
              <div>
                <label htmlFor="login-name" className="field-label">Name</label>
                <input id="login-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="field" />
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="field-label">Email</label>
              <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="field" />
            </div>
            <div>
              <label htmlFor="login-password" className="field-label">Password</label>
              <input
                id="login-password"
                type="password"
                required
                minLength={isSignup ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? "signin" : "signup")}
              className="min-h-11 font-semibold text-green-900 underline-offset-4 hover:underline"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
