import mongoose from "mongoose";

const chatschema = new mongoose.Schema(
  {
    

    text: {
      type: String,
    
    },
     user: {
      type: String,
    
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("chat", chatschema);

