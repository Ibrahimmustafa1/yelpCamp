const BaseJoi = require('joi');
const ExpressError = require('./utils/error')

const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)
const validateCampground = (req, res, next) => {
    const schema = Joi.object({
        camp: Joi.object({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0),
            description: Joi.string().required().escapeHTML(),
            location: Joi.string().required().escapeHTML()

        }).required(),
        deleteImgs: Joi.array()
    })
    const { error } = schema.validate(req.body)
    if (error) {
        const msg = error
        throw new ExpressError(msg, 400)
    }
    else next()
}
const reviewValidation = (req, res, next) => {
    const reviewValidationSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required(),
            body: Joi.string().required().escapeHTML(),
        }).required()
    })
    const { error } = reviewValidationSchema.validate(req.body)
    if (error) {

        const msg = error

        throw new ExpressError(msg, 400)
    }
    else next()
}

module.exports = { validateCampground, reviewValidation }