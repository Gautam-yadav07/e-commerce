import mongoose from 'mongoose';

const userSchema  = new mongoose.Schema({
  id:{
    type:Number,
    unique:true,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true,
  },
  password:{
    type:String,
    required:true,
  },
  phone_number:{
    type:String,
    required:true,
    unique:true
  },
  gender:{
    type: String,
    enum:["MALE", "FEMALE", "OTHER"]
  },
  role_id:{
    type:Number,
  },
  refresh_token:{
    type:String,
    default:null
  },
  reset_password_token:{
    type:String,
    default:null,
  },
  reset_password_expiry:{
    type:Date,
    default:null
  }

},{
    timestamps:true
  })


export const UserModel = mongoose.model("User",userSchema);