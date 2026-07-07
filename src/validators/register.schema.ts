import { z} from 'zod'


export const registerSchema = z.object({
  name:z.string().min(3).trim(),
  email:z.email("Invalid email format").lowercase().trim()
})