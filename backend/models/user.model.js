import mongoose, {Mongoose,model}from "mongoose";
const userSchema=new mongoose.Schema
({

   
    name: {
        type: String,
        required: true,
      },
   
  
      phone: {
        type: Number,
        required: true,
      },

      email: {
        type: String,
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
        required: true,
      },

        ifsccode: {
        type: String,
        required: true,
      },
       bank: {
        type: String,
        required: true,
      },
         branch: {
        type: String,
        required: true,
      },
        uanno: {
        type: Number,
        required: true,
      },
         
          esino: {
        type: Number,
        required: true,
      },
         designation: {
        type: String,
        required: true,
      },
         status: {
        type: String,
        default:"Active"
      },
              password: {
        type: String,
       
      },
      
      
   
  
      role: {
        type: Number,
        default:0
      },
    },
    { timestamps: true }

)
export default mongoose.model.users || mongoose.model('users',userSchema)
