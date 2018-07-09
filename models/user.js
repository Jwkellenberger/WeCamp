var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

//Set up user Model
var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type: String, required: true},//unique: true, required: true},
    isAdmin: {type: Boolean, default: false}
});

//Add Auth functionality from passport for mongoose!
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);