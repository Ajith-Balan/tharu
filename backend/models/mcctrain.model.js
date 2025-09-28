import mongoose from "mongoose";

const mcctrainSchema = new mongoose.Schema(
  {
       work:{
type:String
    },

    trainno: {
      type: String,
    },
    supervisor:{
type:String
    },
 
    totalcoach: {
      type: Number,
    },
  type:{
    type:String
  },
    reqq:{
    type:String
  }, 
   used:{
    type:String
  },

workers: {
      type: Array,
      required: true,
    },
 
      suppliedBedsheet:{
    type:String
  },
 
    status: {
      type: String,
      default: "processing", // Default value for status
    },
  },
  { timestamps: true }
);

export default mongoose.model("mcctrain", mcctrainSchema);
