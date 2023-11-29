const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({

    user_id:{
        type:String
    },
    post_id:{
        type:String
    },
    reaction:{
        type:Boolean
    }
})

module.exports = mongoose.model('reactions',reactionSchema);