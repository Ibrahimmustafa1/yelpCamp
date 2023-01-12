const router = require('express').Router({ mergeParams: true });
const catchAsync = require('../utils/handle')
const { reviewValidation } = require('../validation')
const { isLogedIn, isReviewAuthor } = require('../midlleware')
const { createReview, deleteReview } = require('../controllers/reviews.controller')
router.post('/', reviewValidation, isLogedIn, catchAsync(createReview))

router.delete('/:reviewId', isLogedIn, isReviewAuthor, catchAsync(deleteReview))

module.exports = router;