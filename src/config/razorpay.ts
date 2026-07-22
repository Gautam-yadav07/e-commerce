import Razorpay from "razorpay";
import dotenv from 'dotenv';

dotenv.config()

if(!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_SECRET_KEY){
  console.log("Razorpay API keys are not set in environment variable.")
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY ||'',
  key_secret: process.env.RAZORPAY_SECRET_KEY || ''

})