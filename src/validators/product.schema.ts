import {z} from 'zod'

export const productSchema = z.object({
  name:z.string().min(5).trim(),
  price:z.number(),
  // discount:z.number(),
  stock:z.number().min(1),
  status:z.string(),
}) 