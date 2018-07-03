var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

//Set up user Model
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Add Auth functionality from passport for mongoose!
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);