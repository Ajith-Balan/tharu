import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js"
import { createtypeController, deletetype, districtwiseworktypeController, getonetype, gettypecontroller, searchtypeController, statewiseworktypeController, updatetype } from "../controllers/worktypeController.js"

const router = express.Router()



router.post('/create-worktype', requireSignIn, isAdmin, createtypeController)


router.get('/get-worktype', gettypecontroller)


router.get('/getone-worktype/:id', getonetype)

router.post('/update-worktype/:id', updatetype)


router.delete('/delete-worktype/:id', deletetype)

router.get('/getstatewise-worktype/:id', statewiseworktypeController)

router.get('/getdistrictwise-worktype/:id', districtwiseworktypeController)



router.get('/search/:keyword', searchtypeController)




export default router
