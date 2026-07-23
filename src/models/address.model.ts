import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    id: {
      type: Number,
      required: true, 
      unique: true
    },
    user_id: { 
      type: Number, 
      required: true 
    },
    address_line: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    state: { 
      type: String, 
      required: true 
    },
    country: { 
      type: String, 
      required: true 
    },
    pin_code: { 
      type: String, 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

export const AddressModel = mongoose.model("Address", addressSchema);
