const express = require('express')
const app = express()
const port = process.env.PORT_URL||5000
const path =require('path')
const cors=require('cors')
const bodyParser = require('body-parser')
const db =require('./db')
const router=require('./routers/index')
app.use(cors())
app.get('/', (req, res) => {
  res.send('chal rha hai ')
})
// listing on server

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// db conectiontion

db.connect();




//  middleware

app.use(bodyParser.json({limit:"50mb"}))
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}))
app.use(express.json())

// cors header method here

app.use((req,res,next)=>{

res.header('Access-Control-Allow-Origin',"*")
res.header('Access-Control-Allow-Headers',"*")
next();
}
)


// Api will be hre
app.use('/api',router)




//  Static resources





//  use of cors


