import mongoose, {Mongoose,model}from "mongoose";
const userSchema=new mongoose.Schema
({

   
    name: {
        type: String,
        required: true,
      },
   
         
    sitename: {
        type: String,
      },

        work: {
        type: String,
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
        type: Number,
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
