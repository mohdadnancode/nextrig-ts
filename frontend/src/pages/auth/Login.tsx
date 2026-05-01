import { useState } from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/useAuth";
import { Eye, EyeOff } from "lucide-react";

/* ------------------ Types ------------------ */

type LoginFormValues = {
  email: string;
  password: string;
};

/* ------------------ Component ------------------ */

const Login = () => {
  const navigate = useNavigate();
  const { login, authError: contextError, authLoading } = useAuth();
  const [localError, setLocalError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  /* ------------------ Validation ------------------ */

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  /* ------------------ Formik ------------------ */

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLocalError("");
      try {
        const result = await login(values.email, values.password);
        if (result.success) {
          toast.success("Login successful!");
          navigate("/");
        } else {
          setLocalError(result.message || "Invalid email or password.");
        }
      } catch {
        setLocalError("Something went wrong. Please try again.");
        toast.error("Login failed. Try again!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ------------------ UI ------------------ */

  return (
    <section className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mb-7">
          Sign in to continue your NextRig experience.
        </p>

        {(localError || contextError) && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
            {localError || contextError}
          </div>
        )}

        <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>
          {/* ── Email ── */}
          <div>
            <label
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-lg bg-white/[0.05] border text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition placeholder-gray-600 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-white/10 focus:border-[#76b900] focus:ring-[#76b900]/20"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-400 mt-1.5">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* ── Password ── */}
          <div>
            <label
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-lg bg-white/[0.05] border text-white px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 transition placeholder-gray-600 ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-[#76b900] focus:ring-[#76b900]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-400 mt-1.5">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={formik.isSubmitting || authLoading}
            className="w-full rounded-lg bg-[#76b900] hover:bg-[#68a500] hover:shadow-[0_0_16px_rgba(118,185,0,0.35)] text-black font-bold py-3 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {authLoading || formik.isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6 text-center">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="text-[#76b900] hover:text-[#68a500] font-medium transition-colors"
            onClick={() => navigate("/register")}
          >
            Create one
          </button>
        </p>
      </div>
    </section>
  );
};

export default Login;
