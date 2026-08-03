"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Leaf, Truck } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to sign up");
          setLoading(false);
          return;
        }

        setMode("signin");
        setEmail("");
        setPassword("");
        setName("");
        setLoading(false);
        setError("Account created successfully! Please sign in.");
        return;
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/60 focus:bg-white/15 transition-all";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f2e1c]">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-700/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-6xl relative z-10 px-4"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
          {/*  Left panel  */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-green-800/60 to-[#132e1f]/80">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 mb-8">
                <img src="/pureststem_logo.png" alt="PurestStem" className="h-12 w-auto bg-white rounded-xl px-2 py-1" />
              </Link>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Welcome to{" "}
                <span className="text-green-300">PurestStem</span>
              </h2>
              <p className="text-green-100/80 leading-relaxed max-w-sm">
                Sign in to track orders, save your favorites, and get exclusive herbal wellness tips.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Leaf, text: "100% natural herbal products" },
                { icon: Truck, text: "Cash on delivery across Pakistan" },
                { icon: ShieldCheck, text: "Trusted by 50,000+ customers" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-green-100/90">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/*  Right panel  */}
          <div className="p-6 md:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="lg:hidden flex items-center justify-center gap-2 mb-4"
              >
                <img
                  src="/pureststem_logo.png"
                  alt="PurestStem - Premium Herbal Products Pakistan"
                  className="h-16 w-auto bg-white rounded-xl px-2 py-1"
                />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-green-100/70">
                {mode === "signin"
                  ? "Sign in to your PurestStem account"
                  : "Join PurestStem for natural wellness"}
              </p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl text-sm ${
                      error.includes("successfully")
                        ? "bg-green-500/20 text-green-200 border border-green-500/30"
                        : "bg-red-500/20 text-red-200 border border-red-500/30"
                    }`}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium mb-1.5 text-white/90">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                      placeholder="Your name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-white/90">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-white/90">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClasses}
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] bg-white text-green-900 py-3 rounded-full font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  mode === "signin" ? "Signing in..." : "Creating account..."
                ) : mode === "signin" ? (
                  <>Sign In<ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Sign Up<Sparkles className="w-4 h-4" /></>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-white/60">
                {mode === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError("");
                      }}
                      className="text-green-300 font-medium hover:text-white transition-colors"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError("");
                      }}
                      className="text-green-300 font-medium hover:text-white transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </motion.form>

            <div className="mt-8 text-center">
              <Link
                href="/shop/products"
                className="inline-flex items-center gap-2 text-sm text-green-300/70 hover:text-green-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
