const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');

module.exports.validateSite = (req, res, next) => {
    const siteSchema = Joi.object({
        site: Joi.object({
            name: Joi.string().required(),
            value: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const { error } = siteSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
