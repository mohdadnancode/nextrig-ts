import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-z][a-z0-9_]*$/, "Invalid username"),

    email: z
        .string()
        .email(),

    password: z
        .string()
        .min(6)
        .max(100),
});
