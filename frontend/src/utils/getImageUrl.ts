/**
 * Safely extracts a URL from a product image entry.
 *
 * Old seeded products store images as plain strings: ["https://..."]
 * New admin-created products store them as objects: [{ url: "https://...", public_id: "..." }]
 *
 * This helper handles both formats so the frontend never breaks.
 */
export const getImageUrl = (
  image: string | { url: string; public_id: string } | undefined | null
): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object" && image.url) return image.url;
  return "";
};
