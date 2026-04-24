import rateLimit from "express-rate-limit";

// general limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    message: "Too many requests, try again later",
});

// stricter for auth
export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: "Too many auth attempts, slow down",
});