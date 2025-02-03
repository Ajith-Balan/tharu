import siteModel from "../models/site.model.js";
import stateModel from '../models/state.model.js'
import worktypeModel from "../models/worktype.model.js"

export async function createtypeController(req, res) {
  try {
    const { name, state, site } = req.body;

    // Validation (add additional checks if necessary)
    if (!name || !state || !site) {
      return res.status(400).send({ error: "All fields are required" });
    }
      //  const exisitingtype = await worktypeModel.findOne({name})
      //   if(exisitingtype){
      //       return res.status(200).send({
      //           success:true,
      //           message:'Type already exists'
      //       })
      //   }

    // Create the site
    const worktype = await worktypeModel.create({
      name,
  site,
      state,
    });

    // Send success response with the created site
    res.status(201).send({
      success: true,
      message: "state Created Successfully",
      worktype, // send the created site back
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating state",
    });
  }
}




export async function gettypecontroller(req,res){
  try{

      const data=await worktypeModel.find();
      res.status(200).send(data)
  }catch (error){
      res.status(500).send(error)
  }
}





export async function getonetype(req,res) {
  try {
      const {id}=req.params;
      const data = await worktypeModel.findOne({_id:id})
      res.status(200).send(data)
  } catch (error) {
      res.status(400).send(error)
  }
}





export async function updatetype(req,res){
  try{
      const {id}=req.params;
      const{...data}=req.body
      await worktypeModel.updateOne({_id:id},{$set:{...data}})
      res.status(201).send({msg:"updated"})
      
  }catch (error){
      res.status(400).send(error)
}
}



export async function deletetype(req,res){
  try{
      const {id}=req.params;
      await worktypeModel.deleteOne({_id:id});
      res.status(200).send({msg:"sucessfully deleted"})
  }catch (error){
      console.error(error);
      res.status(400).send({error})
  }
}

export const statewiseworktypeController = async (req, res) => {
  try {
    const { id } = req.params; 
    const state = await stateModel.findOne({ _id: id }); // Fetch state by id
    if (!state) {
      return res.status(404).send({
        success: false,
        message: 'state not found',
      });
    }

    // Fetch sites by state _id (use state._id)
    const sites = await worktypeModel.find({ state: state._id });

    res.status(200).send({
      success: true,
      state,
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




export const districtwiseworktypeController = async (req, res) => {
    try {
      const { id } = req.params; 
      const sites = await siteModel.findOne({ _id: id }); // Fetch state by id
      if (!sites) {
        return res.status(404).send({
          success: false,
          message: 'site not found',
        });
      }
  
  
      
  
      // Fetch sites by state _id (use state._id)
      const worktype = await worktypeModel.find({ site: sites._id });
  
      res.status(200).send({
        success: true,
        sites,
        worktype,
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
  
  
  




export const searchtypeController = async(req,res)=>{
  try {
    const {keyword}= req.params
    const results= await worktypeModel.find({
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