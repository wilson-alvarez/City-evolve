//Elements required to run this App
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
// I have to destructure every variable of validateSquemas in order to use it
const { validateSite } = require('./validateSchemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const Site = require('./models/site');
const methodOverride = require('method-override');


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



// Landing page
app.get('/', (req, res) => {
        res.render('home')
});


// Route to show the template with all the sites
app.get('/sites', catchAsync(async (req, res) => {
    const sites = await Site.find({});
    res.render('sites/index', { sites });
}));

// Route to show the template to edit a site
app.get('/sites/new', (req, res) => {
    res.render('sites/new');
});

// Route to write in the database the information received from the new site form (creating a new site)
app.post('/sites', validateSite, catchAsync(async (req, res, next) => {
    const site = new Site(req.body.site);
    await site.save();
    res.redirect(`/sites/${site._id}`);
    }));


// Route to show the information related to a single site
app.get('/sites/:id', catchAsync(async (req, res) => {
    const site = await Site.findById(req.params.id);
    res.render('sites/show', { site });
}));

// Route to show the template with the form to edit a site
app.get('/sites/:id/edit', catchAsync(async (req, res) => {
    const site = await Site.findById(req.params.id);
    res.render('sites/edit', { site });
}));

// Route to update a site
app.put('/sites/:id', validateSite, catchAsync(async (req, res) => {
    const { id } = req.params; 
    const site = await Site.findByIdAndUpdate(id,{...req.body.site});
    res.redirect(`/sites/${site._id}`);
}));

// Route to delete a site
app.delete('/sites/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Site.findByIdAndDelete(id);
    res.redirect('/sites');
}));

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

