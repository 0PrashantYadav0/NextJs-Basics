import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be no more then 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    verifyCode: z.string().min(6, "Verification code must be at least 6 characters")
})