import {z} from 'zod'

export const loginSchema = z.object({
  email:z.email("Invalid email format").lowercase().trim(),
  password:z.string().min(8).trim()
})