var mongoose = require('mongoose'),
    Admin = require('./models/admin'),
    Comment = require('./models/comment'),
    Post = require('./models/post');
    
function seedDB(){
    Admin.remove({}, function(err){
        if (err) {
            throw err;
        }
        console.log("admin cleared");
    });
    var newAdmin = new Admin({
        id: process.env.ADMIN_ID,
        password: process.env.ADMIN_PW
    });
    newAdmin.save(function(err){
        if (err) {
            throw err;
        }
        console.log("Default admin - id: " + newAdmin.id + " pw: " + newAdmin.password);
    });
    Comment.remove({}, function(err){
        if (err) {
            throw err;
        }
        console.log("comments cleared");
    });
    Post.find({}, function(err, posts){
        if (err) {
            console.log("error in finding all posts");
            throw err;
        }
        posts.forEach(function(post){
            post.comments = [];
            post.save();
        });
        console.log("post comments cleared");
    });
}

module.exports = seedDB;