import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";
import AdminRoutes from "./admin/routes/AdminRoutes";

/* -------- Public -------- */
const Home = lazy(() => import("./pages/public/Home"));
const Products = lazy(() => import("./pages/public/Products"));
const ProductDetails = lazy(() => import("./pages/public/ProductDetails"));

/* -------- Auth -------- */
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));

/* -------- User -------- */
const Cart = lazy(() => import("./pages/user/Cart"));
const Checkout = lazy(() => import("./pages/user/Checkout"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const MyOrders = lazy(() => import("./pages/user/MyOrder"));

/* -------- Footer -------- */
const About = lazy(() => import("./pages/footer-pages/About"));
const Contact = lazy(() => import("./pages/footer-pages/Contact"));
const Careers = lazy(() => import("./pages/footer-pages/Careers"));
const FAQ = lazy(() => import("./pages/footer-pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/footer-pages/PrivacyPolicy"));
const Returns = lazy(() => import("./pages/footer-pages/Returns"));

/* -------- Misc -------- */
const NotFound = lazy(() => import("./pages/NotFound"));

const App: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] text-primary text-lg font-medium">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          {/* Auth */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Protected User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* User */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<MyOrders />} />

          {/* Footer */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/returns" element={<Returns />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
