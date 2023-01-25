// 
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Site = require('../models/site');
// I have to destructure every variable of validateSquemas in order to use it
const { validateSite, validateReview } = require('../validateSchemas');



// Route to show the template with all the sites
router.get('/', catchAsync(async (req, res) => {
    const sites = await Site.find({});
    res.render('sites/index', { sites });
}));

// Route to show the template to edit a site
router.get('/new', (req, res) => {
    res.render('sites/new');
});

// Route to write in the database the information received from the new site form (creating a new site)
router.post('/', validateSite, catchAsync(async (req, res) => {
    const site = new Site(req.body.site);
    await site.save();
    req.flash('success', `${site.name} has been created successfully!`)
    res.redirect(`/sites/${site._id}`);
}));


// Route to show the information related to a single site. Using two functions as an argument for the get route.
router.get('/:id', catchAsync(async (req, res) => {
    const site = await Site.findById(req.params.id).populate('reviews');
    res.render('sites/show', { site });
}),(err,req,res,next)=>{
    req.flash('error', 'Cannot find that site!');
    return res.redirect('/sites');
});

// Route to show the template with the form to edit a site
router.get('/:id/edit', catchAsync(async (req, res) => {
    const site = await Site.findById(req.params.id);
    res.render('sites/edit', { site });
}),(err,req,res,next)=>{
    req.flash('error', 'It is not possible to edit a site that does not exist!');
    return res.redirect('/sites');
});

// Route to update a site
router.put('/:id', validateSite, catchAsync(async (req, res) => {
    const { id } = req.params; 
    const site = await Site.findByIdAndUpdate(id,{...req.body.site});
    req.flash('success', 'Site has been updated successfully!');
    res.redirect(`/sites/${site._id}`);
}));

// Route to delete a site
router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    await Site.findByIdAndDelete(id);
    req.flash('success', 'Site has been deleted!');
    res.redirect('/sites');
}));


module.exports = router;