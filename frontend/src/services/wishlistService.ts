import api from "../api/client";

export const getWishlistAPI = () => api.get("/wishlist");

export const toggleWishlistAPI = (productId: string) =>
  api.post("/wishlist/toggle", { productId });

export const clearWishlistAPI = () => api.delete("/wishlist/clear");
