
const User = require('../models/user')
const Campground= require('../models/campground');
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {
    try {
      
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const regiterdUser = await User.register(user, password)
        req.login(regiterdUser, err => {

            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login = (req, res) => {
    
    req.flash('success', 'Welcome back')
    const returnTo = req.session.returnTo || 'campgrounds';
    delete req.session.returnTo;
    res.redirect(returnTo)

}
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Goodbye')
        res.redirect('/campgrounds')
    })

}
module.exports.userCamps=async function (req, res) {

    const id =req.user._id
    const userCampgrounds = await Campground.find({author:id})
    res.render('campground/userCamps',{userCampgrounds})
}