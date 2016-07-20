var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    accountType: {
        type: String,
        enum: ['Producer','Consumer']
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    isAdmin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    modified: Date,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }]
});

UserSchema.pre('save', function (next) {
    var user = this;
    //Validation needed: if consumer should not have any projects
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });

    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);