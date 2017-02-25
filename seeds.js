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
}

module.exports = seedDB;