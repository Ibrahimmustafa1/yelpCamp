
const mongoose = require('mongoose')
const Review = require('./Reviews')
const opts = { toJSON: { virtuals: true } };

const CamogroundSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    price: Number,
    description: String,
    location: String,
    imgs: [
        {
            url: String,
            filename: String
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
},opts)



CamogroundSchema.post('findOneAndDelete', async function (data) {
    if (data)
        await Review.deleteMany({ _id: { $in: data.reviews } })
})

CamogroundSchema.virtual('properties.popUpMarker').get(function () {
    return `<a href=campgrounds/${this._id}>${this.title}</a>`
})
module.exports = mongoose.model('Campground', CamogroundSchema)