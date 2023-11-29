const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    user_name:{
        type:String,
    },
    user_age:{
        type:Number,
    },
    user_location:{
        type:String
    },
    password:{
        type:String,
    }

})

module.exports = mongoose.model('users',userSchema);