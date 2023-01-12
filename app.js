if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverRide = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/error')
const campgroundsRoutes = require('./routes/campgrounds.routes')
const reviewsRoutes = require('./routes/reviews.routes')
const sessions = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const User = require('./models/user')
const LocalStrategy = require('passport-local')
const userRoutes = require('./routes/users.routes')
const mongoSanitize = require('express-mongo-sanitize');

app.use(express.urlencoded({ extended: true }));

app.use(methodOverRide('_method'))
mongoose.connect(process.env.DBURL).then(() => {
    console.log("Conected to database")
}).catch(err => console.log(err))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
const store = MongoStore.create({
    mongoUrl: process.env.DBURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});
const sessioConfig = {
    store,
    name: 'session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(sessions(sessioConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use("/campgrounds", campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/', userRoutes)
// this is the last route because it is the catch all route

app.get('/', (req, res) => {
    res.render("home")
})
app.get('/home', (req, res) => {
    res.render("home")
})


app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = "OH No Something Went Wrong"
    res.status(status).render('error', { err })
})

app.listen(process.env.PORT||3000, () => {
    console.log(`listening on port 3000`)
})