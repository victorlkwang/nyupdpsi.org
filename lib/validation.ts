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

// --- Roster (brothers & pledge classes) -------------------------------------

const optionalText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((v) => (v ? v : undefined));

/** Coerce "" | "123" | undefined -> number | null, staying within sane bounds. */
const optionalInt = (min: number, max: number) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === "" || v === null) return null;
      const n = typeof v === "number" ? v : parseInt(v, 10);
      return Number.isNaN(n) ? null : n;
    })
    .refine((n) => n === null || (n >= min && n <= max), `Must be between ${min} and ${max}.`);

export const PledgeClassSchema = z.object({
  name: z.string().trim().min(1, "Class name is required.").max(60),
  term: optionalText,
});

export const BrotherSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: optionalText,
  pledgeName: z.string().trim().min(1, "Pledge name is required.").max(120),
  classId: z.string().min(1, "Class is required."),
  status: z.enum(["ACTIVE", "ALUMNI"]),
  crossingNumber: optionalInt(1, 100000),
  gradYear: optionalInt(1990, 2100),
  major: optionalText,
  instagram: optionalText.transform((v) => v?.replace(/^@/, "")),
  bigId: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
});

export const StatusUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "ALUMNI"]),
});

// --- Messaging --------------------------------------------------------------

export const MessageTemplateSchema = z.object({
  kind: z.enum(["THANK_YOU", "GOOD_KID"]),
  emailSubject: z.string().trim().min(1, "Email subject is required.").max(200),
  emailBody: z.string().trim().min(1, "Email body is required.").max(5000),
  smsBody: z.string().trim().min(1, "Text message is required.").max(1000),
});

// --- Attendance -------------------------------------------------------------

export const AttendanceSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  // Kept loose here; normalized + validated as an nyu.edu address in the route.
  nyuEmail: z.string().trim().min(1, "NYU email is required.").max(200),
  phoneNumber: z.string().trim().min(1, "Phone number is required.").max(40),
  instagramHandle: z.string().trim().max(60).optional().or(z.literal("")),
  // Honeypot — bots that fill it get a fake success.
  company: z.string().optional().or(z.literal("")),
});
