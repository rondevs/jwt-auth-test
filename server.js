const express = require('express')
const mongoose = require('mongoose')
const app = express()
const user = require('./routes/user')
require('dotenv').config()
const checkAuth = require('./middlewares/checkAuth')
app.use(express.json())
app.use('/user', user)
mongoose.connect(process.env.MDB,{
    // newUrlParser : true,
    // userUnifiedTopology: true,
}).then(()=>console.log('connection successful')).catch((err)=>{console.log(err)})

app.get('/',checkAuth, (req, res)=>{
    res.status(200).json({
        'message': `Hello ${req.username}`
    })
})
app.listen(5000,()=>{
    console.log('server listenning')
})