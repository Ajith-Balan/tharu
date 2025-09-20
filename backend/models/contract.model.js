import mongoose from "mongoose";

const contractschema = new mongoose.Schema(
  {
    contractperiod: {
      type: String,
      required: true,
      default: "01/12/2024 - 01/20/2026"

    },
    totalcoach:{
type:Number
    },
      month:{
type:String
    },
 
    consumed: {
      type: Number,
      required: true,
    },
  billvalue:{
    type:Number
  },

penalty: {
      type: Number,
    },
 

    netamount: {
      type: Number,
    
    },
  },
  { timestamps: true }
);

export default mongoose.model("contract", contractschema);
