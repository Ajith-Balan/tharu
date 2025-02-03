
import mongoose,{Mongoose,model}from 'mongoose'

const stateSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    }
})

export default mongoose.model.state || mongoose.model('state',stateSchema)
