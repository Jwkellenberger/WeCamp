require('dotenv').config();

var methodOverride = require('method-override'),
    LocalStrategy  = require('passport-local'),
    flash          = require('connect-flash'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    seedDB         = require('./seeds'),
    express        = require('express'),
    app            = express();
    

//importing mongoose data models
var Campground     = require('./models/campground'),
    Comment        = require('./models/comment'),
    User           = require('./models/user');

//importing routes
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes    = require('./routes/comments'),
    indexRoutes      = require('./routes/index'),
    userRouter       = require('./routes/user');

// ////////////////////////////////////////////////////////////////////////////
// RESTful route concepts
// ////////////////////////////////////////////////////////////////////////////
// REST - Representational State Transfer
// Mapping between HTTP routes and CRUD
// CRUD: Create - Read - Update - Destroy
// ===========================================================================
// name     | url            | verb      | desc.
// ===========================================================================
// INDEX    | /dogs          |   GET     | Display a list of all dogs
// NEW      | /dogs/new      |   GET     | Displays form to make a new dog
// CREATE   | /dogs          |   POST    | Create new dog &Redirect
// SHOW     | /dogs/:id      |   GET     | Shows info about specific dog
// EDIT     | /dogs/:id/edit |   GET     | Show edit form for specific dog
// UPDATE   | /dogs/:id      |   PUT     | Update specific dog &Redirect
// DESTROY  | /dogs/:id      |   DELETE  | Delete specific dog &Redirect
// ////////////////////////////////////////////////////////////////////////////


//initial server configuration
mongoose.connect('mongodb://localhost/we_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash()); // for flash messages and user feedback
// Not seeding atm - manual work for a while
//seedDB();

//Passport Configuration
app.use(require('express-session')({
    secret: 'ThereIslittle0303041922963Difference!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// forced middleware to populate current user info into all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//Require Routes: files export router with all gets/post/put's
app.use(indexRoutes);
app.use(userRouter);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Just to remember format of campground schema
// Campground.create({
//         name: 'Country Achres', 
//         image: 'https://images.pexels.com/photos/176381/pexels-photo-176381.jpeg?auto=compress&cs=tinysrgb&h=350',
//         description: 'This is an glorious place to spend time with nature and family, alike!'
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log('New Campground: ' + campground);
//         }
//     });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('WeCamping!');
});