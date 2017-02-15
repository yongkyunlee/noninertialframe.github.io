var express = require('express'),
    Post = require('../models/post.js'),
    router = express.Router({mergeParams: true});

// show posts
router.get('/:id', function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, result){
        if (err){
            console.log("Error redirecting to the post page");
            throw err;
        } else {
            res.render("postpage", {post: result});
        }
   });
});

module.exports = router;