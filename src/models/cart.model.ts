import mongoose, {Schema} from 'mongoose';


const cartSchema = new Schema({
  id:{
    type:Number,
    required:true,
  },
  user_id:{
    type:Number,
    required:true,
  }
},{timestamps:true});


export const CartModel = mongoose.model("Cart", cartSchema);