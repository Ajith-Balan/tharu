import express from 'express'
import dotenv from 'dotenv'
import connection from './connection.js'
import auth from './router/auth.js'
import stateRoutes from './router/stateRoutes.js'
import siteRoutes from './router/siteRoutes.js'
import mcctrainRoutes from './router/mcctrainRoutes.js'
import worktypeRoutes from './router/worktypeRoutes.js'
import cors from 'cors'


dotenv.config()
connection()
const app =express()
app.use(cors())
app.use(express.json({ limit: "50mb" }));


app.use('/api/v1/auth',auth)
app.use('/api/v1/states',stateRoutes);
app.use('/api/v1/types',worktypeRoutes);

// app.get('/',(req,res)=>{
//     res.send({message:'welcome to ecom app'})
// })
app.use('/api/v1/site', siteRoutes)
app.use('/api/v1/mcctrain', mcctrainRoutes)



const PORT = process.env.PORT || 8080




app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
    
})
