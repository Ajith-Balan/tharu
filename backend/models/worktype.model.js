import mongoose from "mongoose";

const worktypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },
    site:{
        type:String,
        required:true
    }
  
  
  },
  { timestamps: true }
);



export default mongoose.model("worktypes", worktypeSchema);

