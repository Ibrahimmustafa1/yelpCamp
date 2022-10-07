const router = require('express').Router({ mergeParams: true });;
const catchAsync = require('../utils/catchAsync')
const { validateCampground } = require('../validation')
const { isLogedIn, isAuthor } = require('../midlleware')
const { index, renderNewForm, createCampground, showCampground, renderEditForm, updateCampground, deleteCampground } = require('../controllers/campgrounds.controller')
const { cloudinary, storage } = require('../cluoudnairy/index')
const multer = require('multer')
var path = require('path');
const upload = multer({
    storage,
    fileFilter: function (req, file, callback) {
        let files = [file]
        if (files.length <= 0) {
            return callback(new Error('Image Is Required'))
        }
        for (let file of files) {
            var ext = path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.avif') {
                return callback(new Error('Only images are allowed'))
            }
        }
        callback(null, true)
    }
    , limits: { fileSize: 50000 }
})

// router.get('/',(req, res) => {
//     res.redirect('/campgrounds?page=1')
// })
router.get('/', catchAsync(index))
router.get('/new', isLogedIn, renderNewForm)
router.get('/:id', catchAsync(showCampground))
router.get('/:id/edit', isLogedIn, isAuthor, catchAsync(renderEditForm))
router.put('/:id', isLogedIn, isAuthor, upload.array('camp[img]'), validateCampground, catchAsync(updateCampground))
router.post('/', isLogedIn, upload.array('camp[img]'), validateCampground, catchAsync(createCampground))
router.delete('/:id', isAuthor, isLogedIn, catchAsync(deleteCampground))


module.exports = router;