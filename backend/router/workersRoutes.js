import express from "express"
import { isManager, requireSignIn } from "../middlewares/authmiddleware.js"
import { bulkUploadController, findifsc, getOneworker, getworkers, registerController, updateProfile, upload } from "../controllers/workersController.js"

const router = express.Router()



router.post('/create-worker', registerController )


router.get('/get-ifsc/:code', findifsc)


router.get('/get-workers', getworkers)

router.get('/getoneworker/:id', getOneworker)


router.put('/update-worker/:id', updateProfile)

router.post('/uploadbulkdata',upload, bulkUploadController)



// router.delete('/delete-worktype/:id', deletetype)

// router.get('/getstatewise-worktype/:id', statewiseworktypeController)

// router.get('/getdistrictwise-worktype/:id' , districtwiseworktypeController)



// router.get('/search/:keyword', searchtypeController)




export default router
