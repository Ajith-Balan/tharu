import mcctrainModel from "../models/mcctrain.model.js";
import contractModel from "../models/contract.model.js";
export async function createtrainController(req, res) {
  try {
    const { work,trainno,supervisor,totalcoach,workers,type,used,reqq,status,suppliedBedsheet } = req.body;

    // Validation (add additional checks if necessary)
    // if (!trainno ) {
    //   return res.status(400).send({ error: "All fields are required" });
    // }
     
      
    // Create the train
    const mcctrain = await mcctrainModel.create({
      work,trainno,supervisor,totalcoach,type,reqq,used,workers,status,suppliedBedsheet
    });

    // Send success response with the created site
    res.status(201).send({
      success: true,
      message: "site Created Successfully",
      mcctrain, // send the created site back
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









export async function getlivetraincontroller(req,res){
  try{
    

      const live=await mcctrainModel.find({status:"processing"});
      res.status(200).send(live)
  }catch (error){
      res.status(500).send(error)
  }
}


export async function getcompletedtraincontroller(req,res){
  try{

      const completed=await mcctrainModel.find({status:"completed"});
      res.status(200).send(completed)
  }catch (error){
      res.status(500).send(error)
  }
}


export async function getworktraincontroller(req,res){
  try{

      const completed=await mcctrainModel.find({work:"mcc"});
      res.status(200).send(completed)
  }catch (error){
      res.status(500).send(error)
  }
}




export async function getonetrain(req,res) {
  try {
      const {id}=req.params;
      const train = await mcctrainModel.findOne({_id:id})
      res.status(200).send(train)
  } catch (error) {
      res.status(400).send(error)
  }
}





export async function updatetrain(req,res){
  try{
      const {id}=req.params;
      const{...data}=req.body
      await mcctrainModel.updateOne({_id:id},{$set:{...data}})
      res.status(201).send({msg:"updated"})
      
  }catch (error){
      res.status(400).send(error)
}
}




export async function createcontractController(req, res) {
  try {
    const { month,totalcoach,consumed,billvalue,penalty,netamount } = req.body;

    // Validation (add additional checks if necessary)

    // Create the train
    const contract = await contractModel.create({
      month,totalcoach,consumed,billvalue,penalty,netamount
    });

    // Send success response with the created site
    res.status(201).send({
      success: true,
      message: "Contract Created Successfully",
      contract, 
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


export async function getBills(req,res) {
  try {
    const bills= await contractModel.find()
    res.status(200).send({
      success:true,
      message:"gett bills",
      bills
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      error,
      message: "error in getting bill details"
    })
  
    
  }
}


export async function getonebill(req,res) {
  try {
      const {id}=req.params;
      const bill = await contractModel.findOne({_id:id})
      res.status(200).send(bill)
  } catch (error) {
      res.status(400).send(error)
  }
}



export async function updatebill(req,res){
  try{
      const {id}=req.params;

      const{...data}=req.body
      await contractModel.updateOne({_id:id},{$set:{...data}})
      res.status(201).send({msg:"updated"})
      
  }catch (error){
      res.status(400).send(error)
}
}



export async function deletebill(req,res){
  try{
      const {id}=req.params;
      await contractModel.deleteOne({_id:id});
      res.status(200).send({msg:"sucessfully deleted"})
  }catch (error){
      console.error(error);
      res.status(400).send({error})
  }
 }




// export async function deletesite(req,res){
//   try{
//       const {id}=req.params;
//       await siteModel.deleteOne({_id:id});
//       res.status(200).send({msg:"sucessfully deleted"})
//   }catch (error){
//       console.error(error);
//       res.status(400).send({error})
//   }
// }







// export const searchsiteController = async(req,res)=>{
//   try {
//     const {keyword}= req.params
//     const results= await siteModel.find({
      
//       $or:[
//         {name:{$regex : keyword,$options :"i"}},
//         {description:{$regex : keyword,$options:"i"}}
//       ]
//     })
//     res.send(results);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({
//       success: false,
//       error,
//       message:"error in search site"
//     })
    
//   }
// }

