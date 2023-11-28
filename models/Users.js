const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    user_name:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    user_age:{
        type:Number,
        require:true,
        min:1,
        max:3
    },
    user_location:{
        type:String
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    }

})

module.exports = mongoose.model('users',userSchema);