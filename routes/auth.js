const express = require('express');
const router = express.Router();

const User = require('../models/Users');
const {registerValidation,loginValidation} = require('../validations/validations')

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
    //Insert user into database
    const user = new User({
        user_name:req.body.user_name,
        user_age:req.body.user_age,
        user_location:req.body.user_location,
        password:req.body.password
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

})

module.exports = router