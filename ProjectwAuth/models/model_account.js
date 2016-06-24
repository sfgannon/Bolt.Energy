var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var AccountSchema = new mongoose.Schema({
	//Display Values
	firstName: String,
	lastName: String,
	owner: String,	
	address1: String,
	address2: String,
	city: String,
	state: String,
	zip: Number,
	type: String,
	approvalNumber: Number,
	availability: [],
	desc: String,
	images: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Image'
	}],
	certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
	}],
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
	//Account Attributes
	email: String,
	password: String,
	isAdmin: { type: Boolean, default: false },
	created: { type: Date, default: Date.now },
	modified: Date,
	userType: {
		type: String,
		enum: ['Producer','Consumer']
	}
});

AccountSchema.pre('save', function (next) {
    var account = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(account.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                account.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
AccountSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Account', AccountSchema);