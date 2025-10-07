import mongoose, {Mongoose,model}from "mongoose";
const workerSchema=new mongoose.Schema
({

    name: {
        type: String,
        required: true,
      },
      
         work: {
        type: String,
        required: true,
      },
   
  
      phone: {
        type: Number,
        required: true,
      },

      aadhar: {
        type: String,
        required: true,
      },

      empid: {
        type: String,
        required: true,
      },

     wage: {
        type: Number,
        required: true,
      },

         acnumber: {
        type: Number,
      },

        ifsccode: {
        type: String,
      },
             bank: {
        type: String,
      },
         branch: {
        type: String,
      },
        uanno: {
        type: String,
      },
         
          esino: {
        type: Number,
      },
         designation: {
        type: String,
        required: true,
      },
         status: {
        type: String,
        default:"Active"
      },
      
   
    },
    { timestamps: true }

)
export default mongoose.model.workers || mongoose.model('workers',workerSchema)
