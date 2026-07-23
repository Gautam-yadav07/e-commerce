import mongoose from "mongoose";


const counterSchema = new mongoose.Schema({
  id:{type:String, required:true},
  seq:{type:Number, default:0}
})


export const CounterModel = mongoose.model("Counter", counterSchema);


export const getNextId = async(name:string)=>{
  const nextId = await CounterModel.findByIdAndUpdate(
    name,
    {$inc:{seq:1},},
    {new:true, upsert:true}
  )
  return nextId.seq
}