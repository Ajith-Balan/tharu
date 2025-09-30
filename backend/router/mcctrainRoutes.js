import express from "express"
import {  requireSignIn } from "../middlewares/authmiddleware.js"
import { createcontractController, createtrainController, deletebill, getBills, getcompletedtraincontroller, getlivetraincontroller, getonebill, getonetrain, updatebill, updatetrain } from "../controllers/mcctrainController.js"

const router = express.Router()



router.post('/create-mcctrain', requireSignIn,  createtrainController)


router.get('/get-livemcctrain', getlivetraincontroller)
router.get('/get-completedmcctrain', getcompletedtraincontroller)


router.get('/getone-mcctrain/:id', getonetrain)

router.put('/update-mcctrain/:id', updatetrain)


router.get('/getbills', getBills)
router.post('/createbill', createcontractController)
router.get('/getone-bill/:id', getonebill)
router.put('/update-bill/:id', updatebill)
router.delete('/delete-bill/:id', deletebill)











// router.delete('/delete-site/:id', deletesite)



// router.get('/search/:keyword', searchsiteController)




export default router
