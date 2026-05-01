import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/useAuth";
import toast from "react-hot-toast";
import api from "../../api/client";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";

/* ------------------ Types ------------------ */

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "reserved";

/* ------------------ Component ------------------ */

const Register = () => {
  const navigate = useNavigate();
  const { register, authError: contextError, authLoading } = useAuth();
  const [localError, setLocalError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");

  /* ------------------ Validation ------------------ */

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .matches(/^[a-z]/, "Username must start with a letter")
      .matches(/^[a-z0-9_]*$/, "Only lowercase letters, numbers, and underscores")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "At least 8 characters")
      .matches(/[A-Z]/, "Must include uppercase letter")
      .matches(/[0-9]/, "Must include a number")
      .matches(/[^A-Za-z0-9]/, "Must include special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  /* ------------------ Formik ------------------ */

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLocalError("");

      if (usernameStatus === "taken" || usernameStatus === "reserved") {
        toast.error("Please choose a valid username");
        setSubmitting(false);
        return;
      }

      try {
        const result = await register({
          username: values.username,
          email: values.email,
          password: values.password,
        });

        if (result.success && result.email) {
          toast.success("OTP sent to your email");
          navigate("/verify-otp", { state: { email: result.email } });
        } else {
          if (result.field === "email") {
            formik.setFieldError("email", result.message || "");
          } else if (result.field === "username") {
            formik.setFieldError("username", result.message || "");
          } else {
            setLocalError(result.message || "Registration failed");
          }
        }
      } catch {
        setLocalError("Something went wrong. Please try again.");
        toast.error("Registration failed. Try again!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ------------------ Username debounce check ------------------ */

  useEffect(() => {
    const username = formik.values.username.trim();

    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/users/check-username/${username}`);

        if (res.data.reason === "reserved") {
          setUsernameStatus("reserved");
        } else if (!res.data.available) {
          setUsernameStatus("taken"); // ← this was the bug: was never being set
        } else {
          setUsernameStatus("available");
        }
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formik.values.username]);

  /* ------------------ Password strength ------------------ */

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(formik.values.password);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "text-red-400", "text-yellow-400", "text-yellow-300", "text-green-400"][strength];
  const barColor = (i: number) =>
    strength >= i
      ? strength <= 2 ? "bg-red-500" : strength === 3 ? "bg-yellow-400" : "bg-green-400"
      : "bg-white/10";

  /* ------------------ Username status helpers ------------------ */

  const usernameMessage: Record<UsernameStatus, { text: string; color: string } | null> = {
    idle: null,
    checking: null,
    available: { text: "Username available", color: "text-green-400" },
    taken: { text: "Username already taken", color: "text-red-400" },
    reserved: { text: "This username is not allowed", color: "text-red-400" },
  };

  /* ------------------ UI ------------------ */

  return (
    <section className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">

        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Create account</h1>
        <p className="text-sm text-gray-500 mb-7">
          Join NextRig to start building your dream setup.
        </p>

        {/* Global error */}
        {(localError || contextError) && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
            {localError || contextError}
          </div>
        )}

        <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>

          {/* ── Username ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="neo_builder"
                value={formik.values.username}
                onChange={(e) => {
                  // Force lowercase, strip invalid chars, enforce letter-start
                  const raw = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                  formik.setFieldValue("username", raw);
                }}
                onBlur={formik.handleBlur}
                className={`w-full pr-10 rounded-lg bg-white/[0.05] border text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition placeholder-gray-600 ${
                  usernameStatus === "available"
                    ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/20"
                    : usernameStatus === "taken" || usernameStatus === "reserved"
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-[#76b900] focus:ring-[#76b900]/20"
                }`}
              />
              {/* Status icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === "checking" && (
                  <Loader2 size={15} className="text-gray-400 animate-spin" />
                )}
                {usernameStatus === "available" && (
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-green-400 flex items-center justify-center">
                    <Check size={12} className="text-green-400" strokeWidth={3} />
                  </div>
                )}
                {(usernameStatus === "taken" || usernameStatus === "reserved") && (
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-red-400 flex items-center justify-center">
                    <X size={12} className="text-red-400" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            {/* Username status message */}
            {usernameMessage[usernameStatus] && (
              <p className={`text-xs mt-1.5 ${usernameMessage[usernameStatus]!.color}`}>
                {usernameMessage[usernameStatus]!.text}
              </p>
            )}
            {/* Formik validation error (only show if no status message) */}
            {!usernameMessage[usernameStatus] && formik.touched.username && formik.errors.username && (
              <p className="text-xs text-red-400 mt-1.5">{formik.errors.username}</p>
            )}
          </div>

          {/* ── Email ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="email">
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
              <p className="text-xs text-red-400 mt-1.5">{formik.errors.email}</p>
            )}
          </div>

          {/* ── Password ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
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

            {/* Strength bar */}
            {formik.values.password && (
              <>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${barColor(i)}`} />
                  ))}
                </div>
                <p className={`text-xs mt-1 ${strengthColor}`}>
                  {strengthLabel} password
                </p>
              </>
            )}

            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-400 mt-1.5">{formik.errors.password}</p>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-lg bg-white/[0.05] border text-white px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 transition placeholder-gray-600 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : formik.values.confirmPassword && !formik.errors.confirmPassword
                    ? "border-green-500/40 focus:border-green-500 focus:ring-green-500/20"
                    : "border-white/10 focus:border-[#76b900] focus:ring-[#76b900]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1.5">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={formik.isSubmitting || authLoading || usernameStatus === "checking"}
            className="w-full rounded-lg bg-[#76b900] hover:bg-[#68a500] hover:shadow-[0_0_16px_rgba(118,185,0,0.35)] text-black font-bold py-3 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {authLoading || formik.isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6 text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="text-[#76b900] hover:text-[#68a500] font-medium transition-colors"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>
      </div>
    </section>
  );
};

export default Register;