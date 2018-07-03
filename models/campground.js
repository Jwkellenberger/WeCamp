var mongoose = require('mongoose');

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]
});

//combine schema into model -->> create, find, update, remove
//Campground = 
module.exports = mongoose.model("Campground", campgroundSchema);