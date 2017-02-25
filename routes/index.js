var express = require('express'),
    fs = require('fs'),
    Post = require('../models/post.js'),
    middleware = require('../middleware/auth'),
    jsUtils = require('../jsUtils.js'),
    router = express.Router();
    
/* TODOs
 1. make route for remove
 2. think of a clever way to save new files
 */
    
router.get('/', function(req, res){
    Post.find({}, function(err, allPosts){
        if (err) {
            throw err;
        }
        res.render('home', {posts: allPosts});
    });
});

router.get('/aboutme', function(req, res){
    res.render('aboutme');
});

router.get('/aboutsite', function(req, res){
    res.render('aboutsite');
});

router.get('/update', function(req, res){
    res.render('update');
});

router.post('/loginupdate', middleware.checkAdmin, function(req, res){
    var postFolder = './post_files/'; // current folder is set where app.js is
    fs.readdir(postFolder, function(err, files){
        if (err) {
            throw err;
        }
        console.log(files);
        Post.findAll(function(err, posts){
            if (err) {
                throw err;
            }
            var postFilenameArr=[];
            for (var i = 0; i < posts.length; i++) {
                postFilenameArr.push(posts[i].fileName);
            }
            console.log("post count: " + posts.length + " file count: " + files.length);
            for (var i = 0; i < files.length; i++) {
                var postIndex = postFilenameArr.indexOf(files[i]);
                var data = fs.readFileSync(postFolder+files[i], 'utf8');
                if (postIndex >= 0) { // if there is a post corresponding to the file, just change the content
                    Post.findOneAndUpdate({fileName: files[i]}, {$set: {content: data}}, function(){
                        console.log(files[i] + " updated");
                    });
                } else {
                    var title = jsUtils.formatTitle(files[i].substring(0, files[i].length - ".txt".length));
                    var fileName = files[i];
                    var newPost = {title: title, fileName: fileName, content: data};
                    Post.create(newPost, function(err, result){
                        if (err) {
                            throw err;
                        }
                        console.log(result);
                    }); 
                }
            }
        });
        res.redirect('/');
    });
});

module.exports = router;
    