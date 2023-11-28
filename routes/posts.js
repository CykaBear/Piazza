const express = require('express');
const router = express.Router();

const Post = require('../models/Posts');

router.get('/',async(req,res) =>{

    const posts = await Post.find();
    res.send(posts)
  


})

module.exports = router;