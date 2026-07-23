import mongoose, {Schema} from 'mongoose';


const sellerProfileSchema = new Schema({
  id:{
    type:Number,
    required:true
  },
  user_id:{
    type:Number,
    required:true,
  },
  bank_account_number:{
    type:String,
    required:true,
    unique:true
  },
  ifsc_code:{
    type:String,
    required:true,
  },
  gst_number:{
    type:String,
    required:true
  },
  shop_name:{
    type:String,
    required:true
  }
}, {timestamps:true})


export const SellerProfileModel = mongoose.model("SellerProfile", sellerProfileSchema);