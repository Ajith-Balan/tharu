import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js"
import { createtrainController, getcompletedtraincontroller, getlivetraincontroller, getonetrain, updatetrain } from "../controllers/mcctrainController.js"

const router = express.Router()



router.post('/create-mcctrain', requireSignIn,  createtrainController)


router.get('/get-livemcctrain', getlivetraincontroller)
router.get('/get-completedmcctrain', getcompletedtraincontroller)


router.get('/getone-mcctrain/:id', getonetrain)

router.post('/update-mcctrain/:id', updatetrain)


// router.delete('/delete-site/:id', deletesite)



// router.get('/search/:keyword', searchsiteController)




export default router
