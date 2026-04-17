import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

/* ------------------ Types ------------------ */

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/* ------------------ Component ------------------ */

const Register = () => {
  const navigate = useNavigate();
  const { register, authError: contextError, authLoading } = useAuth();
  const [localError, setLocalError] = useState<string>("");

  /* ------------------ Validation ------------------ */

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLocalError("");

      try {
        const result = await register({
          username: values.username,
          email: values.email,
          password: values.password,
        });

        if (result.success) {
          toast.success("Account created successfully!");
          resetForm();
          navigate("/login");
        } else {
          setLocalError("Email already registered or invalid data.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setLocalError("Something went wrong. Please try again.");
        toast.error("Registration failed. Try again!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ------------------ UI ------------------ */

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Create account
        </h1>
        <p className="text-gray-400 mb-6">
          Join NextRig to start building your dream setup.
        </p>

        {(localError || contextError) && (
          <div className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {localError || contextError}
          </div>
        )}

        <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
          {/* Username */}
          <div>
            <label
              className="block text-sm text-gray-300 mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="NeoBuilder"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5 focus:outline-none focus:border-[#76b900] focus:ring-2 focus:ring-[#76b900]/40 transition"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="email">
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
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5 focus:outline-none focus:border-[#76b900] focus:ring-2 focus:ring-[#76b900]/40 transition"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm text-gray-300 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5 focus:outline-none focus:border-[#76b900] focus:ring-2 focus:ring-[#76b900]/40 transition"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-sm text-gray-300 mb-1"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5 focus:outline-none focus:border-[#76b900] focus:ring-2 focus:ring-[#76b900]/40 transition"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting || authLoading}
            className="before:ease relative w-full overflow-hidden border border-[#76b900] bg-[#76b900] hover:bg-[#68a500] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-[glow_2s_ease-in-out_infinite] before:absolute before:right-0 before:top-0 before:h-full before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-[0_0_10px_#76b900] hover:before:-translate-x-40"
          >
            <span className="relative z-10">
              {authLoading ? "Creating Account..." : "Create Account"}
            </span>
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline transition-colors"
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
