import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },
  
  
  },
  { timestamps: true }
);



export default mongoose.model("sites", siteSchema);

