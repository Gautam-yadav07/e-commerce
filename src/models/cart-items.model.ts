import mongoose, {Schema} from 'mongoose'
import { required } from 'zod/mini'


const cartItemSchema = new Schema({
  id:{
    type:Number,
    required:true
  },
  cart_id:{
    type:Number,
    required:true
  },
  product_id:{
    type:Number,
    required:true
  },
  quantity:{
    type:Number,
    min:1,
    default:1
  },
  price:{
    type:Number,
    required:true
  },

},{timestamps:true})


export const CartItemModel = mongoose.model("CartItem", cartItemSchema)


