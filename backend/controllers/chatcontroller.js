import chatModel from "../models/chat.model.js";

export async function createchatController(req, res) {
  try {
    const { text,user } = req.body;

    // Validation (add additional checks if necessary)

    // Create the train
    const chat = await chatModel.create({
      text,user
    });

    // Send success response with the created site
    res.status(201).send({
      success: true,
      message: "Contract Created Successfully",
      chat, 
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


export async function getchats(req,res) {
  try {
    const chats= await chatModel.find()
    res.status(200).send({
      success:true,
      message:"gett chats",
      chats
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      error,
      message: "error in getting bill details"
    })
  
    
  }
}


export async function getonechat(req,res) {
  try {
      const {id}=req.params;
      const chat = await chatModel.findOne({_id:id})
      res.status(200).send(chat)
  } catch (error) {
      res.status(400).send(error)
  }
}



export async function updatechat(req,res){
  try{
      const {id}=req.params;

      const{...data}=req.body
      await chatModel.updateOne({_id:id},{$set:{...data}})
      res.status(201).send({msg:"updated"})
      
  }catch (error){
      res.status(400).send(error)
}
}



export async function deletechat(req,res){
  try{
      const {id}=req.params;
      await chatModel.deleteOne({_id:id});
      res.status(200).send({msg:"sucessfully deleted"})
  }catch (error){
      console.error(error);
      res.status(400).send({error})
  }
 }