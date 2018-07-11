var Campground = require('../models/campground'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware'),
    express    = require('express'),
    router     = express.Router({mergeParams: true});


//Comments New
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new', {campground: campground})
        }
    });
});

//need isLoggedIn to only allow comments to be created by Authenticated accounts
//Comments Create
router.post('/', middleware.isLoggedIn, function(req, res){
    //look up campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Database Mishap! Sorry!');
                    console.log(err);
                }else{
                    //add username and id to comment
                    //can only open this page as user b/c isLoggedIn
                    //console.log("new comment username will be " + req.user.username);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground/:id
                    console.log(comment);
                    req.flash('success', 'Successful comment post!');
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
            console.log(req.body.comment);
        }
    });
});

//Need middleware for authorization verification
//Comments Edit Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    // defined in app.js for campgrounds id
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect('back');
        } else{
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments Update Route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            req.flash('error', "The edit didn't stick!");
            res.redirect('back');
        } else {
            req.flash('success', 'Successful comment edit!');
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//comments Delete Route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;