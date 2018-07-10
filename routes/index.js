var Campground    = require('../models/campground'),//User
    User          = require('../models/user'),
    nodemailer      = require("nodemailer"),//User
    passport      = require('passport'),
    express       = require('express'),
    crypto        = require("crypto"),//User
    router        = express.Router(),
    aSync         = require("async");//User
    

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
    var newUser = new User({username: req.body.username,
                            email: req.body.email,
                            avatar: req.body.avatar,
                            // isAdmin: req.body.isAdmin,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName
                            });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message); //present passport error
            return res.redirect('/register');
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
});


router.get('/user/forgot', function(req, res){
    res.render("users/forgotPw");
});


router.post('/user/forgot', function(req, res, next){
    aSync.waterfall([
        function(done){
            crypto.randomBytes(20, function(err,buf){
                if(err){
                    req.flash('error', 'A password reset token could not be generated.');
                    return res.redirect('/user/forgot');
                }
                var token = buf.toString('hex');
                done(err,token);
            });
        },
        function(token, done){
            User.findOne({ email: req.body.email }, function(err, user){
                if(err || !user){
                    req.flash('error', 'There is no account linked to that e-mail address.');
                    return res.redirect('/user/forgot');
                }
                else{
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // time + 1 hr
                
                    user.save(function(err){
                        if(err){
                            req.flash('error', 'Could not save "password reset" data to database.');
                            return res.redirect('/user/forgot');
                        }
                        else{
                            console.log('I am done finding and updating the user!');
                            done(err, token,user);
                        }
                    });
                }
            });
        },
        function(token, user, done){
            console.log('I am attempting to send an e-mail!');
            let siteEmail = 'MavenHeeley@gmail.com';
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: siteEmail,
                    pass: 'Heeley2Duo'
                }
            });
            console.log('smtp Up!');
            let mailOptions = {
                to: user.email,
                from: siteEmail,
                text: 'WeCamp Automated Response: \n\n' + 
                    'You are receiving this because you (or someone else) submitted a request to reset your password.\n' +
                    'Please click on the following link, or paste this into your browser, to complete a password reset!\n' +
                    'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
                    'The password reset page is only active for 1 hour.'                
                
            };
            console.log('mailOptions Up!');
            smtpTransport.sendMail(mailOptions,function(err){
                if(err){
                    console.log('it Didnt work, again!');
                    console.log(err);
                    req.flash('error', 'Could not submit automated e-mail.');
                    return res.redirect('/user/forgot');
                }
                else{
                    console.log('Reset mail sent to ' + user + ' via ' + user.email);
                    req.flash('success', "An automated e-mail was sent to " + user.email + ' with further instructions.');
                    res.redirect('/campgrounds');
                    done('done');
                }
            });
        }
    ]);
});


router.get('/user/reset/:token', function(req, res){
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
    if(err || !user){
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
    }
    res.render("users/resetPw", {token: req.params.token});
    });
});


router.post('/user/reset/:token',function(req, res){
    aSync.waterfall([
        function(done){
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
               if(err){
                   req.flash('error', 'Password reset token is invalid or has expired.');
                   return res.redirect('back');
               }
               if(req.body.password === req.body.confirm){
                   user.setPassword(req.body.password, function(err){
                        if(err){
                          req.flash('error', 'Setting the new user password failed.');
                          return res.redirect('back');
                        }
                        else{
                            user.resetPasswordExpires = undefined;
                            user.resetPasswordToken = undefined;
                            user.save(function(err){
                                if(err){
                                    req.flash('error', 'Saving the new user password failed.');
                                    return res.redirect('back');
                                }
                                req.logIn(user,function(err){
                                    done(err,user);
                                });
                            });
                        }
                      
                   });
               }
               else{
                   req.flash('error', 'The password and confirmation did not match.');
                   return res.redirect('/user/reset/'+user.resetPasswordToken);
               }
                
            });
        },
        function(user,done){
            let siteEmail = 'MavenHeeley@gmail.com';
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user: siteEmail,
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: siteEmail,
                text: 'WeCamp Automated Response: \n\n' + 
                    'The e-mail is to notify you that the password for the account liked to this e-mail: ' + user.email + ' has been changed.\n' +
                    'Thank you for your patience!.'   
            };
            smtpTransport.sendMail(mailOptions, function(err){
                if(err){
                    req.flash('error', 'Could not submit automated e-mail.');
                    return res.redirect('/user/reset/'+user.resetPasswordToken);
                }
                req.flash('success', "Success! Your password has been changed!");
                res.redirect('/campgrounds');
                done();
            });
        }
    ]);
});


//Handle user page
router.get('/users/:id', function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash('error', 'Unfortunately, that user account is not active.');
            res.redirect('/campgrounds');
        } else{
            Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
                if(err){
                    console.log(err);
                    req.flash('error', 'Unfortunately, the campground database is fumbling.');
                    res.redirect('/campgrounds');
                } else{
                    res.render("users/show", {user: foundUser, campgrounds: campgrounds, page: 'user'});
            }});
        }
    });
});


module.exports = router;