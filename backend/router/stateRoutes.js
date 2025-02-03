import express from "express";
import { isAdmin,requireSignIn } from "../middlewares/authmiddleware.js";
import {stateController,CreatestateController,updatestateController,singlestateController,deletestateController} from '../controllers/stateController.js'

const router=express.Router()

router.post('/create-states',requireSignIn,isAdmin,CreatestateController,)

router.put(
    "/update-states/:id",
    requireSignIn,
    isAdmin,
    updatestateController
);
router.get("/get-states",stateController)
router.get("/single-states/:id",singlestateController);




  router.delete(
    "/delete-states/:id",
    requireSignIn,
    isAdmin,
   deletestateController
  );
export default router