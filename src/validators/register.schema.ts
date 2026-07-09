
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
 
  email: z.email("Invalid email format").trim().toLowerCase(),

  password: z.string().trim().min(8, "Password must be at least 8 characters"),

  phone_number: z.string().trim().min(10).max(12),
    

  gender: z.enum(["male", "female", "other"], {
    error: "Gender must be male, female, or other",
  }),
});