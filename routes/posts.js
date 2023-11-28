const express = require('express');
const router = express.Router();

const Post = require('../models/Posts');
const verify = require('../verifyToken')

router.get('/posts',verify,async(req,res) =>{

    const posts = await Post.find();
    res.send(posts);

})

module.exports = router;