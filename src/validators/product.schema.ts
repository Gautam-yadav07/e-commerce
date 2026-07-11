import {z} from 'zod'
import { ProductStatus } from '../generated/prisma/enums.js';

export const productSchema = z.object({
  name:z.string().min(5).trim(),
  price:z.number(),
  discount:z.number(),
  stock:z.number().min(1),
  status:z.enum(ProductStatus),
  description:z.string()
}) 

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  discount: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
});