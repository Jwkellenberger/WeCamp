// all middleware goes here
var Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){//otherwise redirect
                req.flash('error', 'Campground not found!');
                res.redirect('back');
                //message campground not found
            } else{//does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission for that operation!');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'You must log in to perform that operation!');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){//otherwise redirect
                req.flash('error', 'Comment not found!');
                res.redirect('back');
                //message campground not found
            } else{
                //does user own the campground?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You do not have permission for that operation!');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'You must log in to perform that operation!');
        res.redirect('back');
        //console.log('need to be logged in for that');
        //message must be logged in to do that
    }
}

//middleware for login authentication
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash('error', 'Please Login!');// shows on next request
        res.redirect('/login');
    }
}

module.exports = middlewareObj;