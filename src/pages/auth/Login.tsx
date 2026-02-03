import { useState } from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

  /* ------------------ Validation ------------------ */

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  /* ------------------ Formik ------------------ */

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLocalError("");

      try {
        const result = await login(values.email, values.password);

        if (result.success && result.user) {
          toast.success("Login successful!");

          if (result.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          setLocalError("Invalid email or password.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setLocalError("Something went wrong. Please try again.");
        toast.error("Login failed. Try again!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ------------------ UI ------------------ */

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-6">
          Sign in to continue your NextRig experience.
        </p>

        {(localError || contextError) && (
          <div className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {localError || contextError}
          </div>
        )}

        <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5"
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
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting || authLoading}
            className="w-full bg-[#76b900] text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="text-[#76b900] hover:underline"
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
