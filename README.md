# WeCamp
Back-end basics mapping crud to Restful routing conventions using ME_N stack. No formal front-end framework was used.
In leu of a front-end framework, EJS files were used.
Ejs is a simple templating language that lets you generate HTML markup with plain JavaScript.

### The landing page aesthetic:

![InitialLanding](https://i.imgur.com/Wteddeu.png)

However, there is a slow animation fade, as you let the seconds role by

### The landing page mid-fade transition:

![fadeLanding](https://i.imgur.com/lcRaxY8.png)


### The index page of the site:

![initialIndex](https://i.imgur.com/EeCw56i.png)


### Feedback on successful log in:

![loginIndex](https://i.imgur.com/03Ugvih.jpg)


### Campgrounds/show for a post:

![Imgur](https://i.imgur.com/04YWuIj.jpg)
(scrolled out to show comments at the same time)

#### The page shows:
 * the data that composes a "campground" post.
 * comments that are attached to the campground post.
 * the "authorization" for editing and deleting "own" posts and comments.
 * the link to the personal account of the user that posted the campground post.
 * the google maps location that was input with the creation of the post (geocoded).


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
