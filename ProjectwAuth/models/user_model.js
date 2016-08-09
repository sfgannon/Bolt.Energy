var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UploadModel = new mongoose.Schema({
	filename: String,
	filetype: String,
	description: String,
	primaryImage: Boolean,
  // item: { type: mongoose.Schema.Types.ObjectId, required: true }
  base64: { type: String, required: true },
	filesize: Number
});

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    accountType: {
        type: String,
        enum: ['Producer','Consumer']
    },
    isAdmin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    modified: Date,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    uploads: [ UploadModel ]
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