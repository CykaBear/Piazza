const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    user:{
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
        type:String
    }
})

module.exports = mongoose.model('posts',postSchema);