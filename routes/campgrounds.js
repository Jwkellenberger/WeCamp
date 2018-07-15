var Campground     = require('../models/campground'),
    middleware     = require('../middleware'), // automatically requires index.ejs
    //methodOverride = require('method-override'),
    express        = require('express'),
    router         = express.Router();
    
var NodeGeocoder   = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);    
    
    
//INDEX Route: show all campgrounds
router.get('/', function(req, res){
    let perPage = 12;
    let pageQuery = parseInt(req.query.pageCt);
    let pageNumber = pageQuery ? pageQuery : 1;
    
    // contains username and id
    //Get all campgrounds from DB
    if(req.query.search){
        const searchTarget = new RegExp(escapeRegex(req.query.search), "gi");
        
        Campground.find({name: searchTarget}).skip((perPage*pageNumber) - perPage).limit(perPage).exec(function( err, allCampgrounds){
            if(err){
                console.log(err);
                req.flash('error', 'Database could not manage the data query for this page.');
                return res.redirect('back');
            }
            Campground.count({name: searchTarget}).exec(function (err, count){
                if(err){
                    console.log(err);
                    req.flash('error', 'Database could not populate campgrounds.');
                    return res.redirect('back');
                } else {
                    if(allCampgrounds.length < 1){
                        req.flash('error', 'That search resulted in 0 matches.');
                        return res.redirect("/campgrounds");
                    }
                    return res.render("campgrounds/index", {
                        pages: Math.ceil(count/perPage),
                        campgrounds: allCampgrounds, 
                        search: req.query.search,
                        page: 'campgrounds',
                        current: 1
                    });
                }
            });
        });
    }else {
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCampgrounds){
            if(err){
                console.log(err);
                req.flash('error', 'Database could not manage the data query for this page.');
                return res.redirect('back');
            }
            Campground.count().exec(function (err, count){
                if(err){
                    console.log(err);
                    req.flash('error', 'Database could not populate campgrounds.');
                    return res.redirect('back');
                } else{
                    return res.render("campgrounds/index", {
                        pages: Math.ceil(count/perPage),
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        page: 'campgrounds',
                        search: false
                    });
                }
            });
        });
    }
    // res.render('campgrounds', {campgrounds: campgrounds});
});


//CREATE Route: add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var desc = req.body.campground.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length){
            console.log(err);
            req.flash('error', 'Invalid address.');
            return res.redirect('back');
        }
        else{
            var lat = data[0].latitude;
            var lng = data[0].longitude;
            var location = data[0].formattedAddress;
            var newCampground = {name:name, image:image, description: desc, author: author, location: location, lat: lat, lng: lng};
            //Create a new campground and save to DB
            Campground.create(newCampground, function(err, newData){
                if(err){
                    req.flash('error', 'Data Creation Error: Data creation was unsuccessful!');
                    return res.redirect('back');
                } else {
                    return res.redirect("/campgrounds")
                }
            });
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
            req.flash('error', 'Data Pull Error: Database could not populate campgrounds.');
            return res.redirect('/campgrounds');
        }else{
            return res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    //render show template with that campground
    //res.send("This will be the show page, one day!");
})


//EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash('error', 'Data Pull Error: Database could not populate campgrounds.');
            return res.redirect('/campgrounds');
        }else{
             return res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            return res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});


// //UPDATE campground route
// router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
//     //find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if(err){
//             res.redirect('/campgrounds');
//         } else{
//             res.redirect('/campgrounds/' + req.params.id);
//         }
//     });
//     //redirect somewhere(show page)
// });


//DESTROY Campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("success",'Data Pull Error: Database could not find/remove the given campground.');
            return res.redirect('/campgrounds');
        } else{
            return res.redirect('/campgrounds');
        }
    });
});


function escapeRegex(text) {
    text = text.slice(0,19);
    text = text.replace(/[[\]{}!@#$%&*()!y]/g, '');
    return text.replace(/[-[\]{}*+?.,\\^$!#\s]/g, "\\$&");
};


module.exports = router;