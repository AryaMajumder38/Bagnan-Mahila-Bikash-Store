import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    
  });

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-z0-9_][a-z0-9]*[a-z0-9]$/,
        "Username can only contain lowercase letters, numbers, and underscores. It must start and end with a letter or number."
      )
      .refine(
        (val) => !val.includes("__"),
        "Username cannot contain consecutive underscores"
      )
      .transform((val) => val.toLowerCase())
  });