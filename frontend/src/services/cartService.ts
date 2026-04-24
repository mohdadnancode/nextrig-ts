import api from "../api/client";

export const getCartAPI = () => api.get("/cart");

export const addToCartAPI = (productId: string) =>
  api.post("/cart/add", { productId });

export const removeFromCartAPI = (productId: string) =>
  api.delete(`/cart/remove/${productId}`);

export const updateCartAPI = (productId: string, quantity: number) =>
  api.put("/cart/update", { productId, quantity });

export const clearCartAPI = () => api.delete("/cart/clear");
