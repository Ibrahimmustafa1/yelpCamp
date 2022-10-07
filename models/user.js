const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userModelSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,

    },
})
userModelSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userModelSchema);