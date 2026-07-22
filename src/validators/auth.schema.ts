import { z } from 'zod';


export const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase()
})


export const resetPasswordSchema = z.object({
  token: z.string().trim(),
  password: z.string().min(8).max(30).trim()
})