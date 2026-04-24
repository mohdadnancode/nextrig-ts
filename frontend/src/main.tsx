import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/Auth/AuthProvider";
import { CartProvider } from "./context/Cart/CartProvider";
import { WishlistProvider } from "./context/Wishlist/WishlistProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root container missing in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              containerStyle={{ top: 80 }}
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0b0b0b",
                  color: "#e5e7eb",
                  border: "1px solid rgba(118,185,0,0.3)",
                },
                success: {
                  iconTheme: {
                    primary: "#76b900",
                    secondary: "#000",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#000",
                  },
                },
              }}
            />
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
