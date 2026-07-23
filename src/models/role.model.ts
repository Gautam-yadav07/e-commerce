import mongoose from 'mongoose';


const roleSchema = new mongoose.Schema({
  id:{
    type:Number,
  },
  role_name:{
    type:String,
    enum:["CUSTOMER", "SELLER", "ADMIN",],
    default:"CUSTOMER",
    unique:true
  },
},{timestamps:true})


export const RoleModel = mongoose.model("Role", roleSchema);