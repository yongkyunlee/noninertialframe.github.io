var express = require('express'),
    mongoose = require('mongoose'),
    Comment = require('../models/comment'),
    Post = require('../models/post'),
    middleware = require('../middleware/auth'),
    router = express.Router({mergeParams: true});

/* TODOs
 * 1. exception case when the content is empty
 * 2. flash message when password is wrong
 * 3. use ajax
 */

// new comment
router.post('/create', function(req, res, next){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Post loading error while creating comment");
            throw err;
        } else {
            var newComment = new Comment({
                content: req.body.content,
                nickName: req.body.nickname,
                password: req.body.password
            });
            
            newComment.save(function(err){
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
            post.comments.push(newComment);
            post.save();
            res.send({nickname: req.body.nickname,
                      content: req.body.content,
                      time: newComment.createdAt,
                      _id: newComment._id.toString()
            });
        }
    });
});

// comment delete
router.post('/delete', middleware.commentAuth, function(req, res){
    console.log('delete request at server')
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Post loading error while deleting comment");
            throw err;
        } else {
            // erase the comment from post.comments and delete comment
            var commentObjId = mongoose.Types.ObjectId(req.body._id);
            console.log(post.comments);
            console.log(commentObjId);
            Comment.findOneAndRemove({_id: commentObjId}, function(err, result){
                if (err) {
                    console.log("error deleting comment");
                    throw err;
                }
            });
            // remove comments from both post.comments and comment collection
            //arrayUtil.findAndRemove(post.comments, '$oid', req.body._id);
            var commentIndex = post.comments.indexOf(commentObjId); 
            if (commentIndex > -1) {
                post.comments.splice(commentIndex);
            } else {
                console.log("comment id: " + req.body._id + " not found in post.comments");
            }
            post.save();
            console.log('comment deleted');
            res.send({success: true});
        }
    });
});

// comment edit
router.put('/:comment_id', middleware.commentAuth, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if (err) {
            console.log("Post loading error while updating comment");
            throw err;
        }
        Comment.findByIdAndUpdate(req.params.comment_id, {$set: {content: req.body.updatedContent}}, function(err, result){
            if (err) {
                console.log("Error updating comment: " + req.params.comment_id);
                throw err;
            } else {
                res.send({success: true, newContent: req.body.updatedContent});
            }
        });
    });
});

module.exports = router;