import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email address.");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(200, "Password is too long.");

export const SignupSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email,
  password,
});

export const LoginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});

export const ForgotPasswordSchema = z.object({ email });

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password,
});

export const RoleUpdateSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["ADMIN", "BRO", "RANDO"]),
});
