const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const post = require('../models/blog');

const verify = require('../verifyToken')



//Routes for blog

// To add data to the db
router.post('/posts', verify, async (req, res) => {

    const Post = new post({
        _id: new mongoose.Types.ObjectId(),
        author: req.body.author,
        content: req.body.content
    });

    try {
        const savedPost = await Post.save();
        res.status(200).send('Post created')
    } catch (err) {
        res.status(400).send(err);
    }

});

//To see allposts
router.get('/posts', verify, async (req, res) => {
    try {
        const allPosts = await post.find();
        res.status(200).json({ allPosts })
    }
    catch (err) { res.status(400).send(err); }

})

// To see a particular post with a id
router.get('/posts/:postId', verify, async (req, res) => {
    try {
        const id = req.params.postId;
        const singlePost = await post.findById(id);
        res.status(200).json({ singlePost })
    }
    catch (err) {
        res.status(400).send(err);
    }


})

//To update a particular post
router.patch('/posts/:postId', verify, async (req, res) => {
    try {
        var conditions = { _id: req.params.postId };
        await post.updateOne(conditions, req.body)
        res.status(200).send('Post Updated')
    }
    catch (err) {
        console.log(err);
    }
})

// To delete a route with a particular id
router.delete('/posts/:postId', verify, async (req, res) => {
    try {
        await post.findByIdAndDelete(req.params.postId)
        res.status(200).send('Post deleted')
    }
    catch (err) {
        res.status(400).send(err);
    }

})

module.exports = router;