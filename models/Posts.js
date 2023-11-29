const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    user_name:{
        type:String
    },
    title:{
        type:String
    },
    text:{
        type:String
    },
    hashtag:{
        type:String
    },
    location:{
        type:String
    },
    url:{
        type:String
    },
    date:{
        type:Date
    },
    expires:{
        type:Date
    },
    likes:{
        type:Number,
        default: 0
    },
    comments:{
        type:Array,
    },
    activity:{
        type:Number,
        default: 0
    }
})

module.exports = mongoose.model('posts',postSchema);