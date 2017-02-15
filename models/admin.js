var mongoose = require('mongoose'),
    crypto = require('crypto');
    
var adminSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true, 'default': ''},
    hashedPassword: {type: String, required: true, 'default': ''},
    salt: {type: String, required: true}
});

adminSchema
    .virtual('password')
    .set(function(password) {
        this._password = password; // ._ is probably for virtual password
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    });

adminSchema.method('encryptPassword', function(plainText, inSalt){
    if(inSalt) {
        return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
    } else {
        return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
    }
});

adminSchema.method('makeSalt', function(){
    return Math.round((new Date().valueOf() * Math.random())).toString();
});

adminSchema.method('authenticate', function(plainText, hashed_password, inSalt){
    if(inSalt) {
        return this.encryptPassword(plainText, inSalt) == hashed_password;
    } else {
        return this.encryptPassword(plainText) == this.hashed_password;
    }
});

module.exports = mongoose.model('Admin', adminSchema);