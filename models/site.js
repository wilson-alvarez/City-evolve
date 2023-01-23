// DB Schema used in the database for the sites
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiteSchema = new Schema ({
    name: String,
    image: String,
    value: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Site', SiteSchema);