const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const router = express.Router()
const userSchema = require('../schema/userSchema')
// require('dotenv').config()

const User = new mongoose.model('User', userSchema)



// sign up
router.post('/signup', async (req, res)=>{
    try{

        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const user = await User.find({username: req.body.username.trim()})
        if(user.length==0){
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                password: hashedPass
            })
        
            await newUser.save();
            res.status(200).json({
                message: 'Signup was successful'
            })

        }else{
            res.status(401).json({
                message:"Invalid Username"
            })
        }
    }
    catch(err){
        if(err){
            res.status(500).json({
                message:"Signup failed"
            })
        }
    }
})


router.post('/login', async (req, res)=>{
    try{

        const user = await User.find({username: req.body.username})
        if(user && user.length>0){
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if(isValidPassword){
                 const token = jwt.sign({
                     username: user[0].username,
                     userId: user[0]._id,
                 }, process.env.JWT_SECRET, {
                     expiresIn: '1h'
                 })
    
                 res.status(200).json({
                     "access token": token,
                     "message": "login successful"
                 })
            }else{
                res.status(401).json({
                "error": "Authentication failed"
                });
            }
        }else{
            res.status(401).json({
                "error": "Authentication failed"
            });
        }
    } 
    catch(error){
        res.status(401).json({
                'error': 'Authentication failed'
        });
            console.log('error in catch')
    }
})


module.exports = router