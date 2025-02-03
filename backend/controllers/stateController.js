import stateScheama from '../models/state.model.js'
export const CreatestateController = async (req,res)=>{
    try {
       const {name} = req.body 
       if(!name){
        return res.status(401).send({message:'name is required'})
    }
    const exisitingstate = await stateScheama.findOne({name})
    if(exisitingstate){
        return res.status(200).send({
            success:true,
            message:'state already exists'
        })
    }
    const state = await stateScheama({name}).save()
    res.status(201).send({
        success:true,
        message:'New state Created',
        state
    })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'error in state'
        })
        
    }
}

export const updatestateController = async (req,res) =>{
    try {
        const {name}=req.body;
        const {id} =req.params;
        const state = await stateScheama.findByIdAndUpdate(id,{name},
            {new:true}
        );
        res.status(200).send({
            success:true,
            message:'state Updated Successfully',
            state,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error While Updating state'
        })
        
    }
}

export const singlestateController = async (req,res) =>{
    try {
        const {_id} =req.params;
        const state = await stateScheama.findOne({_id});
        res.status(200).send({
            state,
            success:true,
            message:'Get Single state Sucessfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting Single state'
        })
            }
};

export const stateController = async (req, res) => {
    try {
      const state = await stateScheama.find();
      res.status(200).send({
        success: true,
        message: "All State List",
        state,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };


export const deletestateController = async(req,res)=>{
    try {
       const {id} =req.params;
       await stateScheama.findByIdAndDelete(id);
       res.status(200).send({
        success:true,
        message:'Successfully Deleted state'
       })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'error in deleting state',
        });
        
        
    }
}