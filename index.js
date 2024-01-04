// load .env file
require('dotenv').config()  //to load .env 
// import express
const express=require('express')

const cors=require('cors')

const routes=require('./Routes/routes')

require('./db/connection')

// create server using express
const projectServer=express()
projectServer.use(cors())          //to use cors in the server
projectServer.use(express.json())  //to covert the incoming json file data into java script 
projectServer.use(routes)

// export uploads folder to client
projectServer.use('/uploads',express.static('./uploads'))

const PORT=4000 || process.env.PORT
projectServer.listen(PORT,()=>{
    console.log(`_______Project Server Started At Port Number ${PORT}________`);
})

// resolve api request 
projectServer.get('/',(req,res)=>{
    res.send(`<div><h1>Project Server Started...</h1></div>`)
})

// projectServer.post('/',(req,res)=>{
//     res.send("POST METHOD")
// })

// projectServer.put('/',(req,res)=>{
//     res.send("PUT METHOD")
// })

