// Basic Settings
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    seedDB = require('./seeds'),
    app = express();
    
// Models settings
var Admin = require('./models/admin'),
    Post = require('./models/post'),
    Comment = require('./models/comment');

// Route settings
var indexRoute = require('./routes/index'),
    postRoute = require('./routes/posts'),
    commentRoute = require('./routes/comments');

mongoose.Promise = global.Promise;
var url = process.env.DATABASEURL;
// var url = "mongodb://localhost/noninertialframe";
mongoose.connect(url);
console.log("mongoose connected");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname+'/views');    
app.set('view engine', 'ejs');
seedDB();

app.use('/', indexRoute);
app.use('/posts', postRoute);
app.use('/posts/:id/comments', commentRoute);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('NoninertialFrame server has started');
});