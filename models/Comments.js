const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    post_id:{
        type:String
    },
    user_name:{
        type:String
    },
    comment_text:{
        type:String
    },
    date:{
        type:Date
    }
   
})

module.exports = mongoose.model('comments',commentSchema);