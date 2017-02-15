var mongoose = require('mongoose'),
    crypto = require('crypto');
    
var commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    nickName: {type: String, required: true},
    hashedPassword: {type: String, required: true, 'default': ''},
    salt: {type: String, required: true},
    createdAt: {type: Date, 'default': Date.now},
    updatedAt: {type: Date, 'default': Date.now}
});

commentSchema
    .virtual('password')
    .set(function(password) {
        this._password = password; // ._ is probably for virtual password
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    });

commentSchema.method('encryptPassword', function(plainText, inSalt){
    if(inSalt) {
        return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
    } else {
        return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
    }
});

commentSchema.method('makeSalt', function(){
    return Math.round((new Date().valueOf() * Math.random())).toString();
});

commentSchema.method('authenticate', function(plainText, hashedPassword, inSalt){
    if(inSalt) {
        return this.encryptPassword(plainText, inSalt) == hashedPassword;
    } else {
        return this.encryptPassword(plainText) == this.hashedPassword;
    }
});

module.exports = mongoose.model('Comment', commentSchema);