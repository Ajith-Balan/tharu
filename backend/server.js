import express from 'express'
import dotenv from 'dotenv'
import connection from './connection.js'
import auth from './router/auth.js'
import mcctrainRoutes from './router/mcctrainRoutes.js'
import workersRoutes from './router/workersRoutes.js'
import cors from 'cors'


dotenv.config()
connection()
const app =express()
app.use(cors())
app.use(express.json({ limit: "50mb" }));



app.use('/api/v1/auth',auth)


// app.get('/',(req,res)=>{
//     res.send({message:'welcome to ecom app'})
// })

app.use('/api/v1/worker', workersRoutes)
app.use('/api/v1/mcctrain', mcctrainRoutes)



const PORT = process.env.PORT || 1000




app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
    
})
