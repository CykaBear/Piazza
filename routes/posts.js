const express = require('express');
const router = express.Router();

const Post = require('../models/Posts');
const User = require('../models/Users');
const React = require('../models/Reactions')
const Comment = require('../models/Comments')
const verify = require('../verifyToken')

const {postValidation,reactValidation,commentValidation} = require('../validations/validations')

const jsonwebtoken = require('jsonwebtoken')

router.get('/posts',async(req,res) =>{

    const posts = await Post.find(); //Show all posts
    res.send(posts);

})

router.post('/posts',async(req,res) =>{

    if(req.body.hashtag != "#Politics" && req.body.hashtag != "#Tech" && req.body.hashtag != "#Sports" && req.body.hashtag != "#Health"){
        return res.send({message:"Incorrect hashtag provided!"})
    }
    const posts = await Post.find({hashtag:req.body.hashtag}); //Show the posts and filter bashed on hashtag provided
    res.send(posts);

})

router.post('/posts/popular',async(req,res) =>{

    const posts = await Post.find({hashtag:req.body.hashtag}).sort({activity:-1}); //Show the posts and filter bashed on hashtag provided also sorts based on popularity
    res.send(posts);

})

router.get('/posts/expired',async(req,res) =>{

    const posts = await Post.find({expires:{$lte: Date.now()}}); // Finds all the expired posts and shows them
    res.send(posts);

})

router.post('/posts/add',verify,async(req,res)=>{
    const {error} = (postValidation(req.body)) //Validate post before any logic commences
    if(error){
        return res.status(400).send({message:error['details'][0]['message']}) //Return a short error message on why it failed
    }

    const userID = await jsonwebtoken.verify(req.header('auth-token'),process.env.TOKEN_SECRET) //Decode the token back into an id
    const foundUser = await User.findOne({_id:userID._id}) 
    try{
        const post = new Post({
            user_name:foundUser.user_name,
            title:req.body.title,
            text:req.body.text, //Create post with info in POST request
            hashtag:req.body.hashtag,
            location:req.body.location,
            date:Date.now(),
            expires:req.body.expires
        })
        try{ // Try catch is inside another try catch to give it access to the post var as it's encapsulated
            const savedPost = await post.save()
            return res.send(savedPost.body)
        }catch(err){
            res.status(400).send({message:error})
        }
    }catch(err){
        
        return res.send({err})
    }
    
})

router.post('/posts/like',verify,async(req,res)=>{
    const {error} = (reactValidation(req.body))
    if(error){ //If the inputted information fails validation return an error with what's wrong
        return res.status(400).send({message:error['details'][0]['message']})
    }
    const userID = await jsonwebtoken.verify(req.header('auth-token'),process.env.TOKEN_SECRET) //Convert token ID back to user ID with the token secret
    const postID = req.body.post_id
    const post = await Post.findOne({_id:postID}) //Find the post you want to like/dislike
    if(!post){
        return res.status(404).send({message:'Post not found'}) //Errors if incorrect postID is entered
    }
    if(Date.now() > post.expires){
        return res.send({message:"Post is expired you can no longer comment or like it"}) //Stops users liking expired posts
    }
    const postLikes = post.likes //Grab the likes and activity field for later reference
    const postActivity = post.activity
    if(req.body.reaction){
        const reactedPost = await Post.updateOne({_id:postID},{$set:{likes:postLikes + 1,activity:postActivity + 1}}) // If user liked the post then add a like and increase the activity by 1
        
    }
    else if(!req.body.reaction){
        const reactedPost = await Post.updateOne({_id:postID},{$set:{likes:postLikes - 1,activity:postActivity + 1}}) //Same as above but for dislikes
        
    }
    const reaction = new React({
        user_id:userID, //Add the reaction to a reaction table so we have a history of likes/dislikes
        post_id:postID,
        reaction:req.body.reaction
    })
    try{
        const savedReaction = await reaction.save()
        res.send(savedReaction.body)
    }catch(err){
        return res.status(400).send({err})
    }

    
})

router.get('/posts/like',verify,async(req,res)=>{
    const userID = await jsonwebtoken.verify(req.header('auth-token'),process.env.TOKEN_SECRET)
    const likedPosts = await React.find({user_id:userID._id,reaction:true}) // Returns all liked posts of the user logged in
    res.send(likedPosts)
})

router.post('/posts/comment',verify,async(req,res)=>{
    const {error} = (commentValidation(req.body))
    if(error){ //If the inputted information fails validation return an error with what's wrong
        return res.status(400).send({message:error['details'][0]['message']})
    }
    const userID = await jsonwebtoken.verify(req.header('auth-token'),process.env.TOKEN_SECRET) //Convert token ID back to user ID with the token secret
    const userName = await User.findOne({_id:userID._id}) // Get the username from the user database using the user id
    console.log(userID._id)
    console.log(userName)
    const postID = req.body.post_id
    const post = await Post.findOne({_id:postID}) //Find the post you want to comment on
    if(!post){
        return res.status(404).send({message:'Post not found'}) //Errors if incorrect postID is entered
    }
    if(Date.now() > post.expires){
        return res.send({message:"Post is expired you can no longer comment or like it"}) //Stops users liking expired posts
    }
    const postActivity = post.activity //Grab the  activity field for later reference
    const reactedPost = await Post.updateOne({_id:postID},{$set:{activity:postActivity + 1}}) // Add 1 activity score to the post
    const comment = new Comment({
        post_id:postID,
        user_name:userName.user_name,
        comment_text:req.body.comment_text,
        date:Date.now()
    })
    try{
        const addedComment = await Post.updateOne({_id:postID},{$push:{comments:comment}})
        const savedComment = await comment.save()
        res.send(addedComment.body)
    }catch(err){
        return res.status(400).send({err})
        
    }
})

module.exports = router;