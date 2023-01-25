// DB Schema used in the database for the sites
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const SiteSchema = new Schema ({
    name: String,
    image: String,
    value: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//Mongoose middleware to delete all the reviews associated with a Site
// The middleware used in the route to detele a Site (findByIdAndDelete) triggers the middleware (findOneAndDelete) automatically. That why this code runs everytime a site is deleted.
SiteSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                // Using the "in" operator to remove all the elements within the reviews array.
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Site', SiteSchema);

