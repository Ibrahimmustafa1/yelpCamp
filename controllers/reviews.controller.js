const Campground = require('../models/campground');
const Review = require('../models/Reviews')

module.exports.createReview = async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${id}`)
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    res.redirect(`/campgrounds/${id}`)
}