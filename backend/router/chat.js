import express from "express"
import {  requireSignIn } from "../middlewares/authmiddleware.js"
import { createchatController, deletechat, getchats, getonechat, updatechat } from "../controllers/chatcontroller.js"

const router = express.Router()




router.get('/getchats', getchats)
router.post('/createchat', createchatController)
router.get('/getone-chat/:id', getonechat)
router.put('/update-chat/:id', updatechat)
router.delete('/delete-chat/:id', deletechat)



export default router;