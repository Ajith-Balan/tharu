import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js"
import { createsiteController, deletesite, getonesite, getsitecontroller, searchsiteController, updatesite, siteStateController,   } from "../controllers/siteController.js"

const router = express.Router()



router.post('/create-site', requireSignIn, isAdmin, createsiteController)


router.get('/get-site', getsitecontroller)


router.get('/getone-site/:id', getonesite)

router.post('/update-site/:id', updatesite)


router.delete('/delete-site/:id', deletesite)

router.get('/site-states/:id', siteStateController)


router.get('/search/:keyword', searchsiteController)




export default router
