var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    fileName: {type: String, required: true},
    likes: {type: Number, 'default': 0},
    createdAt: {type: Date, 'default': Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

postSchema.static('countPosts', function(callback){
    return this.count({}, callback);
});

postSchema.static('findByFileName', function(fileName, callback){
    return this.find({fileName: fileName}, callback);
});

postSchema.static('findAll', function(callback){
    return this.find({}, callback);
});

module.exports = mongoose.model('Post', postSchema);