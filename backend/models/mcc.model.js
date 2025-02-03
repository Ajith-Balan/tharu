import mongoose from "mongoose";

const mccSchema = new mongoose.Schema(
  {
    sitemanager: {
      type: String,
      required: true,
    },
    supervisor:{
type:String
    },
    livework:{
      type:String
    },
    productDescription: {
      type: String,
      required: true,
    }, 
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    payment: {
      type: String,
      default: "processing", // Default value for payment
    },
    userName: {
      type: String,
      required: true,
    },
    userid:{
      type:String
    },
    photo:{
      type:String,
      required:true
    },
    userPhone: {
      type: Number, 
      required: true,
    },
    user2Phone: {
      type: Number,
    },

    userAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending", // Default value for status
    },
  },
  { timestamps: true }
);

export default mongoose.model("mcc", mccSchema);
