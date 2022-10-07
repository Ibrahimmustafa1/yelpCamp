const Campground = require('../models/campground');
const { cloudinary } = require('../cluoudnairy/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
    let page=req.query.page
    let q=req.query.q
    if(!page) page =1
    
    if(!q || q==='none'){
        q='none'
        const campgrounds = await Campground.find({}).skip(+page > 0 ? ((+page - 1) * 12) : 0).limit(12)
        const allCamps=await Campground.find({})
        let numOfCamps=await Campground.find({}).countDocuments()
        numOfCamps=Math.ceil(numOfCamps/12)
        res.render("campground/index", { campgrounds,numOfCamps,allCamps,q })
    }
   else if(q){
        const campgrounds = await Campground.find({title: { $regex: q, $options: 'i' }})
        const allCamps=await Campground.find({})
        let numOfCamps=await Campground.find({}).countDocuments()
        numOfCamps=Math.ceil(numOfCamps/12)
        res.render("campground/index", { campgrounds,numOfCamps,allCamps,q })
    }

}

module.exports.renderNewForm = (req, res) => {
    res.render('campground/new')
}

module.exports.createCampground = async (req, res, next) => {
    const { title, location, img, price, description } = req.body.camp
    const author = req.user._id
    const data = await geocodingClient.forwardGeocode({
        query: `${location}`,
        limit: 1
    }).send()


    const camp = new Campground({ title, location, price, description, author })
    camp.geometry = data.body.features[0].geometry
    camp.imgs.push(...req.files.map(f => ({ url: f.path, filename: f.filename })))
    await camp.save()

    req.flash('success', 'Successfully Created')

    res.redirect(`/campgrounds/${camp._id}`)
}


module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }

    res.render("campground/show", { campground })
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render("campground/edit", { campground })
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const { title, location, description, price } = req.body.camp
    const campground = await Campground.findByIdAndUpdate(id, { title, location, description, price })
    campground.imgs.push(...req.files.map(f => ({ url: f.path, filename: f.filename })))
    await campground.save()

    if (req.body.deleteImgs) {
        for (let filename of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { imgs: { filename: { $in: req.body.deleteImgs } } } })

    }
    req.flash('success', 'Successfully Updated')
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Delete')
    res.redirect('/campgrounds')
}