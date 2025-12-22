import React, { useState } from "react";
// 1. Import hooks and actions
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../redux/authSlice";
// Note: In TSX you might need to define RootState type, but for now we skip strict typing
import {
  Pill,
  Activity,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

function AuthComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch<any>(); // typed as any for simplicity in JS/TS mix

  // 2. Select state from Redux
  const { loading, error } = useSelector((state: any) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // 3. Dispatch Login
      dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );
    } else {
      // 4. Dispatch Signup
      dispatch(
        signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* LEFT SIDE: Brand Area (Same as before) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-emerald-600">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900 opacity-90 z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-400 opacity-20 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-20 flex flex-col justify-center px-16 text-white h-full">
          <div className="mb-8 p-3 bg-white/20 w-fit rounded-2xl backdrop-blur-sm">
            <Activity size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            PharmaCare<span className="text-emerald-300">.</span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-md leading-relaxed">
            Manage your pharmacy inventory, track prescriptions, and handle
            orders with a secure, professional platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin
                ? "Enter your credentials to access the dashboard."
                : "Join your team and start managing inventory."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                onChange={handleChange}
                required
              />
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                {typeof error === "string" ? error : "Authentication failed"}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  // Clear errors when switching modes
                }}
                className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-all"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
