// Routes for authentication
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { validateSite, validateReview } = require('../validateSchemas'); // I have to destructure every variable of validateSquemas in order to use it
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');

// Route to show the register template
router.get('/register', (req, res) => {
    res.render('users/register'); //The path to the "views" folder is shorter because it was setup in the middleware
});

//Route to create a user
router.post('/register', catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User ({ email, username});
    const registeredUser = await User.register(user, password); //".register" is a method provided by the "passport-local-mongoose" library that is used to register a new user
    req.login(registeredUser, err => { // req.login() is a method provided by the passport middleware that is used to establish an authenticated session for a user. 
        if(err) return next(err);
        req.flash('success','Welcome to Yelp Camp!');
        res.redirect('/sites');
    })}),(err,req,res,next)=>{
    req.flash('error', `${err.message}`);
    return res.redirect('/register');
});

//Route to show the login template
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Route to authenticate a user 
router.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/sites';
    delete req.session.returnTo; //to delete the value of that variable from the session object
    res.redirect('/redirectUrl');
});

//Route to logout using the logout method of Passport
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('/sites');
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/sites');
    });
});

module.exports = router;

