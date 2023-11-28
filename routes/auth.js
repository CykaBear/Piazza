const express = require('express');
const router = express.Router();

const User = require('../models/Users');
const {registerValidation,loginValidation} = require('../validations/validations')

const bcryptjs = require('bcryptjs')

const jsonwebtoken = require('jsonwebtoken')

router.post('/register',async(req,res)=>{
    // Check user information vs validation requirements
    const {error} = (registerValidation(req.body))
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    //Check for unique username
    const userExists = await User.findOne({user_name:req.body.user_name})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }
        const salt = await bcryptjs.genSalt(5)
        const hashedPassword = await bcryptjs.hash(req.body.password,salt)
        //Insert user into database
        const user = new User({
            user_name:req.body.user_name,
            user_age:req.body.user_age,
            user_location:req.body.user_location,
            password:hashedPassword
        })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){
        res.status(400).send({message:error})
    }
})

router.post('/login',async(req,res)=>{
    const {error} = (loginValidation(req.body))
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    const userExists = await User.findOne({user_name:req.body.user_name})
    if(!userExists){
        return res.status(400).send({message:'User doesnt exist'})
    }
    const passwordValidation = await bcryptjs.compare(req.body.password,userExists.password)
    if(!passwordValidation){
        return res.status(400).send({message:'Incorrect password'})
    }
    const token = jsonwebtoken.sign({_id:User._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({'auth-token':token})
})

module.exports = router