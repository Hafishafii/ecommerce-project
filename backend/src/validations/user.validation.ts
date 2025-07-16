import { z } from "zod";

export const userZodSchema = z.object({
    phone: z
        .string({ required_error: "Phone number is required" })
        .trim()
        .regex(/^[6-9]\d{9}$/, {
            message: "Phone number must be a valid 10-digit number.",
        }),
    isPhoneVerified: z.boolean().optional().default(false),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address")
        .optional(),

    isEmailVerified: z.boolean().optional().default(false),

    name: z
        .string()
        .trim()
        .max(50, "Name must be under 50 characters")
        .optional(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long"),

    createdAt: z.date().optional().default(() => new Date()),
});
