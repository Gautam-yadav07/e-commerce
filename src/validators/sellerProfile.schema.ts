import {z} from 'zod';


export const sellerProfileSchema = z.object({

  ifsc_code:z.string().min(11, "Enter a valid ifsc code").max(11, "Enter a valid ifsc code").trim(),

  gst_number:z.string().min(15, "Enter a valid gst number").max(15,"Enter a valid gst number").trim(),

  bank_account_number:z.string().max(10).trim(),

  shop_name:z.string().min(4).max(50).trim()

})