var mongoose = require('mongoose'),
    Admin = require('../models/admin'),
    Comment = require('../models/comment');

module.exports = {
    checkAdmin: function(req, res, next) {
        Admin.findOne({id: req.body.id}, function(err, doc){
            if (err) {
                throw err;
            }
            if (doc == null) {
                res.status(500).send("Wrong ID!");
            } else {
                var admin = new Admin({id : req.body.id});
                var authenticated = admin.authenticate(req.body.password, doc.hashedPassword, doc.salt);
                if (!authenticated) {
                    res.status(500).send("Wrong Password!");
                } else {
                    console.log("LoggedIn");
                    return next();
                }
            }
        });
    },
    
    commentAuth: function(req, res, next) {
        var commentObjId = mongoose.Types.ObjectId(req.body._id);
        Comment.findOne({_id: commentObjId}, function(err, doc){
            if (err) {
                console.log("comment " + req.body._id + " not found");
                throw err;
            } else {
                var tempComment = new Comment();
                var authenticated = tempComment.authenticate(req.body.password, doc.hashedPassword, doc.salt);
                if (authenticated) {
                    console.log("comment authenticated");
                    return next();
                } else {
                    res.send({success: false});
                }
            }
        })
    }
};