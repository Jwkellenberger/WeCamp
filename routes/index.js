var User          = require('../models/user'),
    passport      = require('passport'),
    express       = require('express'),
    router        = express.Router();

//Root Route
router.get('/', function(req, res){
    res.render('campgrounds/landing');
});//MONGO DB CRUD -> //insert(), find(), update(), remove()



// = Auth Routes =

//Register Form Route
router.get('/register', function(req, res){
    res.render('register', {page: 'register'});
});

//Handle Sign Up Logic
router.post('/register', function(req, res){
    //Auth Stuff
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message); //present passport error
            return res.redirect('register', {error: err.message});
            //need feedback to user as to error..
        } else{
            passport.authenticate('local')(req,res, function(){
               req.flash('success', 'Thanks for Signing Up! \n Nice to finally have you on WeCamp, '+ user.username);
               res.redirect('/campgrounds'); 
            });
        }
    });
    //res.send('signing up!');
    //evential
    //res.redirect('/');
});

// login with 2 routes: (get => form, post => login)
//Show Login Form
router.get('/login', function(req, res){
    res.render('login', {page: 'login'});
});


//using setup for passport authentication for logging in!
//Handle Login Logic
router.post('/login', passport.authenticate('local', 
    {   successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: "Invalid username or password",
        successFlash: "Welcome to WeCamp!"
    }), function(req, res){
    //generic callback
});

//Handle Logout Logic
router.get('/logout', function(req, res){
    req.logout(); // comes from combo of passport and expres-sessions
    req.flash('success', 'Logged you out! Cheerio!');
    res.redirect('/campgrounds');
})

module.exports = router;