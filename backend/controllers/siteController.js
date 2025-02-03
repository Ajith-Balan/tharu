import siteModel from "../models/site.model.js";
import stateModel from '../models/state.model.js'
export async function createsiteController(req, res) {
  try {
    const { name, state } = req.body;

    // Validation (add additional checks if necessary)
    // if (!name || !state) {
    //   return res.status(400).send({ error: "All fields are required" });
    // }
       const exisitingtype = await siteModel.findOne({name})
        if(exisitingtype){
            return res.status(200).send({
                success:true,
                message:'This site already exists'
            })
        }

    // Create the site
    const site = await siteModel.create({
      name,
  
      state,
    });

    // Send success response with the created site
    res.status(201).send({
      success: true,
      message: "site Created Successfully",
      site, // send the created site back
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating site",
    });
  }
}




export async function getsitecontroller(req,res){
  try{

      const data=await siteModel.find();
      res.status(200).send(data)
  }catch (error){
      res.status(500).send(error)
  }
}





export async function getonesite(req,res) {
  try {
      const {id}=req.params;
      const data = await siteModel.findOne({_id:id})
      res.status(200).send(data)
  } catch (error) {
      res.status(400).send(error)
  }
}





export async function updatesite(req,res){
  try{
      const {id}=req.params;
      const{...data}=req.body
      await siteModel.updateOne({_id:id},{$set:{...data}})
      res.status(201).send({msg:"updated"})
      
  }catch (error){
      res.status(400).send(error)
}
}



export async function deletesite(req,res){
  try{
      const {id}=req.params;
      await siteModel.deleteOne({_id:id});
      res.status(200).send({msg:"sucessfully deleted"})
  }catch (error){
      console.error(error);
      res.status(400).send({error})
  }
}

export const siteStateController = async (req, res) => {
  try {
    const { id } = req.params; 
    const states = await stateModel.findOne({ _id: id }); // Fetch state by id
    if (!states) {
      return res.status(404).send({
        success: false,
        message: 'state not found',
      });
    }

    // Fetch sites by state _id (use state._id)
    const sites = await siteModel.find({ state: states._id });

    res.status(200).send({
      success: true,
      states,
      sites,
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: 'Error while getting sites',
    });
  }
};






export const searchsiteController = async(req,res)=>{
  try {
    const {keyword}= req.params
    const results= await siteModel.find({
      
      $or:[
        {name:{$regex : keyword,$options :"i"}},
        {description:{$regex : keyword,$options:"i"}}
      ]
    })
    res.send(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message:"error in search site"
    })
    
  }
}