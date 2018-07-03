var Campground     = require('../models/campground'),
    middleware     = require('../middleware'), // automatically requires index.ejs
    //methodOverride = require('method-override'),
    express        = require('express'),
    router         = express.Router();
    

//INDEX Route: show all campgrounds
router.get('/', function(req, res){
    // contains username and id
    //Get all campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    // res.render('campgrounds', {campgrounds: campgrounds});
});

//CREATE Route: add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, image:image, description: desc, author: author}
    
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err,newData){
      if(err){
          console.log(err);
      }else{
          //Redirect back to campgrounds page
          res.redirect('/campgrounds')
      }  
    });
});

// NEW Route: show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// SHOW Route: shows more info about one campground
router.get("/:id", function(req,res){
    //find campground with provided ID
    //
    //HERE
    //Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground{
    //
    //Campground.findById(req.params.id, function(err, foundCampground){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    //render show template with that campground
    //res.send("This will be the show page, one day!");
})


//EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect('back');
        }else{
             res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

//UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
    //redirect somewhere(show page)
});

//DESTROY Campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;