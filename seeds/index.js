// File to use the information coming "cities" to feed the database with test data
const mongoose = require('mongoose');
const Site = require('../models/site');
const cities = require('./cities');


// Testing the connection between Mogoose and MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/city-evolve')
.then(() => {
    console.log('Connection Open!')
})
.catch(err => {
    console.log('Oh no error!')
    console.log(err)
})

//Function to loop over the objects in the test data and add them into the Database
const seedBD = async() => {
    await Site.deleteMany({}); 
    for (let i = 0; i < 30; i++) { 
    const site = new Site({ name: `${cities[i].name}`, value: `${cities[i].value}`, description: `${cities[i].description}`, location: `${cities[i].location}` });  
    await site.save();  
    }  
};
    
seedBD();