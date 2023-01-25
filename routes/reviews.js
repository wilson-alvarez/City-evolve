const express = require('express');
// Setting the router and the attribute "mergeParams" to true in order to get access to the params of the routes.
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Site = require('../models/site');
// I have to destructure every variable of validateSquemas in order to use it
const { validateSite, validateReview } = require('../validateSchemas');



// Route to create a "review", save it in the DB and associate it with a "site".
router.post('/', validateReview, catchAsync(async (req, res) => {
    const site = await Site.findById(req.params.id);
    const review = new Review(req.body.review);
    site.reviews.push(review);
    await review.save();
    await site.save();
    req.flash('success', 'Your review has been posted!');
    res.redirect(`/sites/${site._id}`);
}));

// Route to delete reviews
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Using the pull operator to remove an specific element from the reviews array.
    await Site.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Your review has been deleted!');
    res.redirect(`/sites/${id}`);
}));

module.exports = router;