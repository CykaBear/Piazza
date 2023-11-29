const joi = require('joi');

const registerValidation = (data) =>{
    const schemaValidation = joi.object({
        user_name:joi.string().required().min(3).max(256),
        user_age:joi.number().required().min(1).max(110), 
        user_location:joi.string(),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) =>{
    const schemaValidation = joi.object({
        user_name:joi.string().required().min(3).max(256),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) =>{
    const schemaValidation = joi.object({
        user_name:joi.string().min(3).max(256),
        title:joi.string().required().min(3).max(256),
        text:joi.string().required().min(3).max(1024),
        hashtag:joi.string().valid('#Tech','#Politics','#Sports','#Health').required(),//Only allow these four hashtags
        location:joi.string(),
        url:joi.string(),
        date:joi.date().default('now'),
        comment:joi.array(), //This lets us store a JSON entry(using the comment schema) as a value in a post so we can view it along with the post
        expires:joi.date().required().greater('now') //Expiry date has to be after the current time
    })
    return schemaValidation.validate(data)
}

const reactValidation = (data) =>{
    const schemaValidation = joi.object({
        post_id:joi.string().required().max(256),
        reaction:joi.boolean().required() //If the user liked or disliked a comment
    })
    return schemaValidation.validate(data)
}

const commentValidation = (data) =>{
    const schemaValidation = joi.object({
        post_id:joi.string().required().max(256),
        comment_text:joi.string().required().min(1).max(1024),
        comment_date:joi.date().default('now') //Date is by default the current date but users are allowed to change it
        
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.reactValidation = reactValidation
module.exports.commentValidation = commentValidation