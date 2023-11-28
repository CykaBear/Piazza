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

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;