import {z} from 'zod'


export const addressSchema = z.object({
    address_line:z.string().trim(),
    city:z.string().trim().min(3).max(30),
    state:z.string().min(3).trim(),
    country:z.string().min(3).trim(),
    pin_code:z.string().min(6).max(8).trim()

})