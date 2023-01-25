//Elements required to run this App
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


// Requiring route files
const sites = require('./routes/sites');
const reviews = require('./routes/reviews');

//To fix the deprecation warning shown in the console when running the app
mongoose.set('strictQuery', false);

// Testing the connection between Mogoose and MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/city-evolve')
.then(() => {
    console.log('Connection Open!')
})
.catch(err => {
    console.log('Oh no error!')
    console.log(err)
});


const app = express();

// Setting up "ejs" as the view engine and ejsMate as the template engine
app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/views'));

//global middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Middleware to serve the public files
app.use(express.static(path.join(__dirname,'public')));



// Setting the session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: + 7*24*60*60*1000,
    }
}
app.use(session(sessionConfig));


//Setting up flash
app.use(flash());
// Middleware to access "success" or "error" messages stored in flash locally.
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Adding the routes defined in "sites.js" and "reviews.js", and attaching them to the endpoints "/sites" and "sites/:id/reviewss" respectively.
app.use('/sites', sites);
app.use('/sites/:id/reviews', reviews);

// Landing page
app.get('/', (req, res) => {
        res.render('home')
});


// Error handler for all the routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//Basic error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error', { err })
});

// Method to start the HTTP Server
app.listen(3000, () => {
    console.log('Serving on port 30')
});

