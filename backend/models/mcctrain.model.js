import mongoose from "mongoose";

const mcctrainSchema = new mongoose.Schema(
  {
    trainno: {
      type: String,
      required: true,
    },
    supervisor:{
type:String
    },
 
    totalcoach: {
      type: Number,
      required: true,
    },
  type:{
    type:String
  },

workers: {
      type: Number,
      required: true,
    },
 
    site:{
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
