# WeCamp
Back-end basics mapping crud to Restful routing conventions using ME_N stack. No formal front-end framework was used.
In leu of a front-end framework, EJS files were used.
Ejs is a simple templating language that lets you generate HTML markup with plain JavaScript.

### The landing page:

![fadeLanding](https://i.imgur.com/lcRaxY8.png)

#### The page shows:
 * the site landing page aesthetic.
 * a slow animation fading between background images.

### The index site:

![loginIndex](https://i.imgur.com/03Ugvih.jpg)

#### The page shows:
 * a title bar that indicates a successful log in.
 * users have to be logged in to create a database post.
 * the index pulls from a mongodb database to fill campgrounds.
 * the logged-in state converts Login/Register buttons to a log out option.

### Campgrounds/show for a post:

![Imgur](https://i.imgur.com/04YWuIj.jpg)
(scrolled out to show comments at the same time)

#### The page shows:
 * the data that composes a "campground" post.
 * comments that are attached to the campground post.
 * the "authorization" for editing and deleting "own" posts and comments.
 * the link to the personal account of the user that posted the campground post.
 * the google maps location that was input with the creation of the post (geocoded).


### Profile pages for users that post campgrounds:

![Imgur](https://i.imgur.com/7degJjc.jpg)

#### The page shows:
 * user data that is pulled from mongodb.
 * a list to the right that contains all campground posts of the user.
 * (will be updated to allow for user data editing [including pw change]).


## Dependencies in elaboration:

#### For framework:

 * ejs: ^2.6.1
 * express: ^4.16.3
 * express-session: ^1.15.6

#### For RESTful routing:

 * method-override: ^2.3.10
 * body-parser: ^1.18.3

#### For feedback to user:

 * connect-flash: "^0.1.1

#### For data persistance:

 * mongoose: ^5.1.4

#### For Authentication and Authorization:

 * passport: ^0.4.0
 * passport-local: ^1.0.0
 * passport-local-mongoose: ^5.0.0
